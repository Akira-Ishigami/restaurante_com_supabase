export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      restaurants: {
        Row: {
          id: string
          user_id: string
          name: string
          business_type: string
          address: string
          phone: string
          email: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          business_type: string
          address: string
          phone: string
          email: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          business_type?: string
          address?: string
          phone?: string
          email?: string
          created_at?: string
          updated_at?: string
        }
      }
      menu_categories: {
        Row: {
          id: string
          restaurant_id: string
          name: string
          description: string | null
          display_order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          restaurant_id: string
          name: string
          description?: string | null
          display_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          restaurant_id?: string
          name?: string
          description?: string | null
          display_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      menu_items: {
        Row: {
          id: string
          restaurant_id: string
          category_id: string
          name: string
          description: string | null
          price: number
          preparation_time: number
          image_url: string | null
          is_available: boolean
          is_popular: boolean
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          restaurant_id: string
          category_id: string
          name: string
          description?: string | null
          price: number
          preparation_time?: number
          image_url?: string | null
          is_available?: boolean
          is_popular?: boolean
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          restaurant_id?: string
          category_id?: string
          name?: string
          description?: string | null
          price?: number
          preparation_time?: number
          image_url?: string | null
          is_available?: boolean
          is_popular?: boolean
          display_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      customers: {
        Row: {
          id: string
          restaurant_id: string
          name: string
          phone: string
          email: string | null
          address: string | null
          notes: string | null
          total_orders: number
          total_spent: number
          last_order_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          restaurant_id: string
          name: string
          phone: string
          email?: string | null
          address?: string | null
          notes?: string | null
          total_orders?: number
          total_spent?: number
          last_order_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          restaurant_id?: string
          name?: string
          phone?: string
          email?: string | null
          address?: string | null
          notes?: string | null
          total_orders?: number
          total_spent?: number
          last_order_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          restaurant_id: string
          customer_id: string | null
          order_number: string
          status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivering' | 'delivered' | 'cancelled'
          payment_method: 'pix' | 'card' | 'money' | 'bank_transfer'
          payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
          subtotal: number
          tax_amount: number
          delivery_fee: number
          total_amount: number
          delivery_address: string | null
          customer_notes: string | null
          estimated_delivery_time: string | null
          delivered_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          restaurant_id: string
          customer_id?: string | null
          order_number: string
          status?: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivering' | 'delivered' | 'cancelled'
          payment_method: 'pix' | 'card' | 'money' | 'bank_transfer'
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded'
          subtotal: number
          tax_amount?: number
          delivery_fee?: number
          total_amount: number
          delivery_address?: string | null
          customer_notes?: string | null
          estimated_delivery_time?: string | null
          delivered_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          restaurant_id?: string
          customer_id?: string | null
          order_number?: string
          status?: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivering' | 'delivered' | 'cancelled'
          payment_method?: 'pix' | 'card' | 'money' | 'bank_transfer'
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded'
          subtotal?: number
          tax_amount?: number
          delivery_fee?: number
          total_amount?: number
          delivery_address?: string | null
          customer_notes?: string | null
          estimated_delivery_time?: string | null
          delivered_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          menu_item_id: string
          quantity: number
          unit_price: number
          total_price: number
          special_instructions: string | null
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          menu_item_id: string
          quantity: number
          unit_price: number
          total_price: number
          special_instructions?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          menu_item_id?: string
          quantity?: number
          unit_price?: number
          total_price?: number
          special_instructions?: string | null
          created_at?: string
        }
      }
      restaurant_users: {
        Row: {
          id: string
          restaurant_id: string
          user_id: string
          role: 'owner' | 'admin' | 'manager' | 'attendant'
          permissions: Json
          is_active: boolean
          invited_by: string | null
          invited_at: string | null
          joined_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          restaurant_id: string
          user_id: string
          role?: 'owner' | 'admin' | 'manager' | 'attendant'
          permissions?: Json
          is_active?: boolean
          invited_by?: string | null
          invited_at?: string | null
          joined_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          restaurant_id?: string
          user_id?: string
          role?: 'owner' | 'admin' | 'manager' | 'attendant'
          permissions?: Json
          is_active?: boolean
          invited_by?: string | null
          invited_at?: string | null
          joined_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      whatsapp_settings: {
        Row: {
          id: string
          restaurant_id: string
          phone_number: string
          welcome_message: string
          auto_reply_enabled: boolean
          business_hours: Json
          webhook_url: string | null
          api_token: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          restaurant_id: string
          phone_number: string
          welcome_message?: string
          auto_reply_enabled?: boolean
          business_hours?: Json
          webhook_url?: string | null
          api_token?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          restaurant_id?: string
          phone_number?: string
          welcome_message?: string
          auto_reply_enabled?: boolean
          business_hours?: Json
          webhook_url?: string | null
          api_token?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_order_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      order_status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivering' | 'delivered' | 'cancelled'
      payment_method: 'pix' | 'card' | 'money' | 'bank_transfer'
      payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
      user_role: 'owner' | 'admin' | 'manager' | 'attendant'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}