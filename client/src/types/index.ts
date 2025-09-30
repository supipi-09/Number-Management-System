export interface User {
  _id: string;
  username: string;
  email: string;
  role: "admin" | "planner";
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

export interface NumberRecord {
  _id: string;
  number: string;
  status: "Available" | "Allocated" | "Reserved" | "Held" | "Quarantined";
  serviceType: "LTE" | "IPTL" | "FTTH/Copper";
  specialType: "Elite" | "Gold" | "Platinum" | "Silver" | "Standard";
  allocatedTo?: string;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NumberLog {
  _id: string;
  number: string;
  action:
    | "Allocated"
    | "Released"
    | "Reserved"
    | "Status Changed"
    | "Created"
    | "Deleted";
  performedBy: {
    _id: string;
    username: string;
  };
  timestamp: string;
  previousState?: Partial<NumberRecord>;
  newState?: Partial<NumberRecord>;
  notes?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface DashboardStats {
  totalNumbers: number;
  allocatedNumbers: number;
  availableNumbers: number;
  reservedNumbers: number;
  heldNumbers: number;
  quarantinedNumbers: number;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
