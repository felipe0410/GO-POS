// Import the functions you need from the SDKs you need
import { FirebaseApp, initializeApp } from "firebase/app";
import { deleteObject, getStorage, ref } from "firebase/storage";
import {
  DocumentReference,
  DocumentSnapshot,
  Firestore,
  Timestamp,
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
  updateDoc,
  where,
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { ColabData } from "@/app/profile/page";
import { format } from "date-fns";
import { getHoraColombia } from "@/components/Hooks/hooks";

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

const app: FirebaseApp = initializeApp(firebaseConfig);
export const db: Firestore = getFirestore(app);
export const storage = getStorage(app);
const auth = getAuth();


type Mesa = {
  id: string;
  tipo: "mesa" | "decorativo";
  subtipo?: string;
  nombre: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  puestos?: number;
  forma?: "cuadrada" | "redonda" | "rectangular";
};

export const saveZonaConfig = async (
  piso: number,
  mesas: Mesa[]
): Promise<boolean> => {
  try {
    const establecimientoDocRef = doc(
      db,
      "establecimientos",
      user().decodedString
    );

    const zonasCollectionRef = collection(establecimientoDocRef, "zonas_gastrobares");
    const zonaDocRef = doc(zonasCollectionRef, `piso-${piso}`);

    await setDoc(zonaDocRef, {
      piso,
      user: user().decodedString,
      mesas: JSON.parse(JSON.stringify(mesas)),
      updatedAt: Timestamp.now(),
    });

    return true;
  } catch (error) {
    console.error("Error al guardar configuración de zona:", error);
    return false;
  }
};

export const getZonaConfig = async (piso: number): Promise<Mesa[] | null> => {
  try {
    const establecimientoDocRef = doc(
      db,
      "establecimientos",
      user().decodedString
    );
    const zonaDocRef = doc(collection(establecimientoDocRef, "zonas_gastrobares"), `piso-${piso}`);
    const zonaSnap = await getDoc(zonaDocRef);

    if (zonaSnap.exists()) {
      const data = zonaSnap.data();
      return data.mesas ?? [];
    } else {
      console.warn("No hay configuración guardada para este piso.");
      return [];
    }
  } catch (error) {
    console.error("Error al recuperar configuración de zona:", error);
    return null;
  }
};


export const getPisosConfigurados = async (): Promise<number[]> => {
  try {
    const establecimientoDocRef = doc(
      db,
      "establecimientos",
      user().decodedString
    );
    const zonasCollectionRef = collection(establecimientoDocRef, "zonas_gastrobares");

    const snapshot = await getDocs(zonasCollectionRef);
    const pisos: number[] = [];

    snapshot.forEach((doc) => {
      const id = doc.id; // Ej: "piso-1"
      const match = id.match(/^piso-(\d+)$/);
      if (match) {
        pisos.push(parseInt(match[1], 10));
      }
    });

    return pisos.sort((a, b) => a - b);
  } catch (error) {
    console.error("Error al obtener pisos configurados:", error);
    return [];
  }
};
export const createProveedor = async (uid: string, proveedorData: any) => {
  try {
    const establecimientoDocRef = doc(
      db,
      "establecimientos",
      `${user().decodedString}`
    );
    const proveedoresCollectionRef = collection(establecimientoDocRef, "proveedores");
    const proveedorDocRef = doc(proveedoresCollectionRef, uid);

    await setDoc(proveedorDocRef, {
      uid,
      user: `${user().decodedString}`,
      ...proveedorData,
    });

    return uid;
  } catch (error) {
    console.error("Error al guardar proveedor en /proveedores: ", error);
    return null;
  }
};

export const getAllProveedores = async (): Promise<any[]> => {
  try {
    const establecimientoDocRef = doc(
      db,
      "establecimientos",
      `${user().decodedString}`
    );
    const proveedoresCollectionRef = collection(establecimientoDocRef, "proveedores");

    const querySnapshot = await getDocs(proveedoresCollectionRef);

    const proveedores: any[] = [];
    querySnapshot.forEach((doc) => {
      proveedores.push({ uid: doc.id, ...doc.data() });
    });

    return proveedores;
  } catch (error) {
    console.error("Error al obtener proveedores: ", error);
    return [];
  }
};


export const suscribeToProveedores = (
  callback: (proveedores: any[]) => void
): (() => void) => {
  try {
    const establecimientoDocRef = doc(
      db,
      "establecimientos",
      `${user().decodedString}`
    );
    const proveedoresCollectionRef = collection(establecimientoDocRef, "proveedores");

    // Suscripción en tiempo real
    const unsubscribe = onSnapshot(proveedoresCollectionRef, (querySnapshot) => {
      const proveedores: any[] = [];
      querySnapshot.forEach((doc) => {
        proveedores.push({ uid: doc.id, ...doc.data() });
      });
      callback(proveedores); // Dispara la actualización
    });

    return unsubscribe; // Para cancelar la suscripción si hace falta
  } catch (error) {
    console.error("Error al suscribirse a proveedores: ", error);
    return () => { };
  }
};

export const getProveedorByNIT = async (nit: string): Promise<any | null> => {
  try {
    const establecimientoDocRef = doc(
      db,
      "establecimientos",
      `${user().decodedString}`
    );

    const proveedoresCollectionRef = collection(establecimientoDocRef, "proveedores");
    const q = query(proveedoresCollectionRef, where("nit", "==", nit));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const docSnap = querySnapshot.docs[0];
      return { uid: docSnap.id, ...docSnap.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error al buscar proveedor por NIT:", error);
    return null;
  }
};

export const updateProveedor = async (uid: string, data: any) => {
  try {
    const proveedorRef = doc(
      db,
      "establecimientos",
      user().decodedString,
      "proveedores",
      uid
    );

    await updateDoc(proveedorRef, {
      ...data,
      uid,
      user: user().decodedString,
    });

    return true;
  } catch (error) {
    console.error("Error al actualizar proveedor: ", error);
    return false;
  }
};


export const deleteProveedor = async (uid: string) => {
  try {
    const proveedorRef = doc(
      db,
      "establecimientos",
      user().decodedString,
      "proveedores",
      uid
    );

    await deleteDoc(proveedorRef);
    return true;
  } catch (error) {
    console.error("Error al eliminar proveedor: ", error);
    return false;
  }
};

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
export const getAllProductsData = (callback: any, userID?: string) => {
  try {
    const establecimientoDocRef = doc(
      db,
      "establecimientos",
      userID || `${user().decodedString}`
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

export const fetchAndUpdateProducts = async (callback: any) => {
  try {
    const establecimientoDocRef = doc(
      db,
      "establecimientos",
      `${user().decodedString}`
    );
    const productCollectionRef = collection(establecimientoDocRef, "productos");

    // Query para obtener los productos ordenados alfabéticamente
    const orderedQuery = query(productCollectionRef, orderBy("productName"));

    // Obtener los documentos de Firestore
    const querySnapshot = await getDocs(orderedQuery);
    const productsData: any[] = [];

    for (const docSnapshot of querySnapshot.docs) {
      const product = docSnapshot.data();
      const purchasePrice =
        parseFloat(product.purchasePrice.replace(/[^0-9.-]+/g, "")) || 0;

      // Calculamos el wholesalePrice con 7% adicional
      const wholesalePriceRaw = purchasePrice * 1.07;

      // Redondeamos al múltiplo de 100 más cercano
      const wholesalePriceNumeric = Math.round(wholesalePriceRaw / 100) * 100;

      // Formateamos con separadores y el símbolo $
      const wholesalePrice = `$ ${wholesalePriceNumeric.toLocaleString()}`;

      // Construimos el objeto con ambos valores
      const updatedProduct = {
        id: docSnapshot.id,
        ...product,
        wholesalePrice,
        wholesalePriceNumeric,
      };
      productsData.push(updatedProduct);

      // Subimos la actualización a Firebase si los valores no existen o si cambiaron
      if (
        !product.wholesalePrice ||
        product.wholesalePrice !== wholesalePrice ||
        !product.wholesalePriceNumeric ||
        product.wholesalePriceNumeric !== wholesalePriceNumeric
      ) {
        await updateDoc(doc(productCollectionRef, docSnapshot.id), {
          wholesalePrice,
          wholesalePriceNumeric,
        });
      }
    }

    // Enviar los datos al callback
    callback(productsData);

    // Suscripción en tiempo real para futuras actualizaciones
    const unsubscribe = onSnapshot(orderedQuery, async (querySnapshot: any) => {
      const productsData: any[] = [];
      for (const docSnapshot of querySnapshot.docs) {
        const product = docSnapshot.data();
        const purchasePrice =
          parseFloat(product.purchasePrice.replace(/[^0-9.-]+/g, "")) || 0;

        // Calculamos el wholesalePrice con 7% adicional
        const wholesalePriceRaw = purchasePrice * 1.07;

        // Redondeamos al múltiplo de 100 más cercano
        const wholesalePriceNumeric = Math.round(wholesalePriceRaw / 100) * 100;

        // Formateamos con separadores y el símbolo $
        const wholesalePrice = `$ ${wholesalePriceNumeric.toLocaleString()}`;

        // Construimos el objeto con ambos valores
        const updatedProduct = {
          id: docSnapshot.id,
          ...product,
          wholesalePrice,
          wholesalePriceNumeric,
        };
        productsData.push(updatedProduct);

        // Subimos la actualización a Firebase si los valores no existen o si cambiaron
        if (
          !product.wholesalePrice ||
          product.wholesalePrice !== wholesalePrice ||
          !product.wholesalePriceNumeric ||
          product.wholesalePriceNumeric !== wholesalePriceNumeric
        ) {
          await updateDoc(doc(productCollectionRef, docSnapshot.id), {
            wholesalePrice,
            wholesalePriceNumeric,
          });
        }
      }

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

    const calcularCantidadDesdePadres = (
      producto: any,
      todos: Record<string, any>
    ): number | undefined => {
      const { parentBarCodes } = producto;

      if (!Array.isArray(parentBarCodes) || parentBarCodes.length === 0) {
        return undefined;
      }

      let cantidadFinal = undefined;

      const padreRaiz = todos[parentBarCodes[0]];
      if (!padreRaiz) return undefined;

      const cantidadRaiz = parseFloat(padreRaiz.cantidad || "0");
      if (isNaN(cantidadRaiz) || cantidadRaiz <= 0) return undefined;

      cantidadFinal = cantidadRaiz;

      for (let i = 1; i < parentBarCodes.length; i++) {
        const padre = todos[parentBarCodes[i]];
        if (!padre) return undefined;

        const factor = parseFloat(padre.cantidadContenida || "0");
        if (isNaN(factor) || factor <= 0) return undefined;

        cantidadFinal *= factor;
      }

      const propiaCantidadContenida = parseFloat(producto.cantidadContenida || "0");
      if (isNaN(propiaCantidadContenida) || propiaCantidadContenida <= 0) return undefined;

      cantidadFinal *= propiaCantidadContenida;

      return cantidadFinal;
    };


    const procesarYCalcular = (productsDataRaw: any[]) => {
      const mapaProductos: Record<string, any> = {};
      productsDataRaw.forEach((p) => {
        mapaProductos[p.barCode] = { ...p };
      });

      return productsDataRaw.map((producto) => {
        if (!producto.parentBarCodes || producto.parentBarCodes.length === 0) {
          return producto;
        }

        const nuevaCantidad = calcularCantidadDesdePadres(producto, mapaProductos);
        return nuevaCantidad === undefined
          ? producto
          : { ...producto, cantidad: nuevaCantidad.toFixed(1) };
      });
    };

    const initialSnapshot = await getDocs(orderedQuery);
    const initialDataRaw = initialSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const initialData = procesarYCalcular(initialDataRaw);
    callback(initialData);

    const unsubscribe = onSnapshot(orderedQuery, (querySnapshot) => {
      if (querySnapshot.metadata.hasPendingWrites) return;

      const productsDataRaw = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const productsData = procesarYCalcular(productsDataRaw);
      callback(productsData);
    });

    return unsubscribe;
  } catch (error) {
    console.error("❌ Error al obtener productos:", error);
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

    }
  } catch (error) {
    console.error("Error al actualizar el documento: ", error);
  }
};

export const updateProductDataCantidad = async (uid: any, newData: any) => {
  try {
    const establecimientoDocRef = doc(
      db,
      "establecimientos",
      `${user().decodedString}`
    );
    const productCollectionRef = collection(establecimientoDocRef, "productos");
    const productDocRef = doc(productCollectionRef, uid);

    const currentProductSnapshot = await getDoc(productDocRef);

    if (!currentProductSnapshot.exists()) {
      return;
    }

    const currentProduct = currentProductSnapshot.data();

    if (
      !Array.isArray(currentProduct.parentBarCodes) ||
      currentProduct.parentBarCodes.length === 0
    ) {
      const cantidadActual = parseFloat(currentProduct.cantidad || "0");
      const nuevaCantidad = cantidadActual - newData.cantidad;

      if (nuevaCantidad >= 0) {
        await updateDoc(productDocRef, {
          ...newData,
          cantidad: nuevaCantidad,
        });
        console.log("✅ Cantidad actualizada directamente.");
      } else {
        console.log("⚠️ No hay suficiente cantidad. Operación cancelada.");
      }
      return;
    }

    const parentUID = currentProduct.parentBarCodes[0];
    const parentProduct = await getProductData(parentUID);

    if (!parentProduct) {
      console.log("❌ Producto padre no encontrado.");
      return;
    }

    const porcentajeEquivalencia = parseFloat(
      currentProduct.porcentajeEquivalencia || "0"
    );
    const cantidadPadreActual = parseFloat(parentProduct.cantidad || "0");
    const cantidadARestar = newData.cantidad * porcentajeEquivalencia;

    const nuevaCantidadPadre = cantidadPadreActual - cantidadARestar;

    if (nuevaCantidadPadre < 0) {
      console.log("⚠️ No hay suficiente cantidad en el padre. Operación cancelada.");
      return;
    }
    await updateDoc(doc(productCollectionRef, parentUID), {
      ...parentProduct,
      cantidad: parseFloat(nuevaCantidadPadre.toPrecision(5)),
    });

    console.log("✅ Cantidad actualizada en el producto padre.");

  } catch (error) {
    console.error("❌ Error al actualizar el documento: ", error);
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
    const fechaCreacion = await getHoraColombia();
    if (!(fechaCreacion instanceof Date)) {
      console.warn(
        "⚠️ fechaCreacion no es una instancia válida de Date",
        fechaCreacion
      );
    }
    const timestampCreacion = Timestamp.fromDate(fechaCreacion);
    const date = format(fechaCreacion, "yyyy-MM-dd HH:mm");
    await setDoc(invoiceDocRef, {
      uid: uid,
      user: `${user().decodedString}`,
      timestamp: timestampCreacion,
      fechaCreacion: fechaCreacion.toISOString(),
      date: date,
      ...invoiceData,
    });
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
    const fechaCreacion = getHoraColombia();
    const timestampCreacion = Timestamp.fromDate(fechaCreacion);
    const invoicesCollectionRef = collection(establecimientoDocRef, "invoices");
    const invoiceDocRef = doc(invoicesCollectionRef, uid);

    await updateDoc(invoiceDocRef, { ...invoiceData, timestampCreacion });
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
// firebase/clients.ts
export const updateClient = async (id: string, data: any) => {
  const ref = doc(db, "establecimientos", user().decodedString, "clients", id);
  await setDoc(ref, data, { merge: true });
};


export const getClientById = async (id: string) => {
  try {
    const establecimientoDocRef: DocumentReference = doc(
      db,
      "establecimientos",
      `${user().decodedString}`
    );

    const clientDocRef = doc(establecimientoDocRef, "clients", id);
    const clientSnapshot: DocumentSnapshot = await getDoc(clientDocRef);

    if (clientSnapshot.exists()) {
      return clientSnapshot.data();
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error al consultar cliente por ID: ", error);
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


export const InvoiceNumber = async (): Promise<{
  lastNumber: string;
  nextNumber: string;
}> => {
  try {
    const establecimientoDocRef = doc(
      db,
      "establecimientos",
      user().decodedString
    );
    const invoiceCollectionRef = collection(establecimientoDocRef, "invoices");

    // Query: obtener solo facturas finales (no órdenes de cocina)
    const finalInvoicesQuery = query(
      invoiceCollectionRef,
      where("orden_preparada", "in", [null, false]), // 🔥 Solo facturas reales
      orderBy("fechaCreacion", "desc"),
      limit(1)
    );

    const snapshot = await getDocs(finalInvoicesQuery);

    if (!snapshot.empty) {
      const lastInvoice = snapshot.docs[0].data();
      const lastNumber = String(parseInt(lastInvoice.uid, 10)).padStart(7, "0");
      const nextNumber = String(parseInt(lastNumber, 10) + 1).padStart(7, "0");

      return { lastNumber, nextNumber };
    }

    return { lastNumber: "0000000", nextNumber: "0000001" };
  } catch (error) {
    console.error("❌ Error obteniendo número de factura:", error);
    return { lastNumber: "0000000", nextNumber: "0000001" };
  }
};


export const getNextInvoiceNumber = async (): Promise<{
  lastNumber: string;
  nextNumber: string;
}> => {
  try {
    const establecimientoDocRef = doc(
      db,
      "establecimientos",
      `${user().decodedString}`
    );
    const invoiceCollectionRef = collection(establecimientoDocRef, "invoices");

    // Paso 1: obtener las últimas N facturas (ej. 50)
    const recentInvoicesQuery = query(
      invoiceCollectionRef,
      orderBy("fechaCreacion", "desc"),
      limit(50)
    );

    const snapshot = await getDocs(recentInvoicesQuery);

    // Paso 2: filtrar excluyendo las que son "VENTA RAPIDA"
    const filteredInvoices = snapshot.docs
      .map(doc => doc.data())
      .filter(invoice => invoice.typeInvoice !== "VENTA RAPIDA");

    if (filteredInvoices.length > 0) {
      const lastInvoice = filteredInvoices[0]; // la más reciente válida
      const lastNumber = String(parseInt(lastInvoice.uid, 10)).padStart(7, "0");
      const nextNumber = String(parseInt(lastNumber, 10) + 1).padStart(7, "0");

      return {
        lastNumber,
        nextNumber,
      };
    } else {
      // No hay facturas válidas aún
      return {
        lastNumber: "0000000",
        nextNumber: "0000001",
      };
    }
  } catch (error) {
    console.error("Error al obtener números de factura: ", error);
    return {
      lastNumber: "0000000",
      nextNumber: "0000001",
    };
  }
};


export const fixInvoicesAddDate = async () => {
  try {
    const establecimientoDocRef = doc(db, "establecimientos", user().decodedString);
    const invoiceCollectionRef = collection(establecimientoDocRef, "invoices");

    const snapshot = await getDocs(invoiceCollectionRef);

    for (const d of snapshot.docs) {
      const data = d.data();
      if (!data.invoice) {
        const docRef = doc(db, "establecimientos", user().decodedString, "invoices", d.id);
        const now = new Date();
        const formattedDate = data.uid;

        await updateDoc(docRef, {
          invoice: formattedDate,
        });

        console.log(`✅ Documento ${d.id} actualizado con campo "date".`);
      }
    }

    console.log("Todos los documentos han sido procesados.");
  } catch (error) {
    console.error("❌ Error al actualizar facturas:", error);
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

    const unsubscribe = onSnapshot(orderedQuery, async (querySnapshot: any) => {
      const updatedInvoiceData = querySnapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const snapshot = await getDocs(invoiceCollectionRef);
      callback(updatedInvoiceData);
    });

    return unsubscribe;
  } catch (error) {
    console.error("Error setting up data observer: ", error);
    return null;
  }
};

export const getFilteredInvoicesData = async (
  timestampInicio: Timestamp,
  callback: any
) => {
  try {
    const establecimientoDocRef = doc(
      db,
      "establecimientos",
      `${user().decodedString}`
    );
    const invoiceCollectionRef = collection(establecimientoDocRef, "invoices");
    const fechaActualColombia = getHoraColombia();
    const timestampFin = Timestamp.fromDate(fechaActualColombia);
    const filteredQuery = query(
      invoiceCollectionRef,
      where("timestamp", ">=", timestampInicio),
      where("timestamp", "<=", timestampFin),
      orderBy("timestamp")
    );

    // Obtener los datos iniciales
    const initialQuerySnapshot = await getDocs(filteredQuery);
    const initialInvoiceData = initialQuerySnapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .sort(
        (a: any, b: any) =>
          b.timestamp.seconds - a.timestamp.seconds
      );


    callback(initialInvoiceData);

    const unsubscribe = onSnapshot(filteredQuery, (querySnapshot: any) => {
      const updatedInvoiceData = querySnapshot.docs
        .map((doc: any) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .sort(
          (
            a: { timestampCreacion: { seconds: number } },
            b: { timestampCreacion: { seconds: number } }
          ) => b.timestampCreacion.seconds - a.timestampCreacion.seconds
        );

      callback(updatedInvoiceData);
    });

    return unsubscribe;
  } catch (error) {
    console.error("Error setting up data observer: ", error);
    return null;
  }
};

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

export const openCaja = async (montoInicial: string, notas: string) => {
  try {
    const establecimientoDocRef = doc(
      db,
      "establecimientos",
      `${user().decodedString}`
    );
    const cajasCollectionRef = collection(establecimientoDocRef, "cajas");

    const fechaApertura = getHoraColombia();
    const timestampApertura = Timestamp.fromDate(fechaApertura);
    const sessionCajaID = timestampApertura.toMillis().toString();
    const cajaDocRef = doc(cajasCollectionRef, sessionCajaID);

    const dataToSave = {
      cajaAbierta: true,
      montoInicial: montoInicial,
      notasApertura: notas,
      fechaApertura: fechaApertura.toISOString(),
      timestampApertura: timestampApertura,
      cajaCerrada: false,
      montoFinal: null,
      notasCierre: null,
      fechaCierre: null,
      timestampCierre: null,
      uid: sessionCajaID,
      user: user().decodedString,
    };

    await setDoc(cajaDocRef, dataToSave);
    console.log(
      "Caja abierta correctamente con hora en Colombia:",
      sessionCajaID
    );
    return sessionCajaID;
  } catch (error) {
    console.error("Error al abrir la caja:", error);
    return null;
  }
};

export const closeCaja = async (
  sessionCajaID: string,
  resumen: {
    montoFinal: string;
    notasCierre: string;
    efectivo: number;
    transferencias: number;
    pendientes: number;
    devoluciones: number;
    totalCerrado: number;
    facturasUIDs: any;
  }
): Promise<{ success: boolean; consecutivo: number | null }> => {
  try {
    const establecimientoDocRef = doc(
      db,
      "establecimientos",
      `${user().decodedString}`
    );
    const cajasCollectionRef = collection(establecimientoDocRef, "cajas");

    const q = query(
      cajasCollectionRef,
      orderBy("consecutivo", "desc"),
      limit(1)
    );
    const snapshot = await getDocs(q);

    let nuevoConsecutivo = 1;
    if (!snapshot.empty) {
      const data = snapshot.docs[0].data();
      if (data.consecutivo != null) {
        nuevoConsecutivo = data.consecutivo + 1;
      }
    }

    const cajaDocRef = doc(cajasCollectionRef, sessionCajaID);
    const fechaCierre = new Date();

    const dataToUpdate = {
      cajaCerrada: true,
      montoFinal: resumen.montoFinal,
      notasCierre: resumen.notasCierre,
      fechaCierre: fechaCierre.toISOString(),
      timestampCierre: Timestamp.fromDate(fechaCierre),
      efectivo: resumen.efectivo,
      transferencias: resumen.transferencias,
      pendientes: resumen.pendientes,
      devoluciones: resumen.devoluciones,
      totalCerrado: resumen.totalCerrado,
      consecutivo: nuevoConsecutivo,
      facturasUIDs: resumen.facturasUIDs,
    };

    await updateDoc(cajaDocRef, dataToUpdate);
    console.log(`Caja cerrada correctamente. Consecutivo: ${nuevoConsecutivo}`);
    return { success: true, consecutivo: nuevoConsecutivo };
  } catch (error) {
    console.error("Error al cerrar la caja:", error);
    return { success: false, consecutivo: null };
  }
};

export const getAllCierresCaja = async () => {
  try {
    const establecimientoDocRef = doc(
      db,
      "establecimientos",
      `${user().decodedString}`
    );
    const cajasCollectionRef = collection(establecimientoDocRef, "cajas");

    const snapshot = await getDocs(cajasCollectionRef);
    const cierres = snapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .filter((caja: any) => caja.cajaCerrada);

    console.log("Cierres de caja obtenidos:", cierres);
    return cierres;
  } catch (error) {
    console.error("Error al obtener los cierres de caja:", error);
    return [];
  }
};

export const getUltimaCaja = async () => {
  try {
    const establecimientoDocRef = doc(
      db,
      "establecimientos",
      `${user().decodedString}`
    );
    const cajasCollectionRef = collection(establecimientoDocRef, "cajas");

    const q = query(
      cajasCollectionRef,
      where("cajaCerrada", "==", false),
      orderBy("timestampApertura", "desc"),
      limit(1)
    );

    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    }

    return null;
  } catch (error) {
    console.error("Error al obtener la última caja abierta:", error);
    return null;
  }
};

export const getUltimaCajaCerrada = async () => {
  try {
    const establecimientoDocRef = doc(
      db,
      "establecimientos",
      `${user().decodedString}`
    );
    const cajasCollectionRef = collection(establecimientoDocRef, "cajas");

    const q = query(
      cajasCollectionRef,
      where("cajaCerrada", "==", true),
      orderBy("timestampCierre", "desc"),
      limit(1)
    );

    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const ultimaCajaCerrada = snapshot.docs[0].data();
      console.log("Última caja cerrada obtenida:", ultimaCajaCerrada);
      return ultimaCajaCerrada;
    } else {
      console.log("No hay cajas cerradas registradas.");
      return null;
    }
  } catch (error) {
    console.error("Error al obtener la última caja cerrada:", error);
    return null;
  }
};

export const handleGuardarDevolucion = async (facturaData: any) => {
  try {
    const uid = facturaData.uid;
    console.log("🧾 Factura recibida para devolución:", facturaData);

    const devolucion = facturaData.Devolucion ?? [];

    let seRealizoCambio = false;

    const devolucionActualizada = await Promise.all(
      devolucion.map(async (producto: any) => {
        const cantidadRegistrada = producto.cantidad ?? 0;
        const cantidadYaGuardada = producto.devolucion_save ?? 0;

        // 🔍 Verificamos si hay diferencia que aplicar al inventario
        if (cantidadRegistrada <= cantidadYaGuardada) {
          return producto; // No hay cambio
        }

        const diferencia = cantidadRegistrada - cantidadYaGuardada;

        const productoDocRef = doc(
          db,
          "establecimientos",
          `${user().decodedString}`,
          "productos",
          producto.barCode
        );

        const snapshot = await getDoc(productoDocRef);

        if (snapshot.exists()) {
          const productoBD = snapshot.data();
          const nuevaCantidad = +(productoBD.cantidad ?? 0) + +(diferencia ?? 0);

          await updateDoc(productoDocRef, {
            cantidad: nuevaCantidad,
          });

          seRealizoCambio = true;

          return {
            ...producto,
            devolucion_save: cantidadRegistrada, // actualizamos el valor aplicado
          };
        } else {
          console.warn(`⚠️ Producto no encontrado: ${producto.barCode}`);
          return producto;
        }
      })
    );

    if (!seRealizoCambio) {
      console.warn("🔁 No se realizaron cambios en el inventario.");
      return;
    }

    // 🧾 Guardar la factura actualizada con la nueva `Devolucion`
    await updateInvoice(uid, {
      ...facturaData,
      Devolucion: devolucionActualizada,
    });

    console.log("✅ Devolución aplicada y factura actualizada correctamente.");
  } catch (error) {
    console.error("❌ Error al guardar la devolución:", error);
  }
};
