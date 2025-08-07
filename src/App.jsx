import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import PedidosList from "./components/PedidosList";
import { collection, getDocs, deleteDoc } from "firebase/firestore";


function App() {
  
  const [ruta, setRuta] = useState("");

  useEffect(() => {
    const fetchRuta = async () => {
      try {
        const docRef = doc(db, "misrutas", "2"); 
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setRuta(data.title); 
        } else {
          console.log("No se encontró el documento con ID 1");
        }
      } catch (error) {
        console.error("Error al obtener la ruta:", error);
      }
    };

    fetchRuta();
  }, []);
const eliminarTodosLosPedidos = async () => {
  const confirmacion = window.confirm("¿Estás seguro de que querés eliminar todos los pedidos?");
  if (!confirmacion) return;

  try {
    const pedidosRef = collection(db, "pedidos");
    const snapshot = await getDocs(pedidosRef);

    const eliminaciones = snapshot.docs.map((docSnap) =>
      deleteDoc(doc(db, "pedidos", docSnap.id))
    );

    await Promise.all(eliminaciones);

    alert("Todos los pedidos fueron eliminados.");
  } catch (error) {
    console.error("Error eliminando pedidos:", error);
    alert("Hubo un error al eliminar los pedidos.");
  }
};

  return (
    <div className="min-h-screen">
      <a
        href={ruta || "#"}
        className="hover:bg-yellow-950 bg-amber-900 text-white px-4 py-4 rounded-full"
      >
        
      </a>

      <h1 className="text-3xl lg:text-5xl font-bold text-center mt-5 py-6">
        Pedidos
      </h1>
      <button
  onClick={eliminarTodosLosPedidos}
  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded mb-4"
>
  Eliminar todos los pedidos
</button>

      <PedidosList />
    </div>
  );
}

export default App;
