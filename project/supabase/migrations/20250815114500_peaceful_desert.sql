/*
  # Create restaurant users table

  1. New Tables
    - `restaurant_users`
      - `id` (uuid, primary key)
      - `restaurant_id` (uuid, foreign key to restaurants)
      - `user_id` (uuid, foreign key to auth.users)
      - `role` (enum)
      - `permissions` (jsonb)
      - `is_active` (boolean)
      - `invited_by` (uuid, foreign key to auth.users)
      - `invited_at` (timestamp)
      - `joined_at` (timestamp)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `restaurant_users` table
    - Add policies for restaurant owners to manage their team
*/

-- Create enum for user roles
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM (
    'owner',
    'admin',
    'manager',
    'attendant'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS restaurant_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid REFERENCES restaurants(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role user_role NOT NULL DEFAULT 'attendant',
  permissions jsonb DEFAULT '{}',
  is_active boolean DEFAULT true,
  invited_by uuid REFERENCES auth.users(id),
  invited_at timestamptz,
  joined_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(restaurant_id, user_id)
);

-- Enable RLS
ALTER TABLE restaurant_users ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Restaurant owners can view their team"
  ON restaurant_users
  FOR SELECT
  TO authenticated
  USING (
    restaurant_id IN (
      SELECT id FROM restaurants WHERE user_id = auth.uid()
    )
    OR user_id = auth.uid()
  );

CREATE POLICY "Restaurant owners can invite users"
  ON restaurant_users
  FOR INSERT
  TO authenticated
  WITH CHECK (
    restaurant_id IN (
      SELECT id FROM restaurants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Restaurant owners can update their team"
  ON restaurant_users
  FOR UPDATE
  TO authenticated
  USING (
    restaurant_id IN (
      SELECT id FROM restaurants WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    restaurant_id IN (
      SELECT id FROM restaurants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Restaurant owners can remove team members"
  ON restaurant_users
  FOR DELETE
  TO authenticated
  USING (
    restaurant_id IN (
      SELECT id FROM restaurants WHERE user_id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER update_restaurant_users_updated_at
  BEFORE UPDATE ON restaurant_users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_restaurant_users_restaurant_id ON restaurant_users(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_restaurant_users_user_id ON restaurant_users(user_id);
CREATE INDEX IF NOT EXISTS idx_restaurant_users_role ON restaurant_users(role);