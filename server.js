const express = require("express");
const cors = require("cors");
const crypto = require('crypto'); // Usamos el módulo nativo de Node.js

const app = express();
app.use(cors());

// --- 1. ESTADO INICIAL DE LOS DISPOSITIVOS ---
// Cada dispositivo ahora tiene un 'id' y un 'estado' (0 o 1).
// También añadimos una lógica de simulación personalizada para cada uno.
let dispositivos = [
    { id: "NEV-001", value: 1 },    // Nevera
    { id: "TV-LIV-001", value: 0 }, // Televisor
    { id: "MICRO-01", value: 0 },   // Microondas
    { id: "LAP-WRK-01", value: 0 }, // Laptop
    { id: "AC-DORM-01", value: 0 }  // Aire Acondicionado
];

// --- 2. LÓGICA DE SIMULACIÓN AVANZADA ---
// Esta función se ejecutará cada segundo para dar una sensación más realista.
setInterval(() => {
    const ahora = new Date();
    const hora = ahora.getHours(); // Hora del día (0-23)
    const dia = ahora.getDay();   // Día de la semana (0=Domingo, 6=Sábado)

    dispositivos = dispositivos.map(device => {
        let nuevoValor = device.value;

        switch (device.id) {
            // La nevera tiene un 95% de probabilidad de estar encendida (compresor funcionando)
            case "NEV-001":
                nuevoValor = Math.random() < 0.95 ? 1 : 0;
                break;

            // El televisor es más probable que se encienda entre las 6 PM y las 11 PM.
            case "TV-LIV-001":
                if (hora >= 18 && hora <= 23) {
                    nuevoValor = Math.random() < 0.75 ? 1 : 0; // 75% de probabilidad en la noche
                } else {
                    nuevoValor = Math.random() < 0.05 ? 1 : 0; // 5% de probabilidad el resto del día
                }
                break;

            // El microondas se enciende en ráfagas cortas e infrecuentes.
            case "MICRO-01":
                // Si está encendido, hay un 50% de probabilidad de que se apague.
                if (device.value === 1) {
                    nuevoValor = Math.random() < 0.5 ? 0 : 1;
                } else {
                    // Si está apagado, solo hay un 2% de probabilidad de que se encienda.
                    nuevoValor = Math.random() < 0.02 ? 1 : 0;
                }
                break;

            // La laptop es más probable que esté encendida en horario laboral (L-V, 9am-6pm).
            case "LAP-WRK-01":
                const esHorarioLaboral = dia >= 1 && dia <= 5 && hora >= 9 && hora < 18;
                if (esHorarioLaboral) {
                    nuevoValor = Math.random() < 0.90 ? 1 : 0; // 90% en horario laboral
                } else {
                    nuevoValor = Math.random() < 0.15 ? 1 : 0; // 15% fuera de horario
                }
                break;

            // El AC es más probable que se encienda durante la noche.
            case "AC-DORM-01":
                if (hora >= 22 || hora <= 6) {
                    nuevoValor = Math.random() < 0.70 ? 1 : 0; // 70% en la noche
                } else {
                    nuevoValor = Math.random() < 0.05 ? 1 : 0; // 5% durante el día
                }
                break;
        }

        return { ...device, value: nuevoValor };
    });

    console.log("Estado de dispositivos actualizado:", new Date().toLocaleTimeString());

}, 1000); // Se ejecuta cada 1000 ms = 1 segundo

// --- 3. RUTA DE LA API ---
// Devuelve la lista de dispositivos con el formato solicitado.
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
    response.send("¡API de simulación de encendido/apagado funcionando! Accede a /consumo para ver los datos.");
});

// --- Iniciamos el Servidor (sin cambios) ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});

