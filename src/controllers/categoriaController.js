// Acceso a la BD //Anteriormente...
//mysql_connect(): sql
//poolConnection(): sql
//Ahora: knex (responsabilidad conexión) : orm 
const db = require("../database/db")

// En este archivo solo se crean métodos JS 
//NO se definen las rutas ni los verbos (GET-POST-PUT-DELETE)

//req (require)  :solicitud o pedido (input)
//res (result)   :resultado o respuesta (output)

const obtenerCategorias = async(req, res) =>{
  try{
    //Consulta > ORM
    const categorias = await db("categorias").select("*");
    return res.status(200).json({
      success: true,
      data: categorias
    });
  }catch(error){
    console.error(`Error al leer categorias:`, error); //Desarrollador (test) 
    return res
      .status(500)
      .json({ success: false, message: 'Error al obtener categorias' })
  }
};

const obtenerCategoriaPorId = async(req, res) =>{
  try{
    //La busqueda necesita el ID que pasa en la URL (parametro)
    const {id}= req.params;
    const categoria = await db("categorias").where({ id }).first();

    if (!categoria){
      return res
      .status(404)
      .json({ success: false, message: 'No existe esta categoria' })
    }

    return res
      .status(200)
      .json({ success: true, data: categoria })

  }catch(error){
    console.log("No se pudo ejecutar la busqueda:", error)
    return res
    .status(500)
    .json({ success: false, message: 'Error interno en el servidor'})
  }
};

const crearCategoria = async(req, res) =>{
   try{
    const { categoria } = req.body

    if (!categoria){
      return res
      .status(400)
      .json({ success : false, message: 'El campo categoria es obligatorio'})
    }

    const [id] = await db ("categorias").insert({ categoria })

    return res.status(201).json({
      success: true,
      message: 'Categoria creada correctamente',
      data: {id: idGenerado}
    })

  }catch(error){
    console.error("Error al crear categoria:", error)
    return res
    .status(500)
    .json({ success: false, message: 'Error al crear categoria'})
  }
};

const  actualizarCategoria= async(req, res) =>{
  try{
    //Obtener el ID de la URL (parametro)
    const {id} =req.params

    //Obtener los datos del JSON (cuerpo)
    const {categoria} = req.body

    if (!categoria){
      return res
      .status(400)
      .json({ success: false, message: 'El campo categoria es obligatorio'})
    }

    const filasAfectadas = await db("categorias").where(id).update({categoria})

    if(!filasAfectadas){
      return res
      .status(404)
      .json({ success:false, message: 'La categoria no existe'})
    }

    //Hemos pasado las validaciones..
    return res
      .status(200)
      .json({ success: false, message:'Categoria actualizada correctamente'})

  }catch(error){
    console.error('No es posible actualizar:', error)
    return res
      .status(500)
      .json({ success: false, message: 'No es posible actualizar categoria'})
  }
};

const  eliminarCategoria= async(req, res) =>{
  try{
    const {id} = req.params;
    const filasAfectadas = await db("categorias").where({id}).del();

    if (!filasAfectadas) {
      return res
        .status(404)
        .json({success: false, message: 'No existe la categoría'})
    }

    return res
      .status(200)
      .json({success: false, message: ''})

  }catch(error){
    console.error('No se pudo eliminar la categoria:', error)
    return res
      .status(500)
      .json({ success: false, message: 'No se puede eliminar categoria'})
  }
};

//Estas acciones deben ser de utilidad (necesarias) para las rutas
module.exports = {
  obtenerCategorias,
  obtenerCategoriaPorId,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria
}