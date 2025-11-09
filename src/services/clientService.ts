import { 
  createClientSchema, 
  CreateClientDto,
  validateData 
} from '@/schemas/productSchemas';
import { 
  createClient as firebaseCreateClient,
  updateClient as firebaseUpdateClient,
  deleteClient as firebaseDeleteClient,
  getClientById as firebaseGetClient
} from '@/firebase';

export class ClientService {
  static async createClient(data: unknown): Promise<string> {
    // Validar datos antes de enviar a Firebase
    const validatedData = validateData(createClientSchema, data);
    
    // Generar UID único
    const uid = `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Crear en Firebase
    const result = await firebaseCreateClient(uid, validatedData);
    
    if (!result) {
      throw new Error('Error al crear el cliente en la base de datos');
    }
    
    return result;
  }

  static async updateClient(uid: string, data: unknown): Promise<void> {
    if (!uid) {
      throw new Error('El ID del cliente es requerido');
    }

    // Validar datos parciales
    const validatedData = validateData(createClientSchema.partial(), data);
    
    // Verificar que el cliente existe
    const existingClient = await firebaseGetClient(uid);
    if (!existingClient) {
      throw new Error('El cliente no existe');
    }
    
    // Actualizar en Firebase
    await firebaseUpdateClient(uid, validatedData);
  }

  static async deleteClient(uid: string): Promise<boolean> {
    if (!uid) {
      throw new Error('El ID del cliente es requerido');
    }

    // Verificar que el cliente existe
    const existingClient = await firebaseGetClient(uid);
    if (!existingClient) {
      throw new Error('El cliente no existe');
    }

    // Eliminar de Firebase
    const result = await firebaseDeleteClient(uid);
    
    if (!result) {
      throw new Error('Error al eliminar el cliente');
    }
    
    return result;
  }

  static async getClient(uid: string) {
    if (!uid) {
      throw new Error('El ID del cliente es requerido');
    }

    const client = await firebaseGetClient(uid);
    
    if (!client) {
      throw new Error('Cliente no encontrado');
    }
    
    return client;
  }

  // Validar datos específicos de cliente
  static validateClientData(data: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validar nombre
    if (!data.name || data.name.trim().length === 0) {
      errors.push('El nombre es requerido');
    }

    // Validar email si se proporciona
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.push('El email no tiene un formato válido');
    }

    // Validar teléfono si se proporciona
    if (data.phone && !/^\+?[\d\s\-\(\)]+$/.test(data.phone)) {
      errors.push('El teléfono no tiene un formato válido');
    }

    // Validar NIT si se proporciona
    if (data.nit && data.nit.trim().length > 0) {
      // Validación básica de NIT colombiano
      const nitRegex = /^\d{8,15}(-\d)?$/;
      if (!nitRegex.test(data.nit.replace(/\s/g, ''))) {
        errors.push('El NIT no tiene un formato válido');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // Formatear datos de cliente para mostrar
  static formatClientForDisplay(client: any) {
    return {
      ...client,
      displayName: client.name || 'Sin nombre',
      displayEmail: client.email || 'Sin email',
      displayPhone: client.phone || 'Sin teléfono',
      displayAddress: client.address || 'Sin dirección',
      displayNIT: client.nit || 'Sin NIT',
    };
  }

  // Buscar clientes por criterio
  static searchClients(clients: any[], searchTerm: string) {
    if (!searchTerm.trim()) return clients;
    
    const term = searchTerm.toLowerCase();
    return clients.filter(client => 
      client.name?.toLowerCase().includes(term) ||
      client.email?.toLowerCase().includes(term) ||
      client.phone?.toLowerCase().includes(term) ||
      client.nit?.toLowerCase().includes(term) ||
      client.address?.toLowerCase().includes(term)
    );
  }
}