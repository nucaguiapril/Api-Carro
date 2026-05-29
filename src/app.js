const express = require('express');
const path = require('path');
const carroRoutes = require('./routes/carroRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares para entender JSON y formularios normales
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Hacer pública la carpeta de descargas para ver las fotos en el navegador
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Rutas de la API
app.use('/api', carroRoutes);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});