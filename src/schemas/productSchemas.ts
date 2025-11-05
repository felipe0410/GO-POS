import { z } from 'zod';

// Schema para validar precios en formato "$ 123,456"
const priceSchema = z.string().regex(
  /^\$ \d{1,3}(,\d{3})*$/,
  'El precio debe tener el formato "$ 123,456"'
);

// Schema para código de barras
const barCodeSchema = z.string().min(1, 'El código de barras es requerido');

// Schema para crear producto
export const createProductSchema = z.object({
  productName: z.string().min(1, 'El nombre del producto es requerido'),
  barCode: barCodeSchema,
  cantidad: z.number().min(0, 'La cantidad no puede ser negativa'),
  purchasePrice: priceSchema,
  salePrice: priceSchema,
  category: z.string().optional(),
  description: z.string().optional(),
  imageUrl: z.string().url().optional(),
  cantidadContenida: z.number().min(0).optional(),
  parentBarCodes: z.array(z.string()).optional(),
});

// Schema para actualizar producto
export const updateProductSchema = createProductSchema.partial();

// Schema para validar factura
export const invoiceItemSchema = z.object({
  barCode: z.string(),
  productName: z.string(),
  cantidad: z.number().min(1, 'La cantidad debe ser mayor a 0'),
  acc: z.number().min(0, 'El precio no puede ser negativo'),
});

export const createInvoiceSchema = z.object({
  compra: z.array(invoiceItemSchema).min(1, 'Debe tener al menos un producto'),
  subtotal: z.number().min(0),
  descuento: z.number().min(0).optional(),
  total: z.number().min(0),
  paymentMethod: z.enum(['Efectivo', 'Transferencia', 'Tarjeta']),
  name: z.string().optional(),
  clientId: z.string().optional(),
});

// Schema para cliente
export const createClientSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  email: z.string().email('Email inválido').optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  nit: z.string().optional(),
});

// Tipos TypeScript derivados de los schemas
export type CreateProductDto = z.infer<typeof createProductSchema>;
export type UpdateProductDto = z.infer<typeof updateProductSchema>;
export type CreateInvoiceDto = z.infer<typeof createInvoiceSchema>;
export type CreateClientDto = z.infer<typeof createClientSchema>;
export type InvoiceItem = z.infer<typeof invoiceItemSchema>;

// Función helper para validar datos
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const messages = error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
      throw new Error(`Errores de validación:\n${messages.join('\n')}`);
    }
    throw error;
  }
}