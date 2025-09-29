import { Request, Response } from "express";
import NumberModel from "../models/Number";
import NumberLog from "../models/NumberLog";
import { IUser, ImportResult } from "../types";
import csv from "csv-parser";
import { Readable } from "stream";

interface AuthRequest extends Request {
  user?: IUser;
}

export const getNumbers = async (req: Request, res: Response) => {
  try {
    const {
      status,
      serviceTypes,
      specialTypes,
      search,
      page = 1,
      limit = 25,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    // Build filter object
    const filter: any = {};

    if (status) filter.status = status;
    if (serviceTypes) {
      const types = (serviceTypes as string).split(",");
      filter.serviceType = { $in: types };
    }
    if (specialTypes) {
      const types = (specialTypes as string).split(",");
      filter.specialType = { $in: types };
    }
    if (search) {
      filter.$or = [
        { number: { $regex: search, $options: "i" } },
        { allocatedTo: { $regex: search, $options: "i" } },
      ];
    }

    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);
    const sortOptions: any = {};
    sortOptions[sortBy as string] = sortOrder === "desc" ? -1 : 1;

    // Get numbers with pagination
    const numbers = await NumberModel.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit));

    // Get total count for pagination
    const total = await NumberModel.countDocuments(filter);

    res.json({
      success: true,
      data: numbers,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
      message: "Numbers retrieved successfully",
    });
  } catch (error) {
    console.error("Get numbers error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getNumber = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const number = await NumberModel.findById(id);

    if (!number) {
      return res.status(404).json({
        success: false,
        message: "Number not found",
      });
    }

    res.json({
      success: true,
      data: number,
      message: "Number retrieved successfully",
    });
  } catch (error) {
    console.error("Get number error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const createNumber = async (req: AuthRequest, res: Response) => {
  try {
    const numberData = req.body;
    const userId = req.user?._id;

    // Check if number already exists
    const existingNumber = await NumberModel.findOne({
      number: numberData.number,
    });
    if (existingNumber) {
      return res.status(400).json({
        success: false,
        message: "Number already exists",
      });
    }

    const number = new NumberModel(numberData);
    await number.save();

    // Create log entry
    if (userId) {
      await NumberLog.create({
        number: number.number,
        action: "Created",
        performedBy: userId,
        newState: number.toObject(),
        notes: "Number created",
      });
    }

    res.status(201).json({
      success: true,
      data: number,
      message: "Number created successfully",
    });
  } catch (error) {
    console.error("Create number error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateNumber = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const userId = req.user?._id;

    const existingNumber = await NumberModel.findById(id);
    if (!existingNumber) {
      return res.status(404).json({
        success: false,
        message: "Number not found",
      });
    }

    const previousState = existingNumber.toObject();

    const updatedNumber = await NumberModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedNumber) {
      return res.status(404).json({
        success: false,
        message: "Number not found",
      });
    }

    // Create log entry
    if (userId) {
      let action = "Status Changed";
      if (updateData.status === "Allocated") action = "Allocated";
      else if (
        previousState.status === "Allocated" &&
        updateData.status !== "Allocated"
      )
        action = "Released";
      else if (updateData.status === "Reserved") action = "Reserved";

      await NumberLog.create({
        number: updatedNumber.number,
        action,
        performedBy: userId,
        previousState,
        newState: updatedNumber.toObject(),
        notes: `Number ${action.toLowerCase()}`,
      });
    }

    res.json({
      success: true,
      data: updatedNumber,
      message: "Number updated successfully",
    });
  } catch (error) {
    console.error("Update number error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const importNumbers = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const userId = req.user?._id;
    const results: ImportResult = {
      success: 0,
      failed: 0,
      errors: [],
    };

    const csvData: any[] = [];
    const stream = Readable.from(req.file.buffer);

    stream
      .pipe(csv())
      .on("data", (data) => csvData.push(data))
      .on("end", async () => {
        for (let i = 0; i < csvData.length; i++) {
          const row = csvData[i];
          const lineNumber = i + 2; // +2 because CSV starts from line 1 and we skip header

          try {
            // Validate required fields
            if (!row.number || !row.serviceType) {
              results.failed++;
              results.errors.push(
                `Line ${lineNumber}: Missing required fields (number, serviceType)`
              );
              continue;
            }

            // Validate service type
            if (!["LTE", "IPTL", "FTTH/Copper"].includes(row.serviceType)) {
              results.failed++;
              results.errors.push(
                `Line ${lineNumber}: Invalid service type "${row.serviceType}"`
              );
              continue;
            }

            // Check if number already exists
            const existingNumber = await NumberModel.findOne({
              number: row.number,
            });
            if (existingNumber) {
              results.failed++;
              results.errors.push(
                `Line ${lineNumber}: Number ${row.number} already exists`
              );
              continue;
            }

            // Create number
            const numberData = {
              number: row.number,
              serviceType: row.serviceType,
              specialType: row.specialType || "Standard",
              status: row.status || "Available",
              allocatedTo: row.allocatedTo,
              remarks: row.remarks,
            };

            const number = new NumberModel(numberData);
            await number.save();

            // Create log entry
            if (userId) {
              await NumberLog.create({
                number: number.number,
                action: "Created",
                performedBy: userId,
                newState: number.toObject(),
                notes: "Number imported from CSV",
              });
            }

            results.success++;
          } catch (error) {
            results.failed++;
            results.errors.push(
              `Line ${lineNumber}: ${(error as Error).message}`
            );
          }
        }

        res.json({
          success: true,
          data: results,
          message: `Import completed: ${results.success} successful, ${results.failed} failed`,
        });
      });
  } catch (error) {
    console.error("Import numbers error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getNumberStats = async (req: Request, res: Response) => {
  try {
    const stats = await NumberModel.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const totalNumbers = await NumberModel.countDocuments();

    const result = {
      totalNumbers,
      allocatedNumbers:
        stats.find((s: any) => s._id === "Allocated")?.count || 0,
      availableNumbers:
        stats.find((s: any) => s._id === "Available")?.count || 0,
      reservedNumbers: stats.find((s: any) => s._id === "Reserved")?.count || 0,
      heldNumbers: stats.find((s: any) => s._id === "Held")?.count || 0,
      quarantinedNumbers:
        stats.find((s: any) => s._id === "Quarantined")?.count || 0,
    };

    res.json({
      success: true,
      data: result,
      message: "Number statistics retrieved successfully",
    });
  } catch (error) {
    console.error("Get number stats error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const deleteNumber = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Find the number to delete
    const numberToDelete = await NumberModel.findById(id);
    if (!numberToDelete) {
      return res.status(404).json({
        success: false,
        message: "Number not found",
      });
    }

    // Create log entry before deletion
    const log = new NumberLog({
      number: numberToDelete.number,
      action: "Deleted",
      performedBy: req.user?._id,
      timestamp: new Date(),
      previousState: {
        status: numberToDelete.status,
        serviceType: numberToDelete.serviceType,
        specialType: numberToDelete.specialType,
        allocatedTo: numberToDelete.allocatedTo,
        remarks: numberToDelete.remarks,
      },
      notes: "Number deleted from system",
    });
    await log.save();

    // Delete the number
    await NumberModel.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Number deleted successfully",
    });
  } catch (error) {
    console.error("Delete number error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
