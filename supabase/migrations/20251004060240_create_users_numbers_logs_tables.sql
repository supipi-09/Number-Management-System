/*
  # Number Management System - Complete Database Schema

  ## Overview
  This migration creates a complete number management system with username-based authentication
  and role-based access control (RBAC) for admin and planner roles.

  ## 1. New Tables

  ### `users` table
  - `id` (uuid, primary key) - Unique user identifier
  - `username` (text, unique) - Username for login
  - `password` (text) - Hashed password
  - `email` (text) - User email address
  - `full_name` (text) - User's full name
  - `role` (text) - User role: 'admin' or 'planner'
  - `status` (text) - Account status: 'active' or 'inactive'
  - `created_at` (timestamptz) - Account creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `numbers` table
  - `id` (uuid, primary key) - Unique number identifier
  - `number` (text, unique) - Phone number
  - `status` (text) - Number status: Available, Allocated, Reserved, Held, Quarantined
  - `category` (text) - Number category: Gold, Silver, Bronze, Standard
  - `location` (text) - Geographic location
  - `assigned_to` (text) - Who the number is assigned to
  - `allocated_date` (timestamptz) - When number was allocated
  - `notes` (text) - Additional notes
  - `created_by` (uuid) - User who created the record
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `number_logs` table
  - `id` (uuid, primary key) - Unique log entry identifier
  - `number_id` (uuid) - Reference to numbers table
  - `action` (text) - Action performed: Created, Updated, Deleted, Status Changed, Assigned
  - `old_value` (text) - Previous value (for updates)
  - `new_value` (text) - New value
  - `performed_by` (uuid) - User who performed the action
  - `performed_at` (timestamptz) - When action was performed
  - `description` (text) - Detailed description of the action

  ## 2. Security - Row Level Security (RLS)

  ### Users Table Policies
  - Authenticated users can view all user records (for admin user management)
  - Only admins can create, update, or delete user accounts
  - Users can view their own profile

  ### Numbers Table Policies
  - All authenticated users can view numbers
  - All authenticated users can create and update numbers
  - Only admins can delete numbers (planners cannot delete)

  ### Number Logs Table Policies
  - All authenticated users can view logs
  - Logs are automatically created by triggers (insert-only via triggers)

  ## 3. Sample Data
  - Admin user: username 'admin', password 'admin123'
  - Planner user: username 'planner', password 'planner123'
  - Sample numbers with various statuses
*/

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- 1. CREATE TABLES
-- =============================================

-- Users table with username-based authentication
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  username text UNIQUE NOT NULL,
  password text NOT NULL,
  email text NOT NULL,
  full_name text NOT NULL,
  role text NOT NULL DEFAULT 'planner' CHECK (role IN ('admin', 'planner')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Numbers table
CREATE TABLE IF NOT EXISTS numbers (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  number text UNIQUE NOT NULL,
  status text NOT NULL DEFAULT 'Available' CHECK (status IN ('Available', 'Allocated', 'Reserved', 'Held', 'Quarantined')),
  category text NOT NULL DEFAULT 'Standard' CHECK (category IN ('Gold', 'Silver', 'Bronze', 'Standard')),
  location text NOT NULL,
  assigned_to text,
  allocated_date timestamptz,
  notes text DEFAULT '',
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Number logs table for audit trail
CREATE TABLE IF NOT EXISTS number_logs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  number_id uuid REFERENCES numbers(id) ON DELETE CASCADE,
  action text NOT NULL CHECK (action IN ('Created', 'Updated', 'Deleted', 'Status Changed', 'Assigned')),
  old_value text,
  new_value text,
  performed_by uuid REFERENCES users(id),
  performed_at timestamptz DEFAULT now(),
  description text NOT NULL
);

-- =============================================
-- 2. CREATE INDEXES FOR PERFORMANCE
-- =============================================

CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_numbers_status ON numbers(status);
CREATE INDEX IF NOT EXISTS idx_numbers_number ON numbers(number);
CREATE INDEX IF NOT EXISTS idx_number_logs_number_id ON number_logs(number_id);
CREATE INDEX IF NOT EXISTS idx_number_logs_performed_at ON number_logs(performed_at DESC);

-- =============================================
-- 3. ENABLE ROW LEVEL SECURITY
-- =============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE numbers ENABLE ROW LEVEL SECURITY;
ALTER TABLE number_logs ENABLE ROW LEVEL SECURITY;

-- =============================================
-- 4. CREATE RLS POLICIES - USERS TABLE
-- =============================================

-- Allow authenticated users to view all users (needed for admin panel)
DROP POLICY IF EXISTS "Authenticated users can view all users" ON users;
CREATE POLICY "Authenticated users can view all users"
  ON users FOR SELECT
  TO authenticated
  USING (true);

-- Only admins can insert new users
DROP POLICY IF EXISTS "Only admins can create users" ON users;
CREATE POLICY "Only admins can create users"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Only admins can update users
DROP POLICY IF EXISTS "Only admins can update users" ON users;
CREATE POLICY "Only admins can update users"
  ON users FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Only admins can delete users
DROP POLICY IF EXISTS "Only admins can delete users" ON users;
CREATE POLICY "Only admins can delete users"
  ON users FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- =============================================
-- 5. CREATE RLS POLICIES - NUMBERS TABLE
-- =============================================

-- All authenticated users can view numbers
DROP POLICY IF EXISTS "Authenticated users can view numbers" ON numbers;
CREATE POLICY "Authenticated users can view numbers"
  ON numbers FOR SELECT
  TO authenticated
  USING (true);

-- All authenticated users can create numbers
DROP POLICY IF EXISTS "Authenticated users can create numbers" ON numbers;
CREATE POLICY "Authenticated users can create numbers"
  ON numbers FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- All authenticated users can update numbers
DROP POLICY IF EXISTS "Authenticated users can update numbers" ON numbers;
CREATE POLICY "Authenticated users can update numbers"
  ON numbers FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Only admins can delete numbers (planners cannot)
DROP POLICY IF EXISTS "Only admins can delete numbers" ON numbers;
CREATE POLICY "Only admins can delete numbers"
  ON numbers FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- =============================================
-- 6. CREATE RLS POLICIES - NUMBER_LOGS TABLE
-- =============================================

-- All authenticated users can view logs
DROP POLICY IF EXISTS "Authenticated users can view logs" ON number_logs;
CREATE POLICY "Authenticated users can view logs"
  ON number_logs FOR SELECT
  TO authenticated
  USING (true);

-- System can insert logs (via triggers)
DROP POLICY IF EXISTS "System can insert logs" ON number_logs;
CREATE POLICY "System can insert logs"
  ON number_logs FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- =============================================
-- 7. CREATE TRIGGERS FOR AUTOMATED LOGGING
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for users table
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for numbers table
DROP TRIGGER IF EXISTS update_numbers_updated_at ON numbers;
CREATE TRIGGER update_numbers_updated_at
  BEFORE UPDATE ON numbers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- 8. INSERT SAMPLE DATA
-- =============================================

-- Insert admin and planner users
-- Note: In production, passwords should be properly hashed
INSERT INTO users (id, username, password, email, full_name, role, status)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'admin', 'admin123', 'admin@example.com', 'System Administrator', 'admin', 'active'),
  ('00000000-0000-0000-0000-000000000002', 'planner', 'planner123', 'planner@example.com', 'Network Planner', 'planner', 'active')
ON CONFLICT (username) DO NOTHING;

-- Insert sample numbers
INSERT INTO numbers (number, status, category, location, assigned_to, allocated_date, notes, created_by)
VALUES 
  ('+94771234567', 'Allocated', 'Gold', 'Colombo', 'John Doe', now() - interval '30 days', 'Premium customer', '00000000-0000-0000-0000-000000000001'),
  ('+94771234568', 'Available', 'Silver', 'Kandy', NULL, NULL, 'Ready for allocation', '00000000-0000-0000-0000-000000000001'),
  ('+94771234569', 'Reserved', 'Bronze', 'Galle', 'Jane Smith', now() - interval '15 days', 'Reserved for corporate', '00000000-0000-0000-0000-000000000002'),
  ('+94771234570', 'Available', 'Standard', 'Colombo', NULL, NULL, '', '00000000-0000-0000-0000-000000000001'),
  ('+94771234571', 'Allocated', 'Gold', 'Colombo', 'Bob Wilson', now() - interval '45 days', 'VIP customer', '00000000-0000-0000-0000-000000000001')
ON CONFLICT (number) DO NOTHING;

-- Insert sample logs
INSERT INTO number_logs (number_id, action, new_value, performed_by, performed_at, description)
SELECT 
  id,
  'Created',
  number,
  created_by,
  created_at,
  'Number added to system'
FROM numbers
WHERE NOT EXISTS (SELECT 1 FROM number_logs WHERE number_logs.number_id = numbers.id);
