document.addEventListener('DOMContentLoaded', function() { //Ejecuta la acción una vez esté completamente cargado el DOM
    
    //SIDEBAR 

    //Seleccion los elementos por su clase
    const sidebar = document.querySelector('.ui.left.vertical.inverted.sidebar.labeled.icon.menu');
    const pusher = document.querySelector('.pusher');

    //Seleccionamos todos los botones de alternancia (el del menú superior y el del sidebar)
    const toggleButtons = document.querySelectorAll('.sidebar-toggle-btn');
    
    //Funcion para manejar los eventos (click)
    function toggleSidebar() {
        // Simula la función .sidebar('toggle')
        // Al usar .classList.toggle(), se añade la clase si no existe, o se elimina si existe.
        
        // El sidebar se muestra u oculta (clase 'visible')
        sidebar.classList.toggle('visible'); 
        
        //Empuja el contenido principal se "empuja" o vuelve a su posición original (clase 'pushed')
        pusher.classList.toggle('pushed'); 
        
        //El body se atenúa cuando el sidebar está visible
        document.body.classList.toggle('dimmed'); 
    }
    
    // Asigna la función 'toggleSidebar' a todos los botones que tienen la clase
    toggleButtons.forEach(button => {
        button.addEventListener('click', toggleSidebar); //Ejecuta la funcion toggleSidebar al hacer click
    });

    // INICIALIZACIÓN DEL CARRUSEL DE ANUNCIOS
    $('.announcement-carousel').slick({
        centerMode: true,           // Centra el slide activo
        centerPadding: '10px',      // Un pequeño padding si lo deseas
        slidesToShow: 3,            // Muestra 3 slides (el central y los laterales)
        infinite: true,             // Permite el desplazamiento infinito
        dots: true,                 // Muestra los puntos de navegación inferiores
        arrows: true,               // Muestra las flechas de navegación
        autoplay: true,             // Opcional: auto-reproducción
        autoplaySpeed: 5000,        // Tiempo de espera
        
        // RESPONSIVIDAD: Adaptación para diferentes tamaños de pantalla
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3
                }
            },
            {
                breakpoint: 768, // Para tablets
                settings: {
                    slidesToShow: 1, // En móviles/tablets pequeñas, solo muestra 1
                    centerMode: true
                }
            }
        ]
    });

});