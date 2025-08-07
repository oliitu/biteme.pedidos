import { useEffect, useState } from "react";
import { doc, getDoc, collection, getDocs, deleteDoc, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";
import PedidosList from "./components/PedidosList";

function App() {
  const [ruta, setRuta] = useState("");
  const [totales, setTotales] = useState({
    agus: { efectivo: 0, mercado_pago: 0 },
    oli: { efectivo: 0, mercado_pago: 0 },
    guada: { efectivo: 0, mercado_pago: 0 },
  });

  // Obtener la ruta (como ya lo tenías)
  useEffect(() => {
    const fetchRuta = async () => {
      try {
        const docRef = doc(db, "misrutas", "2");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setRuta(data.title);
        } else {
          console.log("No se encontró el documento con ID 2");
        }
      } catch (error) {
        console.error("Error al obtener la ruta:", error);
      }
    };

    fetchRuta();
  }, []);

  // Escuchar en tiempo real los totales
  useEffect(() => {
    const chicas = ["agus", "oli", "guada"];
    const unsubscribes = chicas.map((chica) => {
      const ref = doc(db, "totalesPorChica", chica);
      return onSnapshot(ref, (docSnap) => {
        if (docSnap.exists()) {
          setTotales((prev) => ({
            ...prev,
            [chica]: docSnap.data(),
          }));
        }
      });
    });

    // Limpieza de listeners
    return () => unsubscribes.forEach((unsub) => unsub());
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
      ></a>

      <h1 className="text-3xl lg:text-5xl font-bold text-center mt-5 py-6">
        Pedidos
      </h1>

      {/* Totales por chica */}
     <div className="flex flex-col sm:flex-row sm:justify-center items-center gap-4 my-4">
  {Object.entries(totales).map(([nombre, { efectivo, mercado_pago }]) => (
    <div
      key={nombre}
      className="bg-amber-100 rounded-lg px-4 py-2 shadow-md w-64 text-center"
    >
      <h2 className="font-bold text-lg capitalize">{nombre}</h2>
      <p>Efectivo: ${(efectivo ?? 0).toFixed(2)}</p>
      <p>MercadoPago: ${(mercado_pago ?? 0).toFixed(2)}</p>
    </div>
  ))}
</div>


      

      <PedidosList />
      <div className="flex justify-center my-4"><button
        onClick={eliminarTodosLosPedidos}
        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded mb-4"
      >
        Eliminar todos los pedidos
      </button></div>
      
    </div>
  );
}

export default App;
