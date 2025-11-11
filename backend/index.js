// --- Importaciones ---
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// --- Inicialización ---
const prisma = new PrismaClient();
const app = express();
const port = 3000; // El puerto donde correrá tu backend

// --- Middlewares ---
// Middleware para que nuestro backend entienda JSON
app.use(express.json());

// Middleware de CORS (¡MUY IMPORTANTE!)
// Esto permite que tu frontend (ej. login.html) hable con tu backend
const cors = require('cors');
app.use(cors());

// --- Endpoints (Rutas) ---

/**
 * Endpoint para CREAR un nuevo Rol.
 * Lo usaremos para poblar la base de datos manualmente.
 */
app.post('/api/roles', async (req, res) => {
  try {
    const { nombre } = req.body;
    if (!nombre) {
      return res.status(400).json({ error: 'El campo "nombre" es requerido' });
    }
    const nuevoRol = await prisma.rol.create({
      data: {
        nombre: nombre,
      },
    });
    res.status(201).json(nuevoRol);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear el rol' });
  }
});

/**
 * Endpoint para REGISTRO de un nuevo usuario.
 */
app.post('/api/registro', async (req, res) => {
  try {
    // 1. Obtener TODOS los datos del body
    const { 
      cedula, 
      email, 
      password, 
      primer_nombre, 
      segundo_nombre, 
      primer_apellido, 
      segundo_apellido, 
      fecha_nacimiento 
    } = req.body;

    // 2. Validar que los datos OBLIGATORIOS llegaron
    if (!cedula || !email || !password || !primer_nombre || !primer_apellido) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    // 3. Encriptar la contraseña
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // 4. Asignar el rol de "USUARIO_GENERAL" (asumimos id: 3)
    const idRolUsuarioGeneral = 3;

    // 5. Crear el usuario en la base de datos
    const nuevoUsuario = await prisma.usuario.create({
      data: {
        cedula: cedula,
        email: email,
        password_hash: password_hash,
        primer_nombre: primer_nombre,
        segundo_nombre: segundo_nombre,       // Prisma maneja bien si esto es null
        primer_apellido: primer_apellido,
        segundo_apellido: segundo_apellido,     // Prisma maneja bien si esto es null
        fecha_nacimiento: fecha_nacimiento ? new Date(fecha_nacimiento) : null, // Convierte la fecha
        id_rol: idRolUsuarioGeneral
        // nota: foto_perfil_url se deja vacío por ahora
      }
    });

    // 6. Enviar respuesta exitosa (sin el password_hash)
    res.status(201).json({
      id: nuevoUsuario.id,
      email: nuevoUsuario.email,
      primer_nombre: nuevoUsuario.primer_nombre
    });

  } catch (error) {
    // Manejar error de email o cédula duplicada
    if (error.code === 'P2002') {
      const target = error.meta?.target || [];
      if (target.includes('email')) {
        return res.status(400).json({ error: 'Este correo electrónico ya está registrado' });
      }
      if (target.includes('cedula')) {
        return res.status(400).json({ error: 'Esta cédula ya está registrada' });
      }
    }
    
    // Otro error
    console.error(error); // Imprime el error en la consola del servidor
    res.status(500).json({ error: 'Error al registrar el usuario' });
  }
});
/**
 * Endpoint para INICIO DE SESIÓN (LOGIN)
 * Acepta email o cédula en el campo 'usuario'
 */
app.post('/api/login', async (req, res) => {
  try {
    // 1. Obtener 'usuario' y 'password'
    const { usuario, password } = req.body;

    if (!usuario || !password) {
      return res.status(400).json({ error: 'El usuario y la contraseña son requeridos' });
    }

    // 2. Determinar si es email o cédula y buscar en la BD
    let usuarioEncontrado;

    if (usuario.includes('@')) {
      // Es un email
      usuarioEncontrado = await prisma.usuario.findUnique({
        where: { email: usuario },
        include: { rol: true } // Traemos el rol
      });
    } else {
      // Es una cédula
      usuarioEncontrado = await prisma.usuario.findUnique({
        where: { cedula: usuario },
        include: { rol: true } // Traemos el rol
      });
    }

    // 3. Si el usuario no existe...
    if (!usuarioEncontrado) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    // 4. Comparar la contraseña
    const esPasswordCorrecto = await bcrypt.compare(password, usuarioEncontrado.password_hash);

    if (!esPasswordCorrecto) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    // 5. ¡ÉXITO! Generar Token (JWT)
    const payload = {
      id: usuarioEncontrado.id,
      email: usuarioEncontrado.email,
      rol: usuarioEncontrado.rol.nombre
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1d' // El token expirará en 1 día
    });

    // 6. Enviar el token al frontend
    res.status(200).json({
      mensaje: 'Inicio de sesión exitoso',
      token: token,
      usuario: {
        id: usuarioEncontrado.id,
        nombre: usuarioEncontrado.primer_nombre,
        rol: usuarioEncontrado.rol.nombre
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en el inicio de sesión' });
  }
});

// --- Iniciar el servidor ---
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

