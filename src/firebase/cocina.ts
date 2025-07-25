import { doc, collection, query, where, getDocs, onSnapshot, updateDoc, orderBy } from "firebase/firestore";
import { db, user } from ".";

export const getPendingKitchenOrders = async (callback: any) => {
  try {
    const establecimientoDocRef = doc(
      db,
      "establecimientos",
      user().decodedString
    );
    const invoiceCollectionRef = collection(establecimientoDocRef, "invoices");

    // Usa el campo adecuado que sea tipo Timestamp (como "fechaCreacion")
    const kitchenQuery = query(
      invoiceCollectionRef,
      where("status", "==", "PENDIENTE"),
      where("orden_preparada", "==", false),
      orderBy("fechaCreacion", "desc") // ✅ usa un campo tipo timestamp real
    );

    const initialSnapshot = await getDocs(kitchenQuery);
    const initialData = initialSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(initialData);

    const unsubscribe = onSnapshot(kitchenQuery, (snapshot) => {
      const updatedData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(updatedData);
    });

    return unsubscribe;
  } catch (error) {
    console.error("❌ Error cargando órdenes de cocina:", error);
    return null;
  }
};

export const markOrderAsPrepared = async (invoiceId: string) => {
  try {
    const establecimientoDocRef = doc(
      db,
      "establecimientos",
      `${user().decodedString}`,
      "invoices",
      invoiceId
    );

    await updateDoc(establecimientoDocRef, {
      orden_preparada: true,
    });
  } catch (error) {
    console.error("❌ Error marcando orden como preparada:", error);
  }
};