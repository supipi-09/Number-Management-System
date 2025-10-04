import { supabase } from "../lib/supabase";
import {
  User,
  NumberRecord,
  NumberLog,
  DashboardStats,
  LoginCredentials,
  ApiResponse,
} from "../types";

// Helper to convert database user to app User type
const mapDbUserToUser = (dbUser: any): User => ({
  _id: dbUser.id,
  username: dbUser.username,
  email: dbUser.email,
  role: dbUser.role,
  isActive: dbUser.status === 'active',
  createdAt: dbUser.created_at,
  lastLogin: dbUser.updated_at,
});

// Helper to convert database number to app NumberRecord type
const mapDbNumberToRecord = (dbNumber: any): NumberRecord => ({
  _id: dbNumber.id,
  number: dbNumber.number,
  status: dbNumber.status,
  serviceType: "LTE",
  specialType: dbNumber.category,
  allocatedTo: dbNumber.assigned_to,
  remarks: dbNumber.notes,
  createdAt: dbNumber.created_at,
  updatedAt: dbNumber.updated_at,
});

// Helper to convert database log to app NumberLog type
const mapDbLogToLog = (dbLog: any): NumberLog => ({
  _id: dbLog.id,
  number: dbLog.numbers?.number || '',
  action: dbLog.action,
  performedBy: {
    _id: dbLog.users?.id || '',
    username: dbLog.users?.username || 'System',
  },
  timestamp: dbLog.performed_at,
  notes: dbLog.description,
});

// Auth API
export const authAPI = {
  login: async (
    credentials: LoginCredentials
  ): Promise<ApiResponse<{ user: User; token: string }>> => {
    try {
      // Query users table with username and password
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', credentials.username)
        .eq('password', credentials.password)
        .eq('status', 'active')
        .maybeSingle();

      if (error || !data) {
        return {
          success: false,
          error: 'Invalid username or password',
        };
      }

      // Sign in with Supabase auth using email (required for RLS)
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: credentials.password,
      });

      if (authError) {
        // If user doesn't exist in auth, create them
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: data.email,
          password: credentials.password,
        });

        if (signUpError) {
          return {
            success: false,
            error: 'Authentication failed',
          };
        }

        return {
          success: true,
          data: {
            user: mapDbUserToUser(data),
            token: signUpData.session?.access_token || '',
          },
        };
      }

      return {
        success: true,
        data: {
          user: mapDbUserToUser(data),
          token: authData.session?.access_token || '',
        },
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Login failed',
      };
    }
  },

  register: async (
    userData: Partial<User> & { password: string }
  ): Promise<ApiResponse<User>> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert({
          username: userData.username,
          email: userData.email,
          password: userData.password,
          full_name: userData.username,
          role: userData.role || 'planner',
          status: 'active',
        })
        .select()
        .single();

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
        data: mapDbUserToUser(data),
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Registration failed',
      };
    }
  },

  getMe: async (): Promise<ApiResponse<User>> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        return {
          success: false,
          error: 'Not authenticated',
        };
      }

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', session.user.email)
        .single();

      if (error || !data) {
        return {
          success: false,
          error: 'User not found',
        };
      }

      return {
        success: true,
        data: mapDbUserToUser(data),
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  },

  updateProfile: async (
    userData: Partial<User>
  ): Promise<ApiResponse<User>> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        return {
          success: false,
          error: 'Not authenticated',
        };
      }

      const { data, error } = await supabase
        .from('users')
        .update({
          username: userData.username,
          email: userData.email,
        })
        .eq('email', session.user.email)
        .select()
        .single();

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
        data: mapDbUserToUser(data),
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  },
};

// Numbers API
export const numbersAPI = {
  getNumbers: async (filters?: any): Promise<ApiResponse<NumberRecord[]>> => {
    try {
      let query = supabase.from('numbers').select('*');

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.category) {
        query = query.eq('category', filters.category);
      }
      if (filters?.location) {
        query = query.eq('location', filters.location);
      }
      if (filters?.search) {
        query = query.or(`number.ilike.%${filters.search}%,assigned_to.ilike.%${filters.search}%`);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
        data: data.map(mapDbNumberToRecord),
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        data: [],
      };
    }
  },

  getNumber: async (id: string): Promise<ApiResponse<NumberRecord>> => {
    try {
      const { data, error } = await supabase
        .from('numbers')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
        data: mapDbNumberToRecord(data),
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  },

  updateNumber: async (
    id: string,
    numberData: Partial<NumberRecord>
  ): Promise<ApiResponse<NumberRecord>> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        return {
          success: false,
          error: 'Not authenticated',
        };
      }

      // Get current user
      const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('email', session.user.email)
        .single();

      const { data, error } = await supabase
        .from('numbers')
        .update({
          number: numberData.number,
          status: numberData.status,
          category: numberData.specialType,
          location: 'Colombo',
          assigned_to: numberData.allocatedTo,
          allocated_date: numberData.allocatedTo ? new Date().toISOString() : null,
          notes: numberData.remarks,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      // Log the change
      if (userData) {
        await supabase.from('number_logs').insert({
          number_id: id,
          action: 'Updated',
          new_value: data.number,
          performed_by: userData.id,
          description: `Number ${data.number} updated`,
        });
      }

      return {
        success: true,
        data: mapDbNumberToRecord(data),
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  },

  createNumber: async (
    numberData: Partial<NumberRecord>
  ): Promise<ApiResponse<NumberRecord>> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        return {
          success: false,
          error: 'Not authenticated',
        };
      }

      // Get current user
      const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('email', session.user.email)
        .single();

      const { data, error } = await supabase
        .from('numbers')
        .insert({
          number: numberData.number,
          status: numberData.status || 'Available',
          category: numberData.specialType || 'Standard',
          location: 'Colombo',
          assigned_to: numberData.allocatedTo,
          allocated_date: numberData.allocatedTo ? new Date().toISOString() : null,
          notes: numberData.remarks || '',
          created_by: userData?.id,
        })
        .select()
        .single();

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      // Log the creation
      if (userData) {
        await supabase.from('number_logs').insert({
          number_id: data.id,
          action: 'Created',
          new_value: data.number,
          performed_by: userData.id,
          description: `Number ${data.number} created`,
        });
      }

      return {
        success: true,
        data: mapDbNumberToRecord(data),
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  },

  deleteNumber: async (id: string): Promise<ApiResponse<void>> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        return {
          success: false,
          error: 'Not authenticated',
        };
      }

      // Check if user is admin
      const { data: userData } = await supabase
        .from('users')
        .select('role, id')
        .eq('email', session.user.email)
        .single();

      if (!userData || userData.role !== 'admin') {
        return {
          success: false,
          error: 'Only admins can delete numbers',
        };
      }

      // Get number before deletion for logging
      const { data: numberData } = await supabase
        .from('numbers')
        .select('number')
        .eq('id', id)
        .single();

      const { error } = await supabase
        .from('numbers')
        .delete()
        .eq('id', id);

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      // Log the deletion
      if (numberData) {
        await supabase.from('number_logs').insert({
          number_id: id,
          action: 'Deleted',
          old_value: numberData.number,
          performed_by: userData.id,
          description: `Number ${numberData.number} deleted`,
        });
      }

      return {
        success: true,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  },

  importNumbers: async (
    file: File
  ): Promise<
    ApiResponse<{ success: number; failed: number; errors: string[] }>
  > => {
    return {
      success: false,
      error: 'Import functionality not yet implemented',
    };
  },

  getStats: async (): Promise<ApiResponse<DashboardStats>> => {
    try {
      const { data, error } = await supabase
        .from('numbers')
        .select('status');

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      const stats: DashboardStats = {
        totalNumbers: data.length,
        allocatedNumbers: data.filter(n => n.status === 'Allocated').length,
        availableNumbers: data.filter(n => n.status === 'Available').length,
        reservedNumbers: data.filter(n => n.status === 'Reserved').length,
        heldNumbers: data.filter(n => n.status === 'Held').length,
        quarantinedNumbers: data.filter(n => n.status === 'Quarantined').length,
      };

      return {
        success: true,
        data: stats,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  },
};

// Logs API
export const logsAPI = {
  getLogs: async (filters?: any): Promise<ApiResponse<NumberLog[]>> => {
    try {
      let query = supabase
        .from('number_logs')
        .select(`
          *,
          numbers(number),
          users(id, username)
        `);

      if (filters?.number) {
        query = query.eq('numbers.number', filters.number);
      }

      const { data, error } = await query.order('performed_at', { ascending: false });

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
        data: data.map(mapDbLogToLog),
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        data: [],
      };
    }
  },

  getNumberLogs: async (number: string): Promise<ApiResponse<NumberLog[]>> => {
    try {
      const { data, error } = await supabase
        .from('number_logs')
        .select(`
          *,
          numbers!inner(number),
          users(id, username)
        `)
        .eq('numbers.number', number)
        .order('performed_at', { ascending: false });

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
        data: data.map(mapDbLogToLog),
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        data: [],
      };
    }
  },
};

// Users API
export const usersAPI = {
  getUsers: async (): Promise<ApiResponse<User[]>> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
        data: data.map(mapDbUserToUser),
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        data: [],
      };
    }
  },

  createUser: async (
    userData: Partial<User> & { password: string }
  ): Promise<ApiResponse<User>> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        return {
          success: false,
          error: 'Not authenticated',
        };
      }

      // Check if user is admin
      const { data: currentUser } = await supabase
        .from('users')
        .select('role')
        .eq('email', session.user.email)
        .single();

      if (!currentUser || currentUser.role !== 'admin') {
        return {
          success: false,
          error: 'Only admins can create users',
        };
      }

      const { data, error } = await supabase
        .from('users')
        .insert({
          username: userData.username,
          email: userData.email,
          password: userData.password,
          full_name: userData.username,
          role: userData.role || 'planner',
          status: 'active',
        })
        .select()
        .single();

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
        data: mapDbUserToUser(data),
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  },

  updateUser: async (
    id: string,
    userData: Partial<User>
  ): Promise<ApiResponse<User>> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        return {
          success: false,
          error: 'Not authenticated',
        };
      }

      // Check if user is admin
      const { data: currentUser } = await supabase
        .from('users')
        .select('role')
        .eq('email', session.user.email)
        .single();

      if (!currentUser || currentUser.role !== 'admin') {
        return {
          success: false,
          error: 'Only admins can update users',
        };
      }

      const { data, error } = await supabase
        .from('users')
        .update({
          username: userData.username,
          email: userData.email,
          role: userData.role,
          status: userData.isActive ? 'active' : 'inactive',
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
        data: mapDbUserToUser(data),
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  },

  deleteUser: async (id: string): Promise<ApiResponse<void>> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        return {
          success: false,
          error: 'Not authenticated',
        };
      }

      // Check if user is admin
      const { data: currentUser } = await supabase
        .from('users')
        .select('role')
        .eq('email', session.user.email)
        .single();

      if (!currentUser || currentUser.role !== 'admin') {
        return {
          success: false,
          error: 'Only admins can delete users',
        };
      }

      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  },
};

// Dashboard API
export const dashboardAPI = {
  getSummary: async (): Promise<ApiResponse<DashboardStats>> => {
    return numbersAPI.getStats();
  },

  getAnalytics: async (): Promise<ApiResponse<any>> => {
    return {
      success: true,
      data: {},
    };
  },
};
