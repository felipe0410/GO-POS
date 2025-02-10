// Import the functions you need from the SDKs you need
import { FirebaseApp, initializeApp } from "firebase/app";
import { deleteObject, getStorage, ref } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";
import {
  DocumentReference,
  DocumentSnapshot,
  Firestore,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  startAfter,
  updateDoc,
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { ColabData } from "@/app/profile/page";

interface User {
  decodedString: string;
}

export const user: () => User = () => {
  let decodedString = "";
  if (typeof window !== "undefined") {
    const base64String: string = localStorage?.getItem("user") ?? "";
    const correctedBase64String = base64String.replace(/%3D/g, "=");
    decodedString = atob(correctedBase64String);
  }
  return { decodedString };
};
// export const rediret = (pathname: string) => {
//   if (user().decodedString?.length === 0 && pathname !== "/sign_in") {
//     window.location.href = "/sign_in";
//   }
//   if (user().decodedString?.length > 0 && pathname === "/sign_in") {
//     window.location.href = "/inventory/productos";
//   }
// };
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_APIKEY ?? "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTHDOMAIN ?? "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECTID ?? "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGEBUCKET ?? "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGINGSENDERID ?? "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APPID ?? "",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENTID ?? "",
};

// Initialize Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);
export const db: Firestore = getFirestore(app);
export const storage = getStorage(app);
const auth = getAuth();

// const analytics = getAnalytics(app);

export const createProduct = async (uid: any, productData: any) => {
  try {
    const establecimientoDocRef = doc(
      db,
      "establecimientos",
      `${user().decodedString}`
    );
    const productosCollectionRef = collection(
      establecimientoDocRef,
      "productos"
    );
    const productDocRef = doc(productosCollectionRef, uid);

    await setDoc(productDocRef, {
      uid: uid,
      user: `${user().decodedString}`,
      ...productData,
    });
    return uid;
  } catch (error) {
    console.error("Error al guardar información en /productos: ", error);
    return null;
  }
};
// Función para obtener todos los  productos
export const getAllProductsData = (callback: any) => {
  try {
    const establecimientoDocRef = doc(
      db,
      "establecimientos",
      `${user().decodedString}`
    );
    const productCollectionRef = collection(establecimientoDocRef, "productos");
    // Query para obtener los productos ordenados alfabéticamente
    const orderedQuery = query(productCollectionRef, orderBy("productName"));
    getDocs(orderedQuery)
      .then((querySnapshot) => {
        const productsData: any[] = [];
        querySnapshot.forEach((doc) => {
          productsData.push({ id: doc.id, ...doc.data() });
        });

        callback(productsData);
      })
      .catch((error) => {
        console.error("Error fetching initial data:", error);
        callback(null);
      });
    const unsubscribe = onSnapshot(orderedQuery, (querySnapshot: any) => {
      const productsData: any[] = [];
      querySnapshot.forEach((doc: any) => {
        productsData.push({ id: doc.id, ...doc.data() });
      });
      callback(productsData);
      return productsData;
    });

    // Return the unsubscribe function to stop observing changes
    return unsubscribe;
  } catch (error) {
    console.error("Error setting up data observer: ", error);
    return null;
  }
};

export const getAllProductsDataonSnapshot = async (callback: any) => {
  try {
    const establecimientoDocRef = doc(
      db,
      "establecimientos",
      `${user().decodedString}`
    );
    const productCollectionRef = collection(establecimientoDocRef, "productos");
    const orderedQuery = query(productCollectionRef, orderBy("productName"));

    const initialSnapshot = await getDocs(orderedQuery);
    const initialData = initialSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    callback(initialData); 

    const unsubscribe = onSnapshot(orderedQuery, (querySnapshot) => {
      if (querySnapshot.metadata.hasPendingWrites) return; 

      const productsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      callback(productsData);
    });

    return unsubscribe;
  } catch (error) {
    console.error("Error al obtener productos:", error);
    return null;
  }
};
export const getAllProductsDataonSnapshotCache = (callback: any) => {
  try {
    const establecimientoDocRef = doc(
      db,
      "establecimientos",
      `${user().decodedString}`
    );
    const productCollectionRef = collection(establecimientoDocRef, "productos");
    const orderedQuery = query(productCollectionRef, orderBy("productName"));

    // Intenta cargar los datos desde el localStorage
    const cacheKey = `products_${user().decodedString}`;
    const cachedData = localStorage.getItem(cacheKey);

    if (cachedData) {
      const { timestamp, data } = JSON.parse(cachedData);
      // Verifica si los datos en caché tienen menos de 1 hora
      if (Date.now() - timestamp < 3600000) {
        callback(data);
      }
    }

    // Suscribirse a cambios en Firestore
    const unsubscribe = onSnapshot(
      orderedQuery,
      (querySnapshot) => {
        const productsData: any[] = [];
        querySnapshot.forEach((doc) => {
          productsData.push({ id: doc.id, ...doc.data() });
        });

        // Actualiza el cache con los nuevos datos
        localStorage.setItem(
          cacheKey,
          JSON.stringify({ timestamp: Date.now(), data: productsData })
        );

        callback(productsData);
      },
      (error) => {
        console.error("Error listening to data:", error);
        callback(null);
      }
    );

    // Devuelve la función de desuscripción
    return unsubscribe;
  } catch (error) {
    console.error("Error setting up data observer: ", error);
    return null;
  }
};

// Función para obtener datos de un producto específico
export const getProductData = async (uid: any) => {
  try {
    const establecimientoDocRef = doc(
      db,
      "establecimientos",
      `${user().decodedString}`
    );
    const productCollectionRef = collection(establecimientoDocRef, "productos");
    const productDocRef = doc(productCollectionRef, uid);
    const docSnapshot = await getDoc(productDocRef);
    if (docSnapshot.exists()) {
      return docSnapshot.data();
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error al obtener información del documento: ", error);
    return null;
  }
};
// Función para actualizar datos de un producto
export const updateProductData = async (uid: any, newData: any) => {
  try {
    const establecimientoDocRef = doc(
      db,
      "establecimientos",
      `${user().decodedString}`
    );
    const productCollectionRef = collection(establecimientoDocRef, "productos");
    const productDocRef = doc(productCollectionRef, uid);

    const docSnapshot = await getDoc(productDocRef);

    if (docSnapshot.exists()) {
      await updateDoc(productDocRef, newData);
    } else {
      console.log("El documento no existe.");
    }
  } catch (error) {
    console.error("Error al actualizar el documento: ", error);
  }
};

export const updateProductDataCantidad = async (uid: any, newData: any) => {
  console.log(uid);
  try {
    const establecimientoDocRef = doc(
      db,
      "establecimientos",
      `${user().decodedString}`
    );
    const productCollectionRef = collection(establecimientoDocRef, "productos");
    const productDocRef = doc(productCollectionRef, uid);

    const docSnapshot = await getDoc(productDocRef);

    if (docSnapshot.exists()) {
      const existingData = docSnapshot.data();
      if (existingData) {
        const newCantidad = existingData.cantidad - newData.cantidad;

        if (newCantidad >= 0) {
          // Actualizar el documento con la nueva cantidad
          await updateDoc(productDocRef, { ...newData, cantidad: newCantidad });
        } else {
          console.log("No hay suficiente cantidad para actualizar.");
        }
      }
    } else {
      console.log("El documento no existe.");
    }
  } catch (error) {
    console.error("Error al actualizar el documento: ", error);
  }
};

export const deleteProduct = async (uid: any, img: string) => {
  try {
    const establecimientoDocRef = doc(
      db,
      "establecimientos",
      `${user().decodedString}`
    );
    const productCollectionRef = collection(establecimientoDocRef, "productos");
    const productDocRef = doc(productCollectionRef, uid);
    const docSnapshot = await getDoc(productDocRef);
    if (docSnapshot.exists()) {
      const previousImageRef = ref(storage, img);
      await deleteDoc(productDocRef);
      await deleteObject(previousImageRef);
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error al eliminar el producto: ", error);
    return false;
  }
};

export const createInvoice = async (uid: string, invoiceData: any) => {
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
    const invoicesCollectionRef = collection(establecimientoDocRef, "invoices");
    const invoiceDocRef = doc(invoicesCollectionRef, uid);
    await setDoc(invoiceDocRef, {
      uid: uid,
      user: `${user().decodedString}`,
      ...invoiceData,
    });
    console.log("invice;;>", uid);
    return uid;
  } catch (error) {
    console.error("Error al guardar información en /invoices: ", error);
    return null;
  }
};

//funcion para actualizar datos de factura
export const updateInvoice = async (uid: string, invoiceData: any) => {
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
      console.error("El establecimiento no existe.");
      return null;
    }

    const invoicesCollectionRef = collection(establecimientoDocRef, "invoices");
    const invoiceDocRef = doc(invoicesCollectionRef, uid);

    await updateDoc(invoiceDocRef, invoiceData);
    return uid;
  } catch (error) {
    console.error("Error al actualizar información en /invoices: ", error);
    return null;
  }
};

// funcion para eliminar la factura
export const deleteInvoice = async (uid: string) => {
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
      console.error("El establecimiento no existe.");
      return null;
    }

    const invoicesCollectionRef = collection(establecimientoDocRef, "invoices");
    const invoiceDocRef = doc(invoicesCollectionRef, uid);

    await deleteDoc(invoiceDocRef);
    return uid;
  } catch (error) {
    console.error("Error al eliminar la factura de la base de datos: ", error);
    return null;
  }
};

export const deleteClient = async (uid: string) => {
  try {
    const establecimientoDocRef: DocumentReference = doc(
      db,
      "establecimientos",
      `${user().decodedString}`
    );

    const establecimientoSnapshot = await getDoc(establecimientoDocRef);
    if (!establecimientoSnapshot.exists()) {
      console.warn(
        "El establecimiento no existe. No se puede eliminar el cliente."
      );
      return false;
    }

    const clientDocRef = doc(establecimientoDocRef, "clients", uid);

    await deleteDoc(clientDocRef);
    return true;
  } catch (error) {
    console.error("Error al eliminar el cliente en /clients: ", error);
    return false;
  }
};

export const createClient = async (uid: string, data: any) => {
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
    const invoicesCollectionRef = collection(establecimientoDocRef, "clients");
    const invoiceDocRef = doc(invoicesCollectionRef, uid);
    await setDoc(invoiceDocRef, {
      uid: uid,
      user: `${user().decodedString}`,
      ...data,
    });
    return uid;
  } catch (error) {
    console.error("Error al guardar información en /clients: ", error);
    return null;
  }
};

export const getAllClientsData = (callback: any) => {
  try {
    const establecimientoDocRef = doc(
      db,
      "establecimientos",
      `${user().decodedString}`
    );
    const clientsCollectionRef = collection(establecimientoDocRef, "clients");
    const orderedQuery = query(clientsCollectionRef, orderBy("name"));
    getDocs(orderedQuery)
      .then((querySnapshot) => {
        const clientsData: any[] = [];
        querySnapshot.forEach((doc) => {
          clientsData.push({ id: doc.id, ...doc.data() });
        });
        callback(clientsData);
      })
      .catch((error) => {
        console.error("Error fetching initial clients data:", error);
        callback(null);
      });
    const unsubscribe = onSnapshot(orderedQuery, (querySnapshot) => {
      const clientsData: any[] = [];
      querySnapshot.forEach((doc) => {
        clientsData.push({ id: doc.id, ...doc.data() });
      });
      callback(clientsData);
    });
    return unsubscribe;
  } catch (error) {
    console.error("Error setting up clients data observer: ", error);
    return null;
  }
};

export const getAllInvoicesData = async (callback: any) => {
  try {
    const establecimientoDocRef = doc(
      db,
      "establecimientos",
      `${user().decodedString}`
    );
    const invoiceCollectionRef = collection(establecimientoDocRef, "invoices");
    const orderedQuery = query(invoiceCollectionRef, orderBy("date", "desc"));

    const initialQuerySnapshot = await getDocs(orderedQuery);
    const initialInvoiceData = initialQuerySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    callback(initialInvoiceData);

    const unsubscribe = onSnapshot(orderedQuery, (querySnapshot: any) => {
      const updatedInvoiceData = querySnapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data(),
      }));

      callback(updatedInvoiceData);
    });

    return unsubscribe;
  } catch (error) {
    console.error("Error setting up data observer: ", error);
    return null;
  }
};

//funcion para obtener una factura
export const getInvoiceData = async (uid: any) => {
  try {
    const establecimientoDocRef = doc(
      db,
      "establecimientos",
      `${user().decodedString}`
    );
    const invoiceCollectionRef = collection(establecimientoDocRef, "invoices");
    const invoiceDocRef = doc(invoiceCollectionRef, uid);
    const docSnapshot = await getDoc(invoiceDocRef);
    if (docSnapshot.exists()) {
      return docSnapshot.data();
    } else {
      console.log("El documento no existe.");
      return null;
    }
  } catch (error) {
    console.error("Error al obtener información del documento: ", error);
    return null;
  }
};

//funcion para crear los pendientes y agregar los datos
export const createIncompletedItems = async (
  uid: string,
  incompletedData: any
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
    const pendingCollectionRef = collection(establecimientoDocRef, "pendings");
    const pendingDocRef = doc(pendingCollectionRef, uid);
    await setDoc(pendingDocRef, {
      uid: uid,
      user: `${user().decodedString}`,
      ...incompletedData,
    });
    console.log("se guardo con exito");
    return uid;
  } catch (error) {
    console.error("Error al guardar información en /pendings: ", error);
    return null;
  }
};

// Función para obtener todas las categorías
export const getAllCategoriesData = (callback: any) => {
  try {
    const establecimientoDocRef = doc(
      db,
      "establecimientos",
      `${user().decodedString}`
    );
    const categoriesCollectionRef = collection(
      establecimientoDocRef,
      "categories"
    );
    const categoriesDocRef = doc(categoriesCollectionRef, "categories");
    const unsubscribe = onSnapshot(categoriesDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const categoriesData = docSnapshot.data().Categories;
        const sortedCategoriesData = categoriesData
          ?.slice()
          .sort((a: any, b: any) => a.localeCompare(b));
        callback(sortedCategoriesData);
      } else {
        addCategory("varios");
        console.error('El documento "categories" no existe.');
        callback(null);
      }
    });
    return unsubscribe;
  } catch (error) {
    console.error("Error al obtener la información de la colección: ", error);
    return null;
  }
};

// Función para agregar una nueva categoría
export const addCategory = async (newCategory: string) => {
  try {
    const establecimientoDocRef = doc(
      db,
      "establecimientos",
      `${user().decodedString}`
    );
    const categoriesCollectionRef = collection(
      establecimientoDocRef,
      "categories"
    );
    const categoriesDocRef = doc(categoriesCollectionRef, "categories");
    const docSnapshot = await getDoc(categoriesDocRef);
    if (docSnapshot.exists()) {
      await updateDoc(categoriesDocRef, {
        Categories: arrayUnion(newCategory),
      });
    } else {
      await setDoc(categoriesDocRef, {
        Categories: [newCategory],
      });
    }
    console.log("Categoría agregada exitosamente.");
  } catch (error) {
    console.error("Error al agregar nueva categoría: ", error);
  }
};

// Función para eliminar una categoría
export const removeCategory = async (categoryToRemove: string) => {
  try {
    const establecimientoDocRef = doc(
      db,
      "establecimientos",
      `${user().decodedString}`
    );
    const categoriesCollectionRef = collection(
      establecimientoDocRef,
      "categories"
    );
    const categoriesDocRef = doc(categoriesCollectionRef, "categories");
    await updateDoc(categoriesDocRef, {
      Categories: arrayRemove(categoryToRemove),
    });
    console.log("Categoría eliminada correctamente.");
  } catch (error) {
    console.error("Error al eliminar la categoría: ", error);
  }
};

// Función para obtener todos los datos de medidas en tiempo real
export const getAllMeasurementsDataa = (callback: any) => {
  try {
    const establecimientoDocRef = doc(
      db,
      "establecimientos",
      `${user().decodedString}`
    );
    const measurementsCollectionRef = collection(
      establecimientoDocRef,
      "measurements"
    );
    const measurementsDocRef = doc(measurementsCollectionRef, "measurements");
    const unsubscribe = onSnapshot(measurementsDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const measurementsData = docSnapshot.data().Measurements;
        const sortedMeasurementsData = measurementsData
          ?.slice()
          .sort((a: any, b: any) => a.localeCompare(b));
        callback(sortedMeasurementsData);
      } else {
        addMeasurements("und");
        console.error('El documento "measurements" no existe.');
        callback(null);
      }
    });

    return unsubscribe;
  } catch (error) {
    console.error("Error al obtener la información de la colección: ", error);
    return null;
  }
};

// Función para agregar una nueva medida
export const addMeasurements = async (newMeasure: string) => {
  try {
    const establecimientoDocRef = doc(
      db,
      "establecimientos",
      `${user().decodedString}`
    );
    const measurementsCollectionRef = collection(
      establecimientoDocRef,
      "measurements"
    );
    const measurementsDocRef = doc(measurementsCollectionRef, "measurements");
    const docSnapshot = await getDoc(measurementsDocRef);
    if (docSnapshot.exists()) {
      await updateDoc(measurementsDocRef, {
        Measurements: arrayUnion(newMeasure),
      });
    } else {
      await setDoc(measurementsDocRef, {
        Measurements: [newMeasure],
      });
    }

    console.log("Unidad de medida agregada exitosamente.");
  } catch (error) {
    console.error("Error al agregar nueva unidad de medida: ", error);
  }
};
// Función para eliminar una medida
export const removeMeasurements = async (measureToRemove: string) => {
  try {
    const establecimientoDocRef = doc(
      db,
      "establecimientos",
      `${user().decodedString}`
    );
    const measurementsCollectionRef = collection(
      establecimientoDocRef,
      "measurements"
    );
    const measurementsDocRef = doc(measurementsCollectionRef, "measurements");
    await updateDoc(measurementsDocRef, {
      Measurements: arrayRemove(measureToRemove),
    });
  } catch (error) {
    console.error("Error al eliminar la categoría: ", error);
  }
};
// funcion para ingresar
export const loginUser = async (email: any, password: any) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    return user;
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    const dataError = {
      errorCode,
      errorMessage,
    };
    console.error(dataError);
    return dataError;
  }
};

// funcion para crear usuario

export const creteUser = async (email: any, password: any) => {
  try {
    const createUser = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    return createUser.user;
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    const errorData = {
      errorCode,
      errorMessage,
    };
    console.log(errorData);
    return errorData;
  }
};

// funcion para guardar informacion de usuarios
export const saveDataUser = async (uid: any, userData: any) => {
  try {
    const userCollectionRef = collection(db, "registeredEstablishments");
    const userDocRef = doc(userCollectionRef, uid);
    await setDoc(userDocRef, {
      uid: uid,
      ...userData,
    });
    console.log("Documento guardado con ID: ", uid);
    return uid;
  } catch (error) {
    console.error("Error al guardar información en /user: ", error);
    return null;
  }
};

export const getEstablishmentDataLoggin = async (encodedUserUID: string) => {
  try {
    if (!encodedUserUID) {
      console.error("No se encontró un UID en el local storage");
      return null;
    }
    const userCollectionRef = collection(db, "registeredEstablishments");
    const establishmentDocRef = doc(userCollectionRef, encodedUserUID);
    const docSnapshot = await getDoc(establishmentDocRef);
    if (docSnapshot.exists()) {
      const establishmentData = docSnapshot.data();
      return establishmentData;
    } else {
      console.error("El documento del establecimiento no existe");
      return null;
    }
  } catch (error) {
    console.error(
      "Error al obtener la información del establecimiento:",
      error
    );
    return null;
  }
};

export const getEstablishmentData = async () => {
  try {
    const encodedUserUID = localStorage.getItem("user");
    if (!encodedUserUID) {
      console.error("No se encontró un UID en el local storage");
      return null;
    }
    const userUID = atob(encodedUserUID);
    const userCollectionRef = collection(db, "registeredEstablishments");
    const establishmentDocRef = doc(userCollectionRef, userUID);
    const docSnapshot = await getDoc(establishmentDocRef);
    if (docSnapshot.exists()) {
      const establishmentData = docSnapshot.data();
      return establishmentData;
    } else {
      console.error("El documento del establecimiento no existe");
      return null;
    }
  } catch (error) {
    console.error(
      "Error al obtener la información del establecimiento:",
      error
    );
    return null;
  }
};

//actualizar datos del establecimiento
export const updateEstablishmentsData = async (updatedFields: any) => {
  try {
    const encodedUserUID = localStorage.getItem("user");
    if (!encodedUserUID) {
      console.error("No se encontró un UID en el local storage");
      return null;
    }
    const userUID = atob(encodedUserUID);
    const userCollectionRef = collection(db, "registeredEstablishments");
    const establishmentDocRef = doc(userCollectionRef, userUID);
    const docSnapshot = await getDoc(establishmentDocRef);

    if (docSnapshot.exists()) {
      const currentData = docSnapshot.data();
      const newData = {
        ...currentData,
        ...updatedFields,
      };
      await setDoc(establishmentDocRef, newData);
      console.log(
        "Datos del establecimiento actualizados correctamente:",
        newData
      );

      return newData;
    } else {
      console.error("El documento del establecimiento no existe");
      return null;
    }
  } catch (error) {
    console.error(
      "Error al obtener o actualizar la información del establecimiento:",
      error
    );
    return null;
  }
};

export const createColabsData = async (uid: string, colabsData: any) => {
  try {
    const establecimientoDocRef: DocumentReference = doc(
      db,
      "registeredEstablishments",
      `${user().decodedString}`
    );
    const establecimientoSnapshot: DocumentSnapshot = await getDoc(
      establecimientoDocRef
    );

    if (!establecimientoSnapshot.exists()) {
      await setDoc(establecimientoDocRef, {});
    }
    const collaboratorsCollectionRef = collection(
      establecimientoDocRef,
      "collaborators"
    );
    const collaboratorsDocRef = doc(collaboratorsCollectionRef, uid);
    await setDoc(collaboratorsDocRef, {
      uid: uid,
      ...colabsData,
    });
    return uid;
  } catch (error) {
    console.error("Error al guardar información en la base de datos: ", error);
    return null;
  }
};

//funcion para obtener los colaboradores
export const getAllColabsData = async (
  callback: (colabsData: ColabData[]) => void
) => {
  try {
    const establecimientoDocRef: DocumentReference = doc(
      db,
      "registeredEstablishments",
      `${user().decodedString}`
    );

    const collaboratorsCollectionRef = collection(
      establecimientoDocRef,
      "collaborators"
    );

    const unsubscribe = onSnapshot(collaboratorsCollectionRef, (snapshot) => {
      const colabsData = snapshot.docs.map((doc) => doc.data() as ColabData);
      callback(colabsData);
    });
    return unsubscribe;
  } catch (error) {
    console.error("Error al obtener información de colaboradores: ", error);
    return null;
  }
};

//funcion para eliminar un colaborador
export const deleteColabData = async (colabId: string) => {
  try {
    const establecimientoDocRef: DocumentReference = doc(
      db,
      "registeredEstablishments",
      `${user().decodedString}`
    );

    const collaboratorsCollectionRef = collection(
      establecimientoDocRef,
      "collaborators"
    );

    const colabDocRef = doc(collaboratorsCollectionRef, colabId);
    await deleteDoc(colabDocRef);

    console.log("Colaborador eliminado exitosamente.");

    return true;
  } catch (error) {
    console.error("Error al eliminar el colaborador: ", error);
    return false;
  }
};

//funcion para actualizar colaborador
export const updateColabData = async (
  colabId: string,
  newData: Partial<ColabData>
) => {
  try {
    const establecimientoDocRef: DocumentReference = doc(
      db,
      "registeredEstablishments",
      `${user().decodedString}`
    );

    const collaboratorsCollectionRef = collection(
      establecimientoDocRef,
      "collaborators"
    );

    const colabDocRef = doc(collaboratorsCollectionRef, colabId);
    await updateDoc(colabDocRef, newData);

    console.log("Datos del colaborador actualizados exitosamente.");

    return true;
  } catch (error) {
    console.error("Error al actualizar los datos del colaborador: ", error);
    return false;
  }
};

export const saveSettings = async (settingsData: any) => {
  try {
    const establecimientoDocRef = doc(
      db,
      "establecimientos",
      `${user().decodedString}`
    );
    // Asegurarse de referenciar un documento específico en la colección 'settings'
    const settingsCollectionRef = collection(establecimientoDocRef, "settings");
    const settingsDocRef = doc(settingsCollectionRef, "GeneralSettings"); // 'uniqueSettingsId' debería ser un ID constante o generado
    console.log(settingsDocRef);
    await setDoc(
      settingsDocRef,
      {
        ...settingsData,
        user: `${user().decodedString}`,
      },
      { merge: true }
    );
    console.log("Configuración guardada con éxito!");
    return true;
  } catch (error) {
    console.error("Error al guardar configuración: ", error);
    return false;
  }
};

export const fetchAndStoreSettings = async () => {
  try {
    const establecimientoDocRef = doc(
      db,
      "establecimientos",
      `${user().decodedString}`
    );
    const settingsCollectionRef = collection(establecimientoDocRef, "settings");
    const settingsDocRef = doc(settingsCollectionRef, "GeneralSettings");

    const docSnap = await getDoc(settingsDocRef);
    if (docSnap.exists()) {
      const settingsData = docSnap.data();
      localStorage.setItem("settingsData", JSON.stringify(settingsData));
      console.log("Configuración almacenada en Local Storage con éxito!");
      return true;
    } else {
      console.log(
        "Configuración no encontrada, creando con valores predeterminados..."
      );
      const defaultSettings = { numberOfDigitsToGenerateCode: 8 };
      await saveSettings(defaultSettings);
      localStorage.setItem("settingsData", JSON.stringify(defaultSettings));
      return true;
    }
  } catch (error) {
    console.error("Error al recuperar o crear la configuración: ", error);
    return false;
  }
};
