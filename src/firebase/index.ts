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
  doc,
  getDoc,
  getDocs,
  getFirestore,
  setDoc,
  updateDoc,
} from "firebase/firestore";
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

export const getProductsData = async (uid: any) => {
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

export const getAllCategoriesData = async () => {
  try {
    const establecimientoDocRef = doc(db, "establecimientos", "LocalFelipe");
    const categoriesCollectionRef = collection(
      establecimientoDocRef,
      "categories"
    );
    const categoriesDocRef = doc(categoriesCollectionRef, "categories");
    const docSnapshot = await getDoc(categoriesDocRef);
    if (docSnapshot.exists()) {
      const categoriesData = docSnapshot.data().Categories;
      return categoriesData;
    } else {
      console.error('El documento "categories" no existe.');
      return null;
    }
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
