import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User";
import Number from "../models/Number";
import NumberLog from "../models/NumberLog";

// Load environment variables
dotenv.config();

const connectDB = async () => {
  try {
    const mongoURI =
      process.env.MONGODB_URI || "mongodb://localhost:27017/number_management";
    await mongoose.connect(mongoURI);
    console.log("✅ MongoDB Connected for seeding");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1);
  }
};

const seedUsers = async () => {
  try {
    // Clear existing users
    await User.deleteMany({});

    const users = [
      {
        username: "admin",
        email: "admin@numberms.com",
        password: "admin123",
        role: "admin",
        isActive: true,
      },
      {
        username: "planner",
        email: "planner@numberms.com",
        password: "planner2024",
        role: "planner",
        isActive: true,
      },
      {
        username: "planner2",
        email: "planner2@numberms.com",
        password: "planner2024",
        role: "planner",
        isActive: true,
      },
    ];

    const createdUsers = [];
    for (const userData of users) {
      const user = new User(userData);
      await user.save();
      createdUsers.push(user);
    }
    console.log(`✅ Created ${createdUsers.length} users`);
    return createdUsers;
  } catch (error) {
    console.error("❌ Error seeding users:", error);
    throw error;
  }
};

const seedNumbers = async () => {
  try {
    // Clear existing numbers
    await Number.deleteMany({});

    const numbers = [];
    const statuses = [
      "Available",
      "Allocated",
      "Reserved",
      "Held",
      "Quarantined",
    ];
    const serviceTypes = ["LTE", "IPTL", "FTTH/Copper"];
    const specialTypes = ["Elite", "Gold", "Platinum", "Silver", "Standard"];
    const customers = [
      "Customer A",
      "Customer B",
      "Customer C",
      "Corporate D",
      "Business E",
    ];

    // Generate 1000 sample numbers
    for (let i = 1; i <= 1000; i++) {
      const number = `071${String(i).padStart(7, "0")}`;
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const serviceType =
        serviceTypes[Math.floor(Math.random() * serviceTypes.length)];
      const specialType =
        specialTypes[Math.floor(Math.random() * specialTypes.length)];

      numbers.push({
        number,
        status,
        serviceType,
        specialType,
        allocatedTo:
          status === "Allocated"
            ? customers[Math.floor(Math.random() * customers.length)]
            : undefined,
        remarks:
          Math.random() > 0.7 ? `Sample remarks for ${number}` : undefined,
        createdAt: new Date(2024, 0, Math.floor(Math.random() * 30) + 1),
        updatedAt: new Date(2024, 0, Math.floor(Math.random() * 30) + 15),
      });
    }

    const createdNumbers = await Number.insertMany(numbers);
    console.log(`✅ Created ${createdNumbers.length} numbers`);
    return createdNumbers;
  } catch (error) {
    console.error("❌ Error seeding numbers:", error);
    throw error;
  }
};

const seedLogs = async (users: any[], numbers: any[]) => {
  try {
    // Clear existing logs
    await NumberLog.deleteMany({});

    const logs = [];
    const actions = [
      "Allocated",
      "Released",
      "Reserved",
      "Status Changed",
      "Created",
    ];

    // Generate sample logs for random numbers
    for (let i = 0; i < 500; i++) {
      const randomNumber = numbers[Math.floor(Math.random() * numbers.length)];
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const randomAction = actions[Math.floor(Math.random() * actions.length)];

      logs.push({
        number: randomNumber.number,
        action: randomAction,
        performedBy: randomUser._id,
        timestamp: new Date(2024, 0, Math.floor(Math.random() * 30) + 1),
        notes: `Sample ${randomAction?.toLowerCase() || "unknown"} action for ${
          randomNumber.number
        }`,
      });
    }

    const createdLogs = await NumberLog.insertMany(logs);
    console.log(`✅ Created ${createdLogs.length} logs`);
    return createdLogs;
  } catch (error) {
    console.error("❌ Error seeding logs:", error);
    throw error;
  }
};

const seedDatabase = async () => {
  try {
    console.log("🌱 Starting database seeding...");

    await connectDB();

    const users = await seedUsers();
    const numbers = await seedNumbers();
    const logs = await seedLogs(users, numbers);

    console.log("🎉 Database seeding completed successfully!");
    console.log(`📊 Summary:`);
    console.log(`   - Users: ${users.length}`);
    console.log(`   - Numbers: ${numbers.length}`);
    console.log(`   - Logs: ${logs.length}`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Database seeding failed:", error);
    process.exit(1);
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

export default seedDatabase;
