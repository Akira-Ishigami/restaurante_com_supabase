import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';

type WhatsAppSettings = Database['public']['Tables']['whatsapp_settings']['Row'];
type WhatsAppSettingsInsert = Database['public']['Tables']['whatsapp_settings']['Insert'];
type WhatsAppSettingsUpdate = Database['public']['Tables']['whatsapp_settings']['Update'];

export class WhatsAppService {
  // Get WhatsApp settings for restaurant
  static async getSettings(restaurantId: string): Promise<WhatsAppSettings | null> {
    const { data, error } = await supabase
      .from('whatsapp_settings')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Settings not found
      }
      throw error;
    }

    return data;
  }

  // Create WhatsApp settings
  static async createSettings(settings: WhatsAppSettingsInsert): Promise<WhatsAppSettings> {
    const { data, error } = await supabase
      .from('whatsapp_settings')
      .insert(settings)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Update WhatsApp settings
  static async updateSettings(
    restaurantId: string,
    updates: WhatsAppSettingsUpdate
  ): Promise<WhatsAppSettings> {
    const { data, error } = await supabase
      .from('whatsapp_settings')
      .update(updates)
      .eq('restaurant_id', restaurantId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Test WhatsApp connection
  static async testConnection(restaurantId: string): Promise<boolean> {
    const settings = await this.getSettings(restaurantId);
    
    if (!settings || !settings.phone_number) {
      throw new Error('WhatsApp settings not configured');
    }

    // In a real implementation, this would test the actual WhatsApp Business API
    // For now, we'll simulate a successful test
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 1000);
    });
  }

  // Send message (mock implementation)
  static async sendMessage(
    restaurantId: string,
    to: string,
    message: string
  ): Promise<boolean> {
    const settings = await this.getSettings(restaurantId);
    
    if (!settings || !settings.is_active) {
      throw new Error('WhatsApp integration not active');
    }

    // Mock sending message
    console.log(`📱 Sending WhatsApp message to ${to}:`, message);
    
    // In a real implementation, this would use the WhatsApp Business API
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 500);
    });
  }

  // Send order confirmation
  static async sendOrderConfirmation(
    restaurantId: string,
    customerPhone: string,
    orderNumber: string,
    orderDetails: string
  ): Promise<boolean> {
    const message = `🍽️ *Pedido Confirmado!*\n\nPedido: ${orderNumber}\n\n${orderDetails}\n\nObrigado pela preferência! 😊`;
    
    return this.sendMessage(restaurantId, customerPhone, message);
  }

  // Send order status update
  static async sendStatusUpdate(
    restaurantId: string,
    customerPhone: string,
    orderNumber: string,
    status: string,
    estimatedTime?: string
  ): Promise<boolean> {
    const statusMessages = {
      confirmed: '✅ Seu pedido foi confirmado e está sendo preparado!',
      preparing: '👨‍🍳 Seu pedido está sendo preparado com carinho!',
      ready: '🎉 Seu pedido está pronto!',
      delivering: '🚗 Seu pedido saiu para entrega!',
      delivered: '✅ Pedido entregue! Obrigado pela preferência!'
    };

    const statusMessage = statusMessages[status as keyof typeof statusMessages] || `Status atualizado: ${status}`;
    
    let message = `📦 *Atualização do Pedido ${orderNumber}*\n\n${statusMessage}`;
    
    if (estimatedTime) {
      message += `\n\n⏰ Tempo estimado: ${estimatedTime}`;
    }

    return this.sendMessage(restaurantId, customerPhone, message);
  }

  // Check if restaurant is open (based on business hours)
  static isRestaurantOpen(settings: WhatsAppSettings): boolean {
    if (!settings.business_hours) return true;

    const now = new Date();
    const currentDay = now.toLocaleLowerCase().substring(0, 3); // mon, tue, etc.
    const currentTime = now.toTimeString().substring(0, 5); // HH:MM

    const businessHours = settings.business_hours as any;
    const daySettings = businessHours[currentDay];

    if (!daySettings || !daySettings.enabled) {
      return false;
    }

    return currentTime >= daySettings.open && currentTime <= daySettings.close;
  }

  // Get auto-reply message
  static getAutoReplyMessage(settings: WhatsAppSettings): string {
    if (!settings.auto_reply_enabled) {
      return settings.welcome_message;
    }

    const isOpen = this.isRestaurantOpen(settings);
    
    if (isOpen) {
      return settings.welcome_message;
    } else {
      return `${settings.welcome_message}\n\n⏰ No momento estamos fechados. Nosso horário de funcionamento é:\n\n• Segunda a Sexta: 08:00 às 22:00\n• Sábado: 08:00 às 22:00\n• Domingo: Fechado\n\nEm breve retornaremos seu contato!`;
    }
  }
}