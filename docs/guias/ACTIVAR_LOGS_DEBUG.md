# 🔍 Cómo Activar Logs de Debug

## 📋 Estado Actual

Los logs de performance están **DESACTIVADOS por defecto** en producción para no afectar el rendimiento ni llenar la consola.

## 🚀 Activar Logs de Performance

### Opción 1: Desde la Consola del Navegador (Recomendado)

```javascript
// Activar logs
localStorage.setItem('enablePerformanceLog', 'true');

// Recargar la página
location.reload();
```

### Opción 2: Desde el Código (Temporal)

Editar `src/utils/performanceLogger.ts`:

```typescript
constructor() {
  // Cambiar de:
  this.enabled = localStorage.getItem('enablePerformanceLog') === 'true';
  
  // A:
  this.enabled = true; // Siempre activo
}
```

## ❌ Desactivar Logs

```javascript
// Desactivar logs
localStorage.setItem('enablePerformanceLog', 'false');

// O eliminar la configuración
localStorage.removeItem('enablePerformanceLog');

// Recargar la página
location.reload();
```

## 📊 Qué Verás Cuando Estén Activos

### Logs de Venta Completa
```
🚀 [PERFORMANCE] Iniciando: Proceso Completo de Venta (Paralelo)
⏱️ [CHECKPOINT] Usuario obtenido: 0.70ms
⏱️ [CHECKPOINT] 🚀 Iniciando procesos en paralelo: 0.80ms
⏱️ [CHECKPOINT] 📄 Iniciando creación de factura: 0.90ms
⏱️ [CHECKPOINT] 📦 Iniciando actualización de inventario (background): 1.50ms
⏱️ [CHECKPOINT] ✅ Factura creada: 1051.80ms
⏱️ [CHECKPOINT] ✅ Inventario actualizado: 1045.50ms
⏱️ [CHECKPOINT] 🏁 Procesos paralelos completados: 1052.10ms
🟡 [PERFORMANCE] Proceso Completo de Venta (Paralelo): 1052.30ms
```

### Logs de Inventario
```
🚀 [PERFORMANCE] Iniciando: InventoryService.updateInventoryAfterSale
⏱️ [CHECKPOINT] Iniciando transacción Firebase: 0.10ms
⏱️ [CHECKPOINT] Leyendo 1 productos de Firebase: 22.40ms
⏱️ [CHECKPOINT] Productos leídos de Firebase: 169.10ms
⏱️ [CHECKPOINT] Productos actualizados en transacción: 169.90ms
🟢 [PERFORMANCE] InventoryService.updateInventoryAfterSale: 738.90ms
```

### Logs de Quick Sale
```
🚀 [PERFORMANCE] Iniciando: Quick Sale Final
⏱️ [CHECKPOINT] Obteniendo factura existente (con caché): 0.10ms
⏱️ [CHECKPOINT] Factura obtenida: 207.90ms
⏱️ [CHECKPOINT] Items mergeados: 208.20ms
⏱️ [CHECKPOINT] Factura actualizada y caché sincronizado: 1495.60ms
🟡 [PERFORMANCE] Quick Sale Final: 1495.70ms
```

## 🎯 Cuándo Activar los Logs

### ✅ Activar cuando:
- Investigas problemas de performance
- Necesitas identificar cuellos de botella
- Estás optimizando el código
- Reportas un bug de lentitud
- Estás en ambiente de desarrollo/staging

### ❌ NO activar cuando:
- Estás en producción normal
- No estás investigando problemas
- Tienes muchos usuarios activos
- No necesitas los datos de performance

## 📝 Notas Importantes

1. **Sin impacto en producción**: Los logs desactivados no afectan el performance
2. **Persistente**: La configuración se guarda en localStorage
3. **Por usuario**: Cada usuario/navegador tiene su propia configuración
4. **Limpieza automática**: Los logs no se acumulan, solo se muestran en consola

## 🔧 Troubleshooting

### Los logs no aparecen después de activar

```javascript
// Verificar que esté activado
console.log(localStorage.getItem('enablePerformanceLog')); // Debe ser 'true'

// Verificar que recargaste la página
location.reload();

// Verificar en la consola del navegador (F12)
```

### Quiero ver solo ciertos logs

Los logs están organizados por operación:
- `Proceso Completo de Venta (Paralelo)` - Venta completa
- `Quick Sale Final` - Ventas rápidas
- `InventoryService.updateInventoryAfterSale` - Actualización de inventario
- `InventoryService.checkStockAvailability` - Verificación de stock

Puedes filtrar en la consola del navegador usando estos términos.

## 📊 Estadísticas del Caché

Para ver estadísticas del caché de Quick Sales:

```javascript
// En la consola del navegador
quickSaleCache.getStats();

// Output:
{
  totalEntries: 1,
  activeEntries: 1,
  expiredEntries: 0,
  totalItems: 4,
  oldestEntry: 1699564800000
}
```

## 🧹 Limpiar Caché Manualmente

```javascript
// Limpiar caché de Quick Sales
quickSaleCache.clear();

// Limpiar solo entradas expiradas
quickSaleCache.cleanup();

// Invalidar una factura específica
quickSaleCache.invalidate('venta-rapida-09-11-2025');
```

---

**Última actualización**: Noviembre 2024  
**Versión**: 1.0.0  
**Estado**: Logs desactivados por defecto en producción
