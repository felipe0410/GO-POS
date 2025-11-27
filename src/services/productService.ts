import { 
  createProductSchema, 
  updateProductSchema, 
  CreateProductDto, 
  UpdateProductDto,
  validateData 
} from '@/schemas/productSchemas';
import { 
  createProduct as firebaseCreateProduct,
  updateProductData as firebaseUpdateProduct,
  deleteProduct as firebaseDeleteProduct,
  getProductData as firebaseGetProduct
} from '@/firebase';

export class ProductService {
  static async createProduct(data: unknown): Promise<string> {
    // Validar datos antes de enviar a Firebase
    const validatedData = validateData(createProductSchema, data);
    
    // Generar UID único
    const uid = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Crear en Firebase
    const result = await firebaseCreateProduct(uid, validatedData);
    
    if (!result) {
      throw new Error('Error al crear el producto en la base de datos');
    }
    
    return result;
  }

  static async updateProduct(uid: string, data: unknown): Promise<void> {
    if (!uid) {
      throw new Error('El ID del producto es requerido');
    }

    // Validar datos parciales
    const validatedData = validateData(updateProductSchema, data);
    
    // Verificar que el producto existe
    const existingProduct = await firebaseGetProduct(uid);
    if (!existingProduct) {
      throw new Error('El producto no existe');
    }
    
    // Actualizar en Firebase
    await firebaseUpdateProduct(uid, validatedData);
  }

  static async deleteProduct(uid: string, imageUrl?: string): Promise<boolean> {
    if (!uid) {
      throw new Error('El ID del producto es requerido');
    }

    // Verificar que el producto existe
    const existingProduct = await firebaseGetProduct(uid);
    if (!existingProduct) {
      throw new Error('El producto no existe');
    }

    // Eliminar de Firebase
    const result = await firebaseDeleteProduct(uid, imageUrl || '');
    
    if (!result) {
      throw new Error('Error al eliminar el producto');
    }
    
    return result;
  }

  static async getProduct(uid: string) {
    if (!uid) {
      throw new Error('El ID del producto es requerido');
    }

    const product = await firebaseGetProduct(uid);
    
    if (!product) {
      throw new Error('Producto no encontrado');
    }
    
    return product;
  }

  // Validar código de barras único
  static async validateUniqueBarCode(barCode: string, excludeUid?: string): Promise<boolean> {
    // Esta función necesitaría una consulta a Firebase para verificar unicidad
    // Por ahora retornamos true, pero deberías implementar la lógica
    return true;
  }
}