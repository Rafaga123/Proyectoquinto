$(document).ready(function() {
            // Inicializar dropdowns
            $('.ui.dropdown').dropdown();
            
            // Controlar sidebar en móviles
            $('#sidebar-toggle').click(function() {
                $('.ui.sidebar').sidebar('toggle');
            });
            
            // Hacer que las tarjetas sean clickeables
            $('.link-card').click(function() {
                const button = $(this).find('.button');
                if (button.length) {
                    // Simular clic en el botón (en una aplicación real, esto redirigiría)
                    button.addClass('loading');
                    setTimeout(() => {
                        button.removeClass('loading');
                        // Aquí iría la redirección real
                        window.location.href = '../Pages/gestion_habitantes.html';
                    }, 800);
                }
            });
            
            // Para pantallas grandes, mostrar sidebar como fijo
            if ($(window).width() > 768) {
                $('.ui.sidebar').addClass('visible');
                $('.ui.sidebar').sidebar({
                    context: $('.pusher'),
                    transition: 'overlay'
                });
            }
        });