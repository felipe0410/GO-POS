// Import the functions you need from the SDKs you need
import { FirebaseApp, initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";
import {
  Firestore,
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from "firebase/auth";
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
    const establecimientoDocRef = doc(db, "establecimientos", "LocalFelipe");
    const productosCollectionRef = collection(
      establecimientoDocRef,
      "productos"
    );
    const productDocRef = doc(productosCollectionRef, uid);

    await setDoc(productDocRef, {
      uid: uid,
      user: "LocalFelipe",
      ...productData,
    });
    return uid;
  } catch (error) {
    console.error("Error al guardar información en /productos: ", error);
    return null;
  }
};

export const getAllProductsData = (callback: any) => {
  try {
    const establecimientoDocRef = doc(db, "establecimientos", "LocalFelipe");
    const productCollectionRef = collection(establecimientoDocRef, "productos");

    // Initial fetch of data
    getDocs(productCollectionRef)
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

    // Real-time updates
    const unsubscribe = onSnapshot(productCollectionRef, (querySnapshot) => {
      const productsData: any[] = [];
      querySnapshot.forEach((doc) => {
        productsData.push({ id: doc.id, ...doc.data() });
      });

      callback(productsData);
      return productsData
    });
    // Return the unsubscribe function to stop observing changes
    return unsubscribe;
  } catch (error) {
    console.error("Error setting up data observer: ", error);
    return null;
  }
};

export const getProductData = async (uid: any) => {
  try {
    const establecimientoDocRef = doc(db, "establecimientos", "LocalFelipe");
    const productCollectionRef = collection(establecimientoDocRef, "productos");
    const productDocRef = doc(productCollectionRef, uid);
    const docSnapshot = await getDoc(productDocRef);
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
export const updateProductData = async (uid: any, newData: any) => {
  try {
    const establecimientoDocRef = doc(db, "establecimientos", "LocalFelipe");
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

export const deleteProduct = async (uid: any) => {
  try {
    const establecimientoDocRef = doc(db, "establecimientos", "LocalFelipe");
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

export const getAllCategoriesData = (callback: any) => {
  try {
    const establecimientoDocRef = doc(db, "establecimientos", "LocalFelipe");
    const categoriesCollectionRef = collection(
      establecimientoDocRef,
      "categories"
    );
    const categoriesDocRef = doc(categoriesCollectionRef, "categories");
    const unsubscribe = onSnapshot(categoriesDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const categoriesData = docSnapshot.data().Categories;
        callback(categoriesData);
      } else {
        console.error('El documento "categories" no existe.');
        callback(null);
      }
    });

    // Devuelve la función unsubscribe para que puedas detener el observador cuando sea necesario
    return unsubscribe;
  } catch (error) {
    console.error("Error al obtener la información de la colección: ", error);
    return null;
  }
};

export const addCategory = async (newCategory: string) => {
  try {
    const establecimientoDocRef = doc(db, "establecimientos", "LocalFelipe");
    const categoriesCollectionRef = collection(
      establecimientoDocRef,
      "categories"
    );
    const categoriesDocRef = doc(categoriesCollectionRef, "categories");
    await updateDoc(categoriesDocRef, {
      Categories: arrayUnion(newCategory),
    });
  } catch (error) {
    console.error("Error al agregar nueva categoría: ", error);
  }
};

export const removeCategory = async (categoryToRemove: string) => {
  try {
    const establecimientoDocRef = doc(db, "establecimientos", "LocalFelipe");
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

export const getAllMeasurementsData = async () => {
  try {
    const establecimientoDocRef = doc(db, "establecimientos", "LocalFelipe");
    const measurementsCollectionRef = collection(
      establecimientoDocRef,
      "measurements"
    );
    const measurementsDocRef = doc(measurementsCollectionRef, "measurements");
    const docSnapshot = await getDoc(measurementsDocRef);
    if (docSnapshot.exists()) {
      const measurementsData = docSnapshot.data().Measurements;
      return measurementsData;
    } else {
      console.error('El documento "measurements" no existe.');
      return null;
    }
  } catch (error) {
    console.error("Error al obtener la información de la colección: ", error);
    return null;
  }
};

export const getAllMeasurementsDataa = (callback: any) => {
  try {
    const establecimientoDocRef = doc(db, "establecimientos", "LocalFelipe");
    const measurementsCollectionRef = collection(
      establecimientoDocRef,
      "measurements"
    );
    const measurementsDocRef = doc(measurementsCollectionRef, "measurements");
    const unsubscribe = onSnapshot(measurementsDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const measurementsData = docSnapshot.data().Measurements;
        callback(measurementsData);
      } else {
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

export const addMeasurements = async (newMeasure: string) => {
  try {
    const establecimientoDocRef = doc(db, "establecimientos", "LocalFelipe");
    const measurementsCollectionRef = collection(
      establecimientoDocRef,
      "measurements"
    );
    const measurementsDocRef = doc(measurementsCollectionRef, "measurements");
    await updateDoc(measurementsDocRef, {
      Measurements: arrayUnion(newMeasure),
    });
  } catch (error) {
    console.error("Error al agregar nueva categoría: ", error);
  }
};

export const removeMeasurements = async (measureToRemove: string) => {
  try {
    const establecimientoDocRef = doc(db, "establecimientos", "LocalFelipe");
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
// sing-in
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

export const saveDataUser = async (uid: any, userData: any) => {
  try {
    const userCollectionRef = collection(db, "user");
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