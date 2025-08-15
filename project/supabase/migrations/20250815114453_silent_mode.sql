/*
  # Create order items table

  1. New Tables
    - `order_items`
      - `id` (uuid, primary key)
      - `order_id` (uuid, foreign key to orders)
      - `menu_item_id` (uuid, foreign key to menu_items)
      - `quantity` (integer)
      - `unit_price` (decimal)
      - `total_price` (decimal)
      - `special_instructions` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `order_items` table
    - Add policies for restaurant owners to manage their order items
*/

CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  menu_item_id uuid REFERENCES menu_items(id) ON DELETE RESTRICT NOT NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  unit_price decimal(10,2) NOT NULL CHECK (unit_price >= 0),
  total_price decimal(10,2) NOT NULL CHECK (total_price >= 0),
  special_instructions text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Restaurant owners can view their order items"
  ON order_items
  FOR SELECT
  TO authenticated
  USING (
    order_id IN (
      SELECT id FROM orders 
      WHERE restaurant_id IN (
        SELECT id FROM restaurants WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Restaurant owners can insert their order items"
  ON order_items
  FOR INSERT
  TO authenticated
  WITH CHECK (
    order_id IN (
      SELECT id FROM orders 
      WHERE restaurant_id IN (
        SELECT id FROM restaurants WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Restaurant owners can update their order items"
  ON order_items
  FOR UPDATE
  TO authenticated
  USING (
    order_id IN (
      SELECT id FROM orders 
      WHERE restaurant_id IN (
        SELECT id FROM restaurants WHERE user_id = auth.uid()
      )
    )
  )
  WITH CHECK (
    order_id IN (
      SELECT id FROM orders 
      WHERE restaurant_id IN (
        SELECT id FROM restaurants WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Restaurant owners can delete their order items"
  ON order_items
  FOR DELETE
  TO authenticated
  USING (
    order_id IN (
      SELECT id FROM orders 
      WHERE restaurant_id IN (
        SELECT id FROM restaurants WHERE user_id = auth.uid()
      )
    )
  );

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_menu_item_id ON order_items(menu_item_id);