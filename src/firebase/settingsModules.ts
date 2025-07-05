import { doc, collection, setDoc, getDoc } from "firebase/firestore";
import { db, user } from ".";


export const saveModules = async (modulesData: any) => {
  try {
    const establecimientoDocRef = doc(
      db,
      "establecimientos",
      `${user().decodedString}`
    );

    const modulesCollectionRef = collection(establecimientoDocRef, "modules");
    const modulesDocRef = doc(modulesCollectionRef, "activatedModules");

    await setDoc(
      modulesDocRef,
      {
        ...modulesData,
        user: `${user().decodedString}`,
      },
      { merge: true }
    );

    console.log("Módulos guardados con éxito");
    return true;
  } catch (error) {
    console.error("Error al guardar módulos:", error);
    return false;
  }
};


export const getModules = async () => {
  try {
    const establecimientoDocRef = doc(
      db,
      "establecimientos",
      `${user().decodedString}`
    );

    const modulesCollectionRef = collection(establecimientoDocRef, "modules");
    const modulesDocRef = doc(modulesCollectionRef, "activatedModules");

    const docSnap = await getDoc(modulesDocRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log("No hay configuración de módulos aún.");
      return null;
    }
  } catch (error) {
    console.error("Error al obtener módulos:", error);
    return null;
  }
};

