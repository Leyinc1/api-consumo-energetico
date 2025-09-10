const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

// --- 1. ESTADO INICIAL Y PERSISTENTE DE LOS ELECTRODOMÉSTICOS ---
// Esta variable vive fuera de las peticiones. Guarda el estado actual.
// Se ha eliminado el campo "nombre".
let estadoActualElectrodomesticos = [
  { id: "NEV-001", consumo_watts: 160, timestamp: new Date().toISOString() },
  { id: "TV-LIV-001", consumo_watts: 85, timestamp: new Date().toISOString() },
  { id: "MICRO-01", consumo_watts: 0, timestamp: new Date().toISOString() }, // Empieza apagado
  { id: "LAP-WRK-01", consumo_watts: 65, timestamp: new Date().toISOString() },
  { id: "AC-DORM-01", consumo_watts: 1500, timestamp: new Date().toISOString() }
];

// --- 2. LA RUTA DE LA API AHORA ES MÁS SIMPLE ---
// Simplemente devuelve el estado actual que tenemos guardado en la variable.
app.get("/consumo", (request, response) => {
  response.json(estadoActualElectrodomesticos);
});

// --- 3. LÓGICA DE ACTUALIZACIÓN EN SEGUNDO PLANO ---
// Esta función se ejecutará cada 10 segundos para actualizar los valores.
setInterval(() => {
  console.log("Actualizando valores de consumo..."); // Esto aparecerá en los logs de Render

  estadoActualElectrodomesticos = estadoActualElectrodomesticos.map(item => {
    // No cambiamos el consumo de aparatos que están apagados (consumo 0)
    if (item.consumo_watts === 0) {
      return item;
    }

    // Genera un número aleatorio entre -5 y +5
    const fluctuacion = (Math.random() * 10) - 5;
    
    // Calcula el nuevo consumo, asegurándose de que no sea menor que cero
    const nuevoConsumo = Math.max(0, item.consumo_watts + fluctuacion);

    return {
      ...item, // Mantiene las propiedades existentes (como el id)
      consumo_watts: Math.round(nuevoConsumo), // Actualiza el consumo con el nuevo valor redondeado
      timestamp: new Date().toISOString() // Actualiza la fecha y hora
    };
  });
}, 10000); // 10000 milisegundos = 10 segundos


// --- Ruta para la página principal (sin cambios) ---
app.get("/", (request, response) => {
  response.send("¡API de simulación de consumo energético funcionando! Accede a /consumo para ver los datos.");
});

// --- Iniciamos el Servidor (sin cambios) ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
