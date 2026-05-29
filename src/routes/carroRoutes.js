const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const carroController = require('../controllers/carroController');

// Configuración de almacenamiento de Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        // Renombrar archivo para evitar duplicados: id_tiempo.extension
        const uniqueSuffix = Date.now() + path.extname(file.originalname);
        cb(null, 'carro_' + uniqueSuffix);
    }
});

// Validación del tipo de archivo (Solo imágenes)
const fileFilter = (req, file, cb) => {
    const tiposPermitidos = /jpeg|jpg|png/;
    const mimetype = tiposPermitidos.test(file.mimetype);
    const extname = tiposPermitidos.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
        return cb(null, true);
    }
    cb(new Error('Tipo de archivo no válido. Solo se permiten imágenes (JPG, JPEG, PNG).'));
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter
});

// Mapeo de Endpoints del CRUD
router.get('/carros', carroController.listarCarros);
router.post('/carros', upload.single('foto'), carroController.crearCarro);
router.get('/carros/:id', carroController.obtenerCarro);
router.put('/carros/:id', upload.single('foto'), carroController.actualizarCarro);
router.delete('/carros/:id', carroController.eliminarCarro);

module.exports = router;