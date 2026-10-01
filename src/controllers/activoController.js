// Acceso a la BD //Anteriormente...
//mysql_connect(): sql
//poolConnection(): sql
//Ahora: knex (responsabilidad conexión) : orm 
const db = require("../database/db")

const obtenerActivos = async (req, res) => {
  try {
    const activos = await db("activos").select("*");
    return res.status(200).json({
      success: true,
      data: activos
    });
  } catch (error) {
    console.error(`Error al leer activos:`, error);
    return res
    .status(500)
    .json({ success: false, message: 'Error al obtener activos'})
  }
};

const obtenerActivoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const activo = await db("activos").where({ id }).first();

    if (!activo) {
      return res
      .status(404)
      .json({ success: false, message: 'No existe este activo'})
    }

    return res
    .status(200)
    .json({ success: true, data: activo});

  } catch (error) {
    console.log("No se pudo ejecutar la busqueda:", error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error interno en el servidor'
    });
  }
};

const crearActivo = async (req, res) => {
  try {
    const { idcategoria, descripcion, fotografia, estado, precio } = req.body;

    if (!idcategoria || !descripcion || !precio) {
      return res
      .status(400)
      .json({ success: false, message: 'Los campos idcategoria, descripcion y precio son obligatorios'})
    }

    const categoriaExiste = await db("categorias").where({ id: idcategoria }).first();
    if (!categoriaExiste) {
      return res.status(404).json({
        success: false,
        message: 'La categoría especificada no existe'
      })
    }

    const [id] = await db("activos").insert({
      idcategoria,
      descripcion,
      fotografia,
      estado,
      precio
    })

    return res.status(201).json({
      success: true,
      message: 'Activo creado correctamente',
      data: { id: idgenerado}
    })

  } catch (error) {
    console.error("Error al crear activo:", error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error al crear activo'
    })
  }
};

const actualizarActivo = async (req, res) => {
  try {
    const { id } = req.params;
    const { idcategoria, descripcion, fotografia, estado, precio } = req.body;

    // Construir objeto 
    const datosActualizar = {};
    if (idcategoria !== undefined) datosActualizar.idcategoria = idcategoria;
    
    if (descripcion !== undefined) datosActualizar.descripcion = descripcion;
    if (fotografia !== undefined) datosActualizar.fotografia = fotografia;
    if (estado !== undefined) datosActualizar.estado = estado;
    if (precio !== undefined) datosActualizar.precio = precio;

    const filasAfectadas = await db("activos").where({ id }).update(datosActualizar);

    if (!filasAfectadas) {
      return res.status(404).json({ 
        success: false, 
        message: 'El activo no existe' 
      });
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Activo actualizado correctamente' 
    });

  } catch (error) {
    console.error('No es posible actualizar:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'No es posible actualizar el activo' 
    });
  }
};

const eliminarActivo = async (req, res) => {
  try {
    const { id } = req.params;
    const filasAfectadas = await db("activos").where({ id }).del();

    if (!filasAfectadas) {
      return res.status(404).json({ 
        success: false, 
        message: 'No existe el activo' 
      });
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Activo eliminado correctamente' 
    });

  } catch (error) {
    console.error('No se pudo eliminar el activo:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'No se puede eliminar el activo' 
    });
  }
};

module.exports = {
  obtenerActivos,
  obtenerActivoPorId,
  crearActivo,
  actualizarActivo,
  eliminarActivo
};