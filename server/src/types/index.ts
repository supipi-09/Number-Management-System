import { Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: "admin" | "planner";
  isActive: boolean;
  createdAt: Date;
  lastLogin?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface INumber extends Document {
  number: string;
  status: "Available" | "Allocated" | "Reserved" | "Held" | "Quarantined";
  serviceType: "LTE" | "IPTL" | "FTTH/Copper";
  specialType: "Elite" | "Gold" | "Platinum" | "Silver" | "Standard";
  allocatedTo?: string;
  remarks?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface INumberLog extends Document {
  number: string;
  action:
    | "Allocated"
    | "Released"
    | "Reserved"
    | "Status Changed"
    | "Created"
    | "Deleted";
  performedBy: IUser["_id"];
  timestamp: Date;
  previousState?: Partial<INumber>;
  newState?: Partial<INumber>;
  notes?: string;
}

export interface AuthRequest extends Request {
  user?: IUser;
}

export interface DashboardStats {
  totalNumbers: number;
  allocatedNumbers: number;
  availableNumbers: number;
  reservedNumbers: number;
  heldNumbers: number;
  quarantinedNumbers: number;
}

export interface ImportResult {
  success: number;
  failed: number;
  errors: string[];
}
