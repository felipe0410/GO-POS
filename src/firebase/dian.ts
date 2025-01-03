import {
  collection,
  doc,
  DocumentReference,
  DocumentSnapshot,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
} from "firebase/firestore";
import { db, user } from "./index";

export const createInvoiceDian = async (uid: string, invoiceData: any) => {
  try {
    const establecimientoDocRef: DocumentReference = doc(
      db,
      "establecimientos",
      `${user().decodedString}`
    );
    const establecimientoSnapshot: DocumentSnapshot = await getDoc(
      establecimientoDocRef
    );

    if (!establecimientoSnapshot.exists()) {
      await setDoc(establecimientoDocRef, {});
    }
    const invoicesCollectionRef = collection(
      establecimientoDocRef,
      "invoicesDian"
    );
    const invoiceDocRef = doc(invoicesCollectionRef, uid);
    await setDoc(invoiceDocRef, {
      uid: uid,
      user: `${user().decodedString}`,
      ...invoiceData,
    });
    return uid;
  } catch (error) {
    console.error("Error al guardar información en /invoices: ", error);
    return null;
  }
};

export const createInvoiceDraft = async (uid: string, invoiceData: any) => {
  try {
    const establecimientoDocRef: DocumentReference = doc(
      db,
      "establecimientos",
      `${user().decodedString}`
    );
    const establecimientoSnapshot: DocumentSnapshot = await getDoc(
      establecimientoDocRef
    );

    if (!establecimientoSnapshot.exists()) {
      await setDoc(establecimientoDocRef, {});
    }
    const invoicesCollectionRef = collection(
      establecimientoDocRef,
      "invoicesDianDraf"
    );
    const invoiceDocRef = doc(invoicesCollectionRef, uid);
    await setDoc(invoiceDocRef, {
      uid: uid,
      user: `${user().decodedString}`,
      ...invoiceData,
    });
    return uid;
  } catch (error) {
    console.error("Error al guardar información en /invoices: ", error);
    return null;
  }
};

export const getInvoicesDian = async () => {
  try {
    const establecimientoDocRef: DocumentReference = doc(
      db,
      "establecimientos",
      `${user().decodedString}`
    );
    const establecimientoSnapshot: DocumentSnapshot = await getDoc(
      establecimientoDocRef
    );

    // Verificar si el documento del establecimiento existe
    if (!establecimientoSnapshot.exists()) {
      console.warn(
        "El establecimiento no existe. No se pueden obtener facturas."
      );
      return []; // Retorna un array vacío si no existe
    }

    // Referencia a la colección `invoicesDian` dentro del documento del establecimiento
    const invoicesCollectionRef = collection(
      establecimientoDocRef,
      "invoicesDian"
    );
    const invoicesSnapshot = await getDocs(invoicesCollectionRef);

    // Verificar si hay documentos en la colección
    if (invoicesSnapshot.empty) {
      console.warn("No se encontraron facturas en la colección invoicesDian.");
      return []; // Retorna un array vacío si no hay documentos
    }

    // Mapear los documentos a un array de datos
    const invoices = invoicesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return invoices;
  } catch (error) {
    console.error("Error al obtener los datos de /invoicesDian: ", error);
    return null; // Retorna null en caso de error
  }
};

export const getLastInvoice = async () => {
  try {
    // Referencia a la colección `invoicesDian`
    const establecimientoDocRef = doc(
      db,
      "establecimientos",
      `${user().decodedString}`
    );

    const invoicesCollectionRef = collection(
      establecimientoDocRef,
      "invoicesDian"
    );

    const lastInvoiceQuery = query(
      invoicesCollectionRef,
      orderBy("document_number", "desc"),
      limit(1)
    );

    const querySnapshot = await getDocs(lastInvoiceQuery);

    if (querySnapshot.empty) {
      console.warn("No se encontraron facturas en la colección invoicesDian.");
      return null;
    }

    const lastInvoice = querySnapshot.docs[0].data();
    console.log("Última factura:", lastInvoice);

    return { id: querySnapshot.docs[0].id, ...lastInvoice };
  } catch (error) {
    console.error("Error al obtener la última factura:", error);
    return null;
  }
};

export const createElectronicInvoice = async (
  uid: string,
  invoiceData: any
) => {
  try {
    const establecimientoDocRef: DocumentReference = doc(
      db,
      "establecimientos",
      `${user().decodedString}`
    );
    const establecimientoSnapshot: DocumentSnapshot = await getDoc(
      establecimientoDocRef
    );
    if (!establecimientoSnapshot.exists()) {
      await setDoc(establecimientoDocRef, {});
    }
    const electronicDianCollectionRef = collection(
      establecimientoDocRef,
      "electronic_dian"
    );
    const electronicInvoiceDocRef = doc(electronicDianCollectionRef, uid);
    await setDoc(electronicInvoiceDocRef, {
      uid: uid,
      user: `${user().decodedString}`,
      createdAt: new Date().toISOString(),
      ...invoiceData,
    });
    return uid;
  } catch (error) {
    console.error("Error al guardar información en /electronic_dian: ", error);
    return null;
  }
};

export const getLastElectronicInvoice = async () => {
  try {
    const establecimientoDocRef: DocumentReference = doc(
      db,
      "establecimientos",
      `${user().decodedString}`,
      "invoicesDian"
    );
    const establecimientoSnapshot: DocumentSnapshot = await getDoc(
      establecimientoDocRef
    );

    if (!establecimientoSnapshot.exists()) {
      console.warn("No se encontró información del establecimiento.");
      return { message: "No se encontró información del establecimiento." };
    }
    const electronicDianCollectionRef = collection(
      establecimientoDocRef,
      "electronic_dian"
    );
    const lastInvoiceQuery = query(
      electronicDianCollectionRef,
      orderBy("createdAt", "desc"),
      limit(1)
    );

    const querySnapshot = await getDocs(lastInvoiceQuery);

    if (querySnapshot.empty) {
      console.warn("No se encontró ninguna factura electrónica.");
      return { message: "No se encontró ninguna factura electrónica." };
    }

    const lastInvoice = querySnapshot.docs[0];
    return {
      id: lastInvoice.id,
      ...lastInvoice.data(),
    };
  } catch (error) {
    console.error("Error al recuperar la última factura electrónica: ", error);
    return {
      message: "Error al recuperar la última factura electrónica",
      error,
    };
  }
};

export const createDianRecord = async (dianData: any) => {
  try {
    const currentUser = user();

    if (!currentUser || !currentUser.decodedString) {
      throw new Error("Usuario no autenticado");
    }

    const dianDocRef = doc(
      db,
      `establecimientos/${currentUser.decodedString}/dian`,
      "data" // Nombre explícito del documento
    );

    await setDoc(dianDocRef, {
      user: `${currentUser.decodedString}`,
      ...dianData,
    });
    return dianDocRef.id;
  } catch (error) {
    console.error("Error al guardar información en /dian: ", error);
    return null;
  }
};

export const getDianRecord = async () => {
  try {
    const currentUser = user();

    if (!currentUser || !currentUser.decodedString) {
      throw new Error("Usuario no autenticado");
    }

    const dianDocRef = doc(
      db,
      `establecimientos/${currentUser.decodedString}/dian`,
      "data"
    );
    const docSnap = await getDoc(dianDocRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log("No existe el documento");
      return null;
    }
  } catch (error) {
    console.error("Error al obtener información de /dian: ", error);
    return null;
  }
};
