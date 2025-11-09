# 🧪 Guía de Pruebas - Sistema Offline

## 🎯 **Objetivo de las Pruebas**

Verificar que el sistema de ventas funcione correctamente tanto **con internet** como **sin internet**, y que la sincronización automática funcione cuando regrese la conexión.

## 🚀 **Preparación para las Pruebas**

### **1. Iniciar la Aplicación**
```bash
npm run dev
```

### **2. Navegar al Módulo de Ventas**
```
http://localhost:3000/vender/Normal
```

### **3. Verificar Elementos Nuevos**
- ✅ **Indicador WiFi** en la esquina superior derecha del header
- ✅ **Badge numérico** si hay ventas pendientes
- ✅ **Color del indicador**: Verde (online) / Amarillo (pendientes) / Rojo (offline)

## 📋 **Plan de Pruebas**

### **🟢 PRUEBA 1: Funcionamiento Online Normal**

#### **Pasos:**
1. **Verificar conexión**: El indicador WiFi debe estar **verde** 🟢
2. **Agregar productos** al carrito
3. **Procesar una venta** normalmente
4. **Verificar mensaje**: "Venta procesada e inventario actualizado exitosamente"
5. **Verificar indicador**: Debe seguir **verde** (sin pendientes)

#### **Resultado Esperado:**
- ✅ Venta se procesa inmediatamente
- ✅ Inventario se actualiza en Firebase
- ✅ Indicador permanece verde
- ✅ No hay ventas pendientes

---

### **🔴 PRUEBA 2: Simulación de Pérdida de Internet**

#### **Pasos:**
1. **Abrir DevTools** (F12)
2. **Ir a Network tab**
3. **Activar "Offline"** (checkbox o dropdown)
4. **Verificar indicador**: Debe cambiar a **rojo** 🔴 con mensaje "Offline"
5. **Agregar productos** al carrito
6. **Procesar una venta**
7. **Verificar mensaje**: "Sin conexión - venta guardada offline para sincronizar después"
8. **Verificar indicador**: Debe mostrar **badge con número** de ventas pendientes

#### **Resultado Esperado:**
- ✅ Indicador cambia a rojo inmediatamente
- ✅ Venta se procesa sin errores
- ✅ Mensaje indica que se guardó offline
- ✅ Badge muestra "1" venta pendiente
- ✅ Inventario local se actualiza (para futuras validaciones)

---

### **🔄 PRUEBA 3: Múltiples Ventas Offline**

#### **Pasos:**
1. **Mantener modo offline** (DevTools Network → Offline)
2. **Procesar 2-3 ventas más** con diferentes productos
3. **Verificar badge**: Debe incrementar (2, 3, etc.)
4. **Click en indicador WiFi**: Ver popover con detalles
5. **Verificar estadísticas**: 
   - Ventas pendientes: X
   - Ventas sincronizadas: Y
   - Estado: "Offline"

#### **Resultado Esperado:**
- ✅ Cada venta incrementa el contador
- ✅ Todas las ventas se procesan sin errores
- ✅ Popover muestra estadísticas correctas
- ✅ Botón "Sincronizar" está deshabilitado (sin conexión)

---

### **🟡 PRUEBA 4: Validación de Stock Offline**

#### **Pasos:**
1. **Mantener modo offline**
2. **Intentar vender más cantidad** de un producto de la que hay en stock
3. **Verificar mensaje de error**: "Stock insuficiente: [Producto]: Disponible X, requerido Y"
4. **Confirmar que la venta no se procesa**

#### **Resultado Esperado:**
- ✅ Sistema valida stock usando caché local
- ✅ Previene sobreventa incluso sin internet
- ✅ Mensaje de error claro y específico
- ✅ Venta no se guarda si no hay stock

---

### **🟢 PRUEBA 5: Recuperación de Conexión y Sincronización**

#### **Pasos:**
1. **Desactivar modo offline** (DevTools Network → Online)
2. **Verificar notificación**: "Conexión restaurada - sincronizando ventas pendientes..."
3. **Esperar 2-3 segundos** (sincronización automática)
4. **Verificar mensaje**: "X ventas sincronizadas exitosamente"
5. **Verificar indicador**: Debe volver a **verde** sin badge
6. **Click en indicador**: Ver estadísticas actualizadas

#### **Resultado Esperado:**
- ✅ Notificación inmediata de conexión restaurada
- ✅ Sincronización automática en 2-3 segundos
- ✅ Mensaje de confirmación de ventas sincronizadas
- ✅ Indicador vuelve a verde (sin pendientes)
- ✅ Estadísticas muestran ventas sincronizadas

---

### **🔄 PRUEBA 6: Sincronización Manual**

#### **Pasos:**
1. **Repetir proceso offline** (crear 1-2 ventas sin internet)
2. **Restaurar conexión** pero **NO esperar** sincronización automática
3. **Click inmediato en indicador WiFi**
4. **Click en "Sincronizar Ahora"**
5. **Verificar sincronización manual**

#### **Resultado Esperado:**
- ✅ Botón "Sincronizar Ahora" disponible cuando hay conexión
- ✅ Sincronización manual funciona correctamente
- ✅ Loading state durante sincronización
- ✅ Confirmación de éxito

---

### **⚠️ PRUEBA 7: Manejo de Errores de Sincronización**

#### **Pasos:**
1. **Crear ventas offline**
2. **Restaurar conexión parcial** (internet lento/inestable)
3. **Observar reintentos automáticos**
4. **Verificar mensajes de error** si fallan
5. **Verificar que se marcan como "fallidas"** después de 5 intentos

#### **Resultado Esperado:**
- ✅ Sistema reintenta automáticamente
- ✅ Mensajes informativos sobre errores
- ✅ Ventas fallidas se marcan apropiadamente
- ✅ No se pierden datos

## 🎮 **Controles de Prueba**

### **Simular Offline:**
```
DevTools (F12) → Network → Offline checkbox ✅
```

### **Simular Online:**
```
DevTools (F12) → Network → Offline checkbox ❌
```

### **Ver Estadísticas:**
```
Click en icono WiFi → Popover con detalles
```

### **Sincronización Manual:**
```
Click en icono WiFi → "Sincronizar Ahora"
```

## 📊 **Indicadores Visuales a Verificar**

### **🟢 Estado Online**
- Icono: WiFi verde
- Badge: Sin número (o 0)
- Tooltip: "Conectado y sincronizado"

### **🔴 Estado Offline**
- Icono: WiFi rojo con X
- Badge: Sin número
- Tooltip: "Sin conexión a internet"
- Popover: "⚠️ Modo Offline Activo"

### **🟡 Ventas Pendientes**
- Icono: WiFi verde/amarillo
- Badge: Número de ventas pendientes
- Tooltip: "X ventas esperando sincronización"
- Popover: Estadísticas detalladas + botón sincronizar

### **❌ Errores de Sincronización**
- Icono: WiFi con warning
- Badge: Número de ventas fallidas
- Tooltip: "X ventas con errores"
- Popover: Detalles de errores + botón reintentar

## 🎯 **Criterios de Éxito**

### **✅ Funcionalidad Básica**
- [ ] Ventas online funcionan normalmente
- [ ] Ventas offline se guardan correctamente
- [ ] Sincronización automática funciona
- [ ] Sincronización manual funciona

### **✅ Validaciones**
- [ ] Stock se valida online y offline
- [ ] Sobreventa se previene en ambos modos
- [ ] Mensajes de error son claros

### **✅ Experiencia de Usuario**
- [ ] Indicador visual funciona correctamente
- [ ] Notificaciones son informativas
- [ ] Transiciones son suaves
- [ ] No hay errores en consola

### **✅ Robustez**
- [ ] Maneja pérdida/recuperación de conexión
- [ ] Reintentos automáticos funcionan
- [ ] Datos no se pierden nunca
- [ ] Performance es aceptable

## 🚨 **Problemas Potenciales a Verificar**

### **❌ Si algo no funciona:**
1. **Verificar consola** (F12) por errores JavaScript
2. **Verificar Network tab** para requests fallidos
3. **Verificar IndexedDB** (Application tab → Storage → IndexedDB)
4. **Verificar localStorage** para datos persistentes

### **🔧 Soluciones Rápidas:**
- **Limpiar caché**: Ctrl+Shift+R
- **Limpiar IndexedDB**: Application → Storage → Clear storage
- **Reiniciar servidor**: npm run dev
- **Verificar dependencias**: npm install

---

## 🎉 **¡Listo para Probar!**

**Sigue esta guía paso a paso y verifica que cada funcionalidad trabaje como se espera.**

**¿Algún problema?** Comparte el error específico y te ayudo a solucionarlo inmediatamente.

**¿Todo funciona?** ¡Perfecto! El sistema offline está completamente operativo.