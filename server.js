// ===============================================
// ======== Contenido para el archivo server.js ========
// ===============================================

// Importamos las librerías necesarias
const express = require("express");
const cors = require("cors"); // Muy importante para que SAP Build Apps pueda conectarse

// Creamos nuestra aplicación de servidor
const app = express();

// Habilitamos CORS para permitir peticiones desde cualquier origen
app.use(cors());

// --- Nuestra Lógica de Simulación ---
// Esta es la función que genera los datos falsos pero realistas.
function generarDatosDeConsumo() {
  const electrodomesticos = [
    { id: "NEV-001", nombre: "Refrigeradora", base: 150, variacion: 30, siempreEncendido: true },
    { id: "TV-LIV-001", nombre: "Televisor (Living)", base: 80, variacion: 20 },
    { id: "MICRO-01", nombre: "Microondas", base: 1200, variacion: 50 },
    { id: "LAP-WRK-01", nombre: "Laptop (Cargando)", base: 60, variacion: 10 },
    { id: "AC-DORM-01", nombre: "Aire Acondicionado", base: 1500, variacion: 200 }
  ];

  const datosSimulados = electrodomesticos.map(item => {
    let consumoActual = 0;
    
    // Simula que algunos aparatos no siempre están encendidos
    const estaEncendido = item.siempreEncendido || Math.random() > 0.5;

    if (estaEncendido) {
      // Calcula un consumo base + una variación aleatoria
      consumoActual = item.base + (Math.random() * item.variacion - (item.variacion / 2));
    }

    return {
      id: item.id,
      electrodomestico: item.nombre,
      consumo_watts: Math.round(consumoActual),
      timestamp: new Date().toISOString()
    };
  });

  return datosSimulados;
}

// --- Ruta para la página principal (Opcional, pero útil) ---
// Muestra un mensaje de bienvenida en la URL raíz para no ver un error.
app.get("/", (request, response) => {
  response.send("¡API de simulación de consumo energético funcionando! Accede a /consumo para ver los datos.");
});


// --- Definimos la Ruta principal de Nuestra API ---
// Cuando se acceda a "/consumo", se ejecutarán estas instrucciones.
app.get("/consumo", (request, response) => {
  const datos = generarDatosDeConsumo();
  response.json(datos);
});

// --- Iniciamos el Servidor ---
// Render nos dará el puerto a través de una variable de entorno.
// Usamos process.env.PORT || 3000 para que funcione tanto en Render como en local.
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
