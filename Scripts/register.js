// Espera a que todo el HTML esté cargado
document.addEventListener('DOMContentLoaded', () => {

  // 1. Encuentra el formulario y el div de error
  const registerForm = document.getElementById('register-form');
  const errorMessage = document.getElementById('error-message');

  // 2. Escucha el evento "submit" del formulario
  registerForm.addEventListener('submit', async (e) => {
    // 3. Previene que el formulario se envíe de la forma tradicional
    e.preventDefault();
    
    // Oculta/Limpia errores anteriores
    errorMessage.style.display = 'none';
    errorMessage.textContent = '';

    // 4. Obtiene los valores de todos los inputs (Usando TUS IDs)
    const cedula = document.getElementById('cedula').value;
    const email = document.getElementById('email').value;
    const primer_nombre_val = document.getElementById('nombre1').value; // <--- Corregido
    const segundo_nombre_val = document.getElementById('nombre2').value; // <--- Corregido
    const primer_apellido_val = document.getElementById('apellido1').value; // <--- Corregido
    const segundo_apellido_val = document.getElementById('apellido2').value; // <--- Corregido
    const fecha_nacimiento = document.getElementById('fecha_nacimiento').value;
    const password = document.getElementById('password').value;
    const confirmar_password = document.getElementById('confirmar').value; // <--- Corregido

    // 5. Validación en el Frontend
    if (password !== confirmar_password) {
      errorMessage.textContent = 'Las contraseñas no coinciden';
      errorMessage.style.display = 'block'; // Muestra el error
      return; // Detiene la ejecución
    }

    // 6. Crea el objeto (body) que enviaremos a la API (Usando las llaves del BACKEND)
    const body = {
      cedula: cedula,
      email: email,
      password: password,
      primer_nombre: primer_nombre_val,     // <-- Traducido
      segundo_nombre: segundo_nombre_val,   // <-- Traducido
      primer_apellido: primer_apellido_val, // <-- Traducido
      segundo_apellido: segundo_apellido_val, // <-- Traducido
      fecha_nacimiento: fecha_nacimiento
    };

    // 7. Usa fetch para enviar la petición a tu API
    try {
      const response = await fetch('http://localhost:3000/api/registro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (response.ok) {
        // ¡Éxito!
        alert('¡Registro exitoso! Serás redirigido a la página de inicio de sesión.');
        window.location.href = 'login.html'; 
      } else {
        // Muestra el error que vino del backend
        errorMessage.textContent = data.error; // Ej: "Este correo electrónico ya está registrado"
        errorMessage.style.display = 'block'; // Muestra el error
      }

    } catch (error) {
      // Error de red (ej: el servidor está caído)
      console.error('Error de conexión:', error);
      errorMessage.textContent = 'No se pudo conectar con el servidor. Intenta más tarde.';
      errorMessage.style.display = 'block'; // Muestra el error
    }
  });
});