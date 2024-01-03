// Import the functions you need from the SDKs you need
import { FirebaseApp, initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
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
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";

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
// Función para crear un producto
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
      console.log("Documento actualizado con éxito.");
    } else {
      console.log("El documento no existe.");
    }
  } catch (error) {
    console.error("Error al actualizar el documento: ", error);
  }
};

// Función para eliminar un producto
export const deleteProduct = async (uid: any) => {
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
      await deleteDoc(productDocRef);
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error al eliminar el producto: ", error);
    return false;
  }
};

//funcion para crear la factura y agregar los datos
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
    return uid;
  } catch (error) {
    console.error("Error al guardar información en /invoices: ", error);
    return null;
  }
};

//funcion para obtener las facturas
export const getAllInvoicesData = async (callback: any) => {
  try {
    const establecimientoDocRef = doc(
      db,
      "establecimientos",
      `${user().decodedString}`
    );
    const invoiceCollectionRef = collection(establecimientoDocRef, "invoices");
    const orderedQuery = query(invoiceCollectionRef, orderBy("invoice"));
    getDocs(orderedQuery)
      .then((querySnapshot) => {
        const invoiceData: any[] = [];
        querySnapshot.forEach((doc) => {
          invoiceData.push({ id: doc.id, ...doc.data() });
        });

        callback(invoiceData);
      })
      .catch((error) => {
        console.error("Error fetching initial data:", error);
        callback(null);
      });
    const unsubscribe = onSnapshot(orderedQuery, (querySnapshot: any) => {
      const invoiceData: any[] = [];
      querySnapshot.forEach((doc: any) => {
        invoiceData.push({ id: doc.id, ...doc.data() });
      });
      callback(invoiceData);
      return invoiceData;
    });
    // Return the unsubscribe function to stop observing changes
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
    console.log(user);
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

export const getEstablishmentData = async () => {
  try {
    const encodedUserUID = localStorage.getItem('user');
    console.log(encodedUserUID)
    if (!encodedUserUID) {
      console.error('No se encontró un UID en el local storage');
      return null;
    }
    const userUID = atob(encodedUserUID);
    const userCollectionRef = collection(db, 'registeredEstablishments');
    const establishmentDocRef = doc(userCollectionRef, userUID)
    const docSnapshot = await getDoc(establishmentDocRef);
    if (docSnapshot.exists()) {
      const establishmentData = docSnapshot.data();
      console.log('Data del establecimiento:', establishmentData);
      return establishmentData;
    } else {
      console.error('El documento del establecimiento no existe');
      return null;
    }
  } catch (error) {
    console.error('Error al obtener la información del establecimiento:', error);
    return null;
  }
};
