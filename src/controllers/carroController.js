const fs = require('fs');
const path = require('path');

// Base de datos simulada en memoria
let carros = [
    {
        id: "1",
        placas: "DSB-123-A",
        serie: "1HGCR2F8XHA",
        color: "Rojo",
        foto: "uploads/carro_ejemplo.jpg"
    }
];

// 1. LISTAR CARROS (GET /api/carros)
const listarCarros = (req, res) => {
    res.status(200).json(carros);
};

// 2. CREAR CARRO (POST /api/carros)
const crearCarro = (req, res) => {
    const { placas, serie, color } = req.body;
    
    // Validación de campos obligatorios
    if (!placas || !serie) {
        // Si se subió una foto pero falló otra validación, la borramos para no acumular basura
        if (req.file) fs.unlinkSync(req.file.path); 
        
        return res.status(400).json({
            ok: false,
            error: "Datos inválidos. Las 'placas' y la 'serie' son obligatorias."
        });
    }

    // Guardar la ruta de la foto si existe
    const fotoPath = req.file ? req.file.path : null;

    const nuevoCarro = {
        id: String(carros.length + 1),
        placas,
        serie,
        color: color || "No especificado",
        foto: fotoPath
    };

    carros.push(nuevoCarro);

    res.status(201).json({
        ok: true,
        mensaje: "Carro creado correctamente"
    });
};

// 3. OBTENER UN CARRO ESPECÍFICO (GET /api/carros/:id)
const obtenerCarro = (req, res) => {
    const { id } = req.params;
    const carro = carros.find(c => c.id === id);

    if (!carro) {
        return res.status(404).json({
            ok: false,
            error: "El carro con el ID especificado no existe."
        });
    }

    res.status(200).json(carro);
};

// 4. ACTUALIZAR CARRO (PUT /api/carros/:id)
const actualizarCarro = (req, res) => {
    const { id } = req.params;
    const { placas, serie, color } = req.body;

    const carroIndex = carros.findIndex(c => c.id === id);

    // Validación de existencia
    if (carroIndex === -1) {
        if (req.file) fs.unlinkSync(req.file.path);
        return res.status(404).json({
            ok: false,
            error: "No se puede actualizar. Registro no encontrado."
        });
    }

    // Actualizar campos si vienen en la petición, si no conservar los anteriores
    if (placas) carros[carroIndex].placas = placas;
    if (serie) carros[carroIndex].serie = serie;
    if (color) carros[carroIndex].color = color;

    // Si se sube una nueva foto, reemplazamos la anterior
    if (req.file) {
        // Borrar foto vieja si existía
        if (carros[carroIndex].foto && fs.existsSync(carros[carroIndex].foto)) {
            fs.unlinkSync(carros[carroIndex].foto);
        }
        carros[carroIndex].foto = req.file.path;
    }

    res.status(200).json({
        ok: true,
        mensaje: "Carro actualizado correctamente"
    });
};

// 5. ELIMINAR CARRO (DELETE /api/carros/:id)
const eliminarCarro = (req, res) => {
    const { id } = req.params;
    const carroIndex = carros.findIndex(c => c.id === id);

    // Validación de existencia
    if (carroIndex === -1) {
        return res.status(404).json({
            ok: false,
            error: "No se puede eliminar. Registro no encontrado."
        });
    }

    // Borrar la foto del servidor antes de quitar el registro del array
    const fotoPath = carros[carroIndex].foto;
    if (fotoPath && fs.existsSync(fotoPath)) {
        fs.unlinkSync(fotoPath);
    }

    // Eliminar del array
    carros.splice(carroIndex, 1);

    res.status(200).json({
        ok: true,
        mensaje: "Carro eliminado correctamente"
    });
};

module.exports = {
    listarCarros,
    crearCarro,
    obtenerCarro,
    actualizarCarro,
    eliminarCarro
};