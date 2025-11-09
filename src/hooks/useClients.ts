import { useCallback, useEffect, useState } from 'react';
import { useAsyncOperation } from './useAsyncOperation';
import { useNotification } from './useNotification';
import { validateData, createClientSchema } from '@/schemas/productSchemas';
import { 
  createClient, 
  updateClient, 
  deleteClient, 
  getAllClientsData,
  getClientById 
} from '@/firebase';

interface Client {
  uid: string;
  user: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  nit?: string;
}

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { success, error: notifyError, handleAsyncError } = useNotification();

  // Operaciones async con manejo de errores
  const createOperation = useAsyncOperation(async (clientData: unknown) => {
    const validatedData = validateData(createClientSchema, clientData);
    const uid = `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const result = await createClient(uid, validatedData);
    
    if (!result) {
      throw new Error('Error al crear el cliente en la base de datos');
    }
    
    return result;
  });

  const updateOperation = useAsyncOperation(async ({ uid, clientData }: { uid: string; clientData: unknown }) => {
    if (!uid) {
      throw new Error('El ID del cliente es requerido');
    }

    const validatedData = validateData(createClientSchema.partial(), clientData);
    await updateClient(uid, validatedData);
  });

  const deleteOperation = useAsyncOperation(async (uid: string) => {
    if (!uid) {
      throw new Error('El ID del cliente es requerido');
    }

    const result = await deleteClient(uid);
    
    if (!result) {
      throw new Error('Error al eliminar el cliente');
    }
    
    return result;
  });

  const getClientOperation = useAsyncOperation(async (uid: string) => {
    if (!uid) {
      throw new Error('El ID del cliente es requerido');
    }

    const client = await getClientById(uid);
    
    if (!client) {
      throw new Error('Cliente no encontrado');
    }
    
    return client;
  });

  // Cargar clientes con suscripción en tiempo real
  useEffect(() => {
    setLoading(true);
    setError(null);

    const unsubscribe = getAllClientsData((data: Client[] | null) => {
      if (data === null) {
        setError('Error al cargar clientes');
        setLoading(false);
        return;
      }
      
      setClients(data);
      setLoading(false);
    });

    return () => {
      if (unsubscribe && typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  // Crear cliente
  const createClientRecord = useCallback(async (clientData: unknown) => {
    try {
      const uid = await createOperation.execute(clientData);
      success('Cliente creado exitosamente');
      return uid;
    } catch (error) {
      handleAsyncError(error as Error, 'Error al crear cliente');
      throw error;
    }
  }, [createOperation, success, handleAsyncError]);

  // Actualizar cliente
  const updateClientRecord = useCallback(async (uid: string, clientData: unknown) => {
    try {
      await updateOperation.execute({ uid, clientData });
      success('Cliente actualizado exitosamente');
    } catch (error) {
      handleAsyncError(error as Error, 'Error al actualizar cliente');
      throw error;
    }
  }, [updateOperation, success, handleAsyncError]);

  // Eliminar cliente
  const deleteClientRecord = useCallback(async (uid: string) => {
    try {
      await deleteOperation.execute(uid);
      success('Cliente eliminado exitosamente');
    } catch (error) {
      handleAsyncError(error as Error, 'Error al eliminar cliente');
      throw error;
    }
  }, [deleteOperation, success, handleAsyncError]);

  // Obtener cliente por ID
  const getClient = useCallback(async (uid: string) => {
    try {
      return await getClientOperation.execute(uid);
    } catch (error) {
      handleAsyncError(error as Error, 'Error al obtener cliente');
      throw error;
    }
  }, [getClientOperation, handleAsyncError]);

  // Buscar clientes
  const searchClients = useCallback((searchTerm: string) => {
    if (!searchTerm.trim()) return clients;
    
    const term = searchTerm.toLowerCase();
    return clients.filter(client => 
      client.name.toLowerCase().includes(term) ||
      client.email?.toLowerCase().includes(term) ||
      client.phone?.toLowerCase().includes(term) ||
      client.nit?.toLowerCase().includes(term)
    );
  }, [clients]);

  // Validar NIT único
  const validateUniqueNIT = useCallback((nit: string, excludeUid?: string) => {
    if (!nit.trim()) return true;
    
    return !clients.some(client => 
      client.nit === nit && client.uid !== excludeUid
    );
  }, [clients]);

  // Validar email único
  const validateUniqueEmail = useCallback((email: string, excludeUid?: string) => {
    if (!email.trim()) return true;
    
    return !clients.some(client => 
      client.email === email && client.uid !== excludeUid
    );
  }, [clients]);

  return {
    // Estado
    clients,
    loading: loading || createOperation.loading || updateOperation.loading || deleteOperation.loading,
    error: error || createOperation.error || updateOperation.error || deleteOperation.error,
    
    // Operaciones
    createClient: createClientRecord,
    updateClient: updateClientRecord,
    deleteClient: deleteClientRecord,
    getClient,
    
    // Utilidades
    searchClients,
    validateUniqueNIT,
    validateUniqueEmail,
    
    // Estados específicos de operaciones
    creating: createOperation.loading,
    updating: updateOperation.loading,
    deleting: deleteOperation.loading,
    fetching: getClientOperation.loading,
  };
}