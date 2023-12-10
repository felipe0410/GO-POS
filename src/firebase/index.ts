// Import the functions you need from the SDKs you need
import { FirebaseApp, initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  Firestore,
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
// const analytics = getAnalytics(app);

export const createProduct = async (uid: any, productData: any) => {
  try {
    const productCollectionRef = collection(db, "productos");
    const productDocRef = doc(productCollectionRef, uid);
    await setDoc(productDocRef, {
      uid: uid,
      ...productData,
    });
    console.log("Documento guardado con ID: ", uid);
    return uid;
  } catch (error) {
    console.error("Error al guardar información en /productos: ", error);
    return null;
  }
};

export const getProductsData = async (uid: any) => {
  try {
    const productCollectionRef = collection(db, "productos");
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
