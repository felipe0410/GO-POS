import {
  collection,
  doc,
  DocumentReference,
  DocumentSnapshot,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { db, user } from "./index";

export const createInvoiceParking = async (uid: string, invoiceData: any) => {
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
      "invoicesParking"
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