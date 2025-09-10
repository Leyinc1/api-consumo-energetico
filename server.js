const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

// --- ESTADO INICIAL DEL SENSOR (AHORA ES UN OBJETO) ---
// Se cambió de una lista a un objeto simple para mayor claridad.
let dispositivo = {
    id: "SENSOR-01",
    value: 0
};

// --- LÓGICA DE SIMULACIÓN SIMPLE ---
// Actualiza directamente las propiedades del objeto 'dispositivo'.
setInterval(() => {
    const nuevoValor = Math.random() < 0.90 ? 1 : 0;
    
    dispositivo.value = nuevoValor;

    console.log("Estado del sensor actualizado:", new Date().toLocaleTimeString(), `-> Valor: ${nuevoValor}`);

}, 1000);

// --- RUTA DE LA API MODIFICADA ---
// Ahora crea la respuesta directamente desde el objeto 'dispositivo'.
app.get("/consumo", (request, response) => {
    
    // Se construye el objeto de respuesta directamente.
    const respuesta = {
        "codigo": dispositivo.id,
        "estado": dispositivo.value
    };

    // Se envía la respuesta. No es necesaria ninguna comprobación.
    response.json(respuesta);
});


// --- Ruta para la página principal ---
app.get("/", (request, response) => {
    response.send("¡API de simulación de sensor funcionando! Accede a /consumo para ver los datos.");
});

// --- Iniciamos el Servidor ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});

