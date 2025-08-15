/*
  # Create WhatsApp settings table

  1. New Tables
    - `whatsapp_settings`
      - `id` (uuid, primary key)
      - `restaurant_id` (uuid, foreign key to restaurants)
      - `phone_number` (text)
      - `welcome_message` (text)
      - `auto_reply_enabled` (boolean)
      - `business_hours` (jsonb)
      - `webhook_url` (text)
      - `api_token` (text, encrypted)
      - `is_active` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `whatsapp_settings` table
    - Add policies for restaurant owners to manage their WhatsApp settings
*/

CREATE TABLE IF NOT EXISTS whatsapp_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid REFERENCES restaurants(id) ON DELETE CASCADE NOT NULL UNIQUE,
  phone_number text NOT NULL,
  welcome_message text DEFAULT 'Olá! Bem-vindo ao nosso restaurante. Como posso ajudá-lo?',
  auto_reply_enabled boolean DEFAULT true,
  business_hours jsonb DEFAULT '{
    "monday": {"open": "08:00", "close": "22:00", "enabled": true},
    "tuesday": {"open": "08:00", "close": "22:00", "enabled": true},
    "wednesday": {"open": "08:00", "close": "22:00", "enabled": true},
    "thursday": {"open": "08:00", "close": "22:00", "enabled": true},
    "friday": {"open": "08:00", "close": "22:00", "enabled": true},
    "saturday": {"open": "08:00", "close": "22:00", "enabled": true},
    "sunday": {"open": "08:00", "close": "22:00", "enabled": false}
  }',
  webhook_url text,
  api_token text,
  is_active boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE whatsapp_settings ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Restaurant owners can view their WhatsApp settings"
  ON whatsapp_settings
  FOR SELECT
  TO authenticated
  USING (
    restaurant_id IN (
      SELECT id FROM restaurants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Restaurant owners can insert their WhatsApp settings"
  ON whatsapp_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (
    restaurant_id IN (
      SELECT id FROM restaurants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Restaurant owners can update their WhatsApp settings"
  ON whatsapp_settings
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

CREATE POLICY "Restaurant owners can delete their WhatsApp settings"
  ON whatsapp_settings
  FOR DELETE
  TO authenticated
  USING (
    restaurant_id IN (
      SELECT id FROM restaurants WHERE user_id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER update_whatsapp_settings_updated_at
  BEFORE UPDATE ON whatsapp_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Index for better performance
CREATE INDEX IF NOT EXISTS idx_whatsapp_settings_restaurant_id ON whatsapp_settings(restaurant_id);