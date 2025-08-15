/*
  # Fix public policies and add real-time functionality

  1. New Policies
    - Fix existing policies for public access
    - Add policies for order management
    - Add policies for real-time updates

  2. Functions
    - Customer stats update function
    - Order number generation
    - Dashboard stats function

  3. Triggers
    - Auto-update customer statistics
    - Auto-generate order numbers
    - Update timestamps

  4. Indexes
    - Performance optimization indexes
*/

-- 1. Drop existing conflicting policies if they exist
DROP POLICY IF EXISTS "Public can view restaurants" ON restaurants;
DROP POLICY IF EXISTS "Public can view active menu categories" ON menu_categories;

-- 2. Create new public access policies
CREATE POLICY "Anyone can view restaurants for menu"
  ON restaurants
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can view active menu categories"
  ON menu_categories
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- 3. Policies for customer management
CREATE POLICY "Anyone can create customers"
  ON customers
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can view customers for orders"
  ON customers
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- 4. Policies for order management
CREATE POLICY "Anyone can create orders"
  ON orders
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can view orders"
  ON orders
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can create order items"
  ON order_items
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can view order items"
  ON order_items
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- 5. Function to update customer statistics
CREATE OR REPLACE FUNCTION update_customer_stats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE customers 
  SET 
    total_orders = total_orders + 1,
    total_spent = total_spent + NEW.total_amount,
    last_order_at = NEW.created_at,
    updated_at = now()
  WHERE id = NEW.customer_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. Trigger for customer stats
DROP TRIGGER IF EXISTS trigger_update_customer_stats ON orders;
CREATE TRIGGER trigger_update_customer_stats
  AFTER INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_customer_stats();

-- 7. Function to generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS text AS $$
DECLARE
  next_num integer;
BEGIN
  SELECT nextval('order_number_seq') INTO next_num;
  RETURN 'PED-' || to_char(now(), 'YYYYMMDD') || '-' || LPAD(next_num::text, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- 8. Function to set order number
CREATE OR REPLACE FUNCTION set_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
    NEW.order_number := generate_order_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 9. Trigger for order number generation
DROP TRIGGER IF EXISTS trigger_set_order_number ON orders;
CREATE TRIGGER trigger_set_order_number
  BEFORE INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION set_order_number();

-- 10. Function to update order status with timestamp
CREATE OR REPLACE FUNCTION update_order_status_with_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  -- Se o status mudou para 'delivered', atualizar delivered_at
  IF NEW.status = 'delivered' AND OLD.status != 'delivered' THEN
    NEW.delivered_at = now();
  END IF;
  
  -- Sempre atualizar updated_at
  NEW.updated_at = now();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 11. Trigger for order status updates
DROP TRIGGER IF EXISTS trigger_update_order_status_timestamp ON orders;
CREATE TRIGGER trigger_update_order_status_timestamp
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_order_status_with_timestamp();

-- 12. Performance indexes
CREATE INDEX IF NOT EXISTS idx_orders_restaurant_status ON orders(restaurant_id, status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at_desc ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_customers_restaurant_phone ON customers(restaurant_id, phone);
CREATE INDEX IF NOT EXISTS idx_menu_items_restaurant_available ON menu_items(restaurant_id, is_available);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_order_items_menu_item_id ON order_items(menu_item_id);

-- 13. Function for dashboard statistics
CREATE OR REPLACE FUNCTION get_dashboard_stats(restaurant_id_param uuid, period_start timestamp)
RETURNS TABLE(
  total_orders bigint,
  total_revenue numeric,
  unique_customers bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(o.id) as total_orders,
    COALESCE(SUM(o.total_amount), 0) as total_revenue,
    COUNT(DISTINCT o.customer_id) as unique_customers
  FROM orders o
  WHERE o.restaurant_id = restaurant_id_param
    AND o.created_at >= period_start
    AND o.status != 'cancelled';
END;
$$ LANGUAGE plpgsql;

-- 14. Ensure sequence exists for order numbers
CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1;