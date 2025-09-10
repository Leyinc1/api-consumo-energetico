const express = require("express");
const cors = require("cors");
const crypto = require('crypto'); // Usamos el módulo nativo de Node.js

const app = express();
app.use(cors());

// --- 1. ESTADO INICIAL DEL SENSOR ---
// Ahora solo tenemos un dispositivo para simular un único sensor.
let dispositivos = [
    { id: "SENSOR-01", value: 1 }
];

// --- 2. LÓGICA DE SIMULACIÓN SIMPLE ---
// Esta función se ejecutará cada segundo para actualizar el estado del sensor.
setInterval(() => {
    // Simulación para un único sensor.
    // Tiene un 98% de probabilidad de estar encendido (1) y un 2% de apagarse.
    // Esto simula una conexión estable con fallos o reinicios ocasionales.
    const nuevoValor = Math.random() < 0.98 ? 1 : 0;
    
    // Actualizamos el único dispositivo en el array
    if (dispositivos.length > 0) {
        dispositivos[0].value = nuevoValor;
    }

    console.log("Estado del sensor actualizado:", new Date().toLocaleTimeString(), `-> Valor: ${nuevoValor}`);

}, 1000); // Se ejecuta cada 1000 ms = 1 segundo

// --- 3. RUTA DE LA API ---
// Devuelve el estado del sensor con el formato solicitado.
app.get("/consumo", (request, response) => {
    const ahora = new Date().toISOString();

    // Mapeamos el estado interno al formato de respuesta deseado
    const respuestaFormateada = dispositivos.map(device => ({
        "LogID": crypto.randomUUID(), // Generamos un ID único para cada log con el módulo crypto
        "device": {
             "DeviceID": device.id // Asociamos al ID del dispositivo
        },
        "timestamp": ahora,
        "value": device.value
    }));

    response.json(respuestaFormateada);
});


// --- Ruta para la página principal (sin cambios) ---
app.get("/", (request, response) => {
    response.send("¡API de simulación de sensor funcionando! Accede a /consumo para ver los datos.");
});

// --- Iniciamos el Servidor (sin cambios) ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});

