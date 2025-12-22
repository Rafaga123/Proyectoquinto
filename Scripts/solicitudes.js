// Datos de ejemplo (simulando base de datos)
        let solicitudes = [
            {
                id: 1,
                titulo: "Fuga de agua en el baño del 3er piso",
                contenido: "Hay una fuga constante de agua en el baño del tercer piso, al lado de la escalera de emergencia. El agua está goteando desde hace 2 días y ya está causando humedad en la pared.",
                categoria: "mantenimiento",
                estado: "pendiente",
                fecha: "2025-03-15",
                habitante: "María González",
                apartamento: "3A",
                prioridad: "alta",
                revisado: false
            },
            {
                id: 2,
                titulo: "Ruido excesivo en las noches",
                contenido: "El apartamento 4B tiene música muy alta todas las noches después de las 11 PM, lo que afecta el descanso de los vecinos. Esta situación lleva ocurriendo por una semana.",
                categoria: "ruido",
                estado: "revision",
                fecha: "2025-03-14",
                habitante: "Carlos López",
                apartamento: "2C",
                prioridad: "media",
                revisado: true
            },
            {
                id: 3,
                titulo: "Basura en el área común",
                contenido: "La zona de reciclaje está llena y la basura se está acumulando fuera de los contenedores. Hace falta que el personal de limpieza pase más frecuentemente.",
                categoria: "limpieza",
                estado: "resuelta",
                fecha: "2025-03-10",
                habitante: "Ana Martínez",
                apartamento: "1B",
                prioridad: "media",
                revisado: true
            },
            {
                id: 4,
                titulo: "Luz del pasillo principal no funciona",
                contenido: "La lámpara del pasillo principal del edificio A lleva 3 días sin funcionar. Esto representa un riesgo de seguridad, especialmente en la noche.",
                categoria: "seguridad",
                estado: "pendiente",
                fecha: "2025-03-16",
                habitante: "Javier Rodríguez",
                apartamento: "5D",
                prioridad: "alta",
                revisado: false
            },
            {
                id: 5,
                titulo: "Ascensor con ruidos extraños",
                contenido: "El ascensor del edificio B hace ruidos extraños al subir y bajar. Parece que necesita mantenimiento preventivo.",
                categoria: "mantenimiento",
                estado: "revision",
                fecha: "2025-03-13",
                habitante: "Laura Pérez",
                apartamento: "6A",
                prioridad: "alta",
                revisado: true
            },
            {
                id: 6,
                titulo: "Mascota sin correa en áreas comunes",
                contenido: "Un residente del apartamento 2D lleva su perro grande sin correa por las áreas comunes, lo que puede ser peligroso para niños y otros residentes.",
                categoria: "seguridad",
                estado: "rechazada",
                fecha: "2025-03-08",
                habitante: "Diego Hernández",
                apartamento: "3C",
                prioridad: "media",
                revisado: true
            }
        ];

        let currentFilters = {
            estado: 'all',
            categoria: 'all',
            fecha: 'all'
        };

        $(document).ready(function() {
            // Inicializar componentes
            $('.ui.dropdown').dropdown();
            $('#request-details-modal').modal();
            
            // Cargar solicitudes
            loadRequests();
            
            // Control del sidebar
            $('#sidebar-toggle').click(function() {
                $('.ui.sidebar').sidebar('toggle');
            });

            //fijar sidebar
            if ($(window).width() > 768) {
                $('.ui.sidebar').addClass('hide');
                $('.ui.sidebar').sidebar({
                    context: $('.pusher'),
                    transition: 'overlay'
                });
            }
            
            // Filtros
            $('#status-filter').change(function() {
                currentFilters.estado = $(this).val();
                loadRequests();
            });
            
            $('#category-filter').change(function() {
                currentFilters.categoria = $(this).val();
                loadRequests();
            });
            
            $('#date-filter').change(function() {
                currentFilters.fecha = $(this).val();
                loadRequests();
            });
            
            $('#reset-filters').click(function() {
                $('#status-filter').dropdown('restore defaults');
                $('#category-filter').dropdown('restore defaults');
                $('#date-filter').dropdown('restore defaults');
                currentFilters = { estado: 'all', categoria: 'all', fecha: 'all' };
                loadRequests();
            });
            
            // Marcar todas como revisadas
            $('#mark-all-reviewed').click(function() {
                if (confirm('¿Marcar todas las solicitudes pendientes como revisadas?')) {
                    solicitudes.forEach(solicitud => {
                        if (!solicitud.revisado && solicitud.estado === 'pendiente') {
                            solicitud.revisado = true;
                            solicitud.estado = 'revision';
                        }
                    });
                    loadRequests();
                    showAlert('Todas las solicitudes pendientes han sido marcadas como revisadas', 'success');
                }
            });
        });
        
        function loadRequests() {
            const requestsList = $('#requests-list');
            requestsList.empty();
            
            // Filtrar solicitudes
            let filteredRequests = solicitudes.filter(solicitud => {
                // Filtro por estado
                if (currentFilters.estado !== 'all' && solicitud.estado !== currentFilters.estado) {
                    return false;
                }
                
                // Filtro por categoría
                if (currentFilters.categoria !== 'all' && solicitud.categoria !== currentFilters.categoria) {
                    return false;
                }
                
                // Filtro por fecha
                if (currentFilters.fecha !== 'all') {
                    const solicitudDate = new Date(solicitud.fecha);
                    const today = new Date();
                    
                    switch(currentFilters.fecha) {
                        case 'today':
                            return solicitudDate.toDateString() === today.toDateString();
                        case 'week':
                            const weekAgo = new Date(today - 7 * 24 * 60 * 60 * 1000);
                            return solicitudDate >= weekAgo;
                        case 'month':
                            const monthAgo = new Date(today);
                            monthAgo.setMonth(monthAgo.getMonth() - 1);
                            return solicitudDate >= monthAgo;
                        case 'older':
                            const monthAgo2 = new Date(today);
                            monthAgo2.setMonth(monthAgo2.getMonth() - 1);
                            return solicitudDate < monthAgo2;
                    }
                }
                
                return true;
            });
            
            // Actualizar contadores
            updateStats();
            $('#requests-count').text(`${filteredRequests.length} solicitud${filteredRequests.length !== 1 ? 'es' : ''} encontrada${filteredRequests.length !== 1 ? 's' : ''}`);
            
            if (filteredRequests.length === 0) {
                requestsList.html(`
                    <div class="empty-state">
                        <i class="filter icon"></i>
                        <h3>No hay solicitudes con estos filtros</h3>
                        <p>Intenta con otros criterios de búsqueda</p>
                        <button class="ui button" id="reset-filters-btn">
                            <i class="redo icon"></i>
                            Restablecer filtros
                        </button>
                    </div>
                `);
                $('#reset-filters-btn').click(function() {
                    $('#reset-filters').click();
                });
                return;
            }
            
            // Ordenar por prioridad y fecha (más recientes primero)
            filteredRequests.sort((a, b) => {
                const priorityOrder = { alta: 3, media: 2, baja: 1 };
                if (priorityOrder[b.prioridad] !== priorityOrder[a.prioridad]) {
                    return priorityOrder[b.prioridad] - priorityOrder[a.prioridad];
                }
                return new Date(b.fecha) - new Date(a.fecha);
            });
            
            // Mostrar solicitudes
            filteredRequests.forEach(solicitud => {
                const categoriaNombre = getCategoryName(solicitud.categoria);
                const categoriaClass = `category-${solicitud.categoria}`;
                const statusClass = `status-${solicitud.estado}`;
                const statusName = getStatusName(solicitud.estado);
                const priorityBadge = getPriorityBadge(solicitud.prioridad);
                
                const requestElement = `
                    <div class="request-item ${solicitud.estado === 'resuelta' ? 'resuelta' : ''}" data-id="${solicitud.id}">
                        <div class="request-header">
                            <div class="request-title">${solicitud.titulo}</div>
                            <div>
                                ${priorityBadge}
                                <span class="status-badge ${statusClass}">${statusName}</span>
                            </div>
                        </div>
                        
                        <div>
                            <span class="request-category ${categoriaClass}">${categoriaNombre}</span>
                        </div>
                        
                        <div class="request-content">${solicitud.contenido}</div>
                        
                        <div class="request-meta">
                            <div class="request-info">
                                <div>
                                    <i class="user icon"></i>
                                    ${solicitud.habitante} (${solicitud.apartamento})
                                </div>
                                <div>
                                    <i class="calendar icon"></i>
                                    ${formatDate(solicitud.fecha)}
                                </div>
                            </div>
                            
                            <div class="request-actions">
                                <label class="check-container">
                                    <input type="checkbox" class="review-checkbox" ${solicitud.revisado ? 'checked' : ''} data-id="${solicitud.id}">
                                    <span class="checkmark"></span>
                                    Marcar como revisado
                                </label>
                                
                                <button class="ui primary basic button view-details-btn" data-id="${solicitud.id}">
                                    <i class="eye icon"></i>
                                    Ver detalles
                                </button>
                                
                                ${solicitud.estado !== 'resuelta' ? `
                                <button class="ui green basic button resolve-btn" data-id="${solicitud.id}">
                                    <i class="check icon"></i>
                                    Resolver
                                </button>
                                ` : ''}
                                
                                ${solicitud.estado !== 'rechazada' ? `
                                <button class="ui red basic button reject-btn" data-id="${solicitud.id}">
                                    <i class="times icon"></i>
                                    Rechazar
                                </button>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                `;
                
                requestsList.append(requestElement);
            });
            
            // Agregar eventos
            $('.review-checkbox').change(function() {
                const id = $(this).data('id');
                const isChecked = $(this).is(':checked');
                toggleReviewStatus(id, isChecked);
            });
            
            $('.view-details-btn').click(function() {
                const id = $(this).data('id');
                showRequestDetails(id);
            });
            
            $('.resolve-btn').click(function() {
                const id = $(this).data('id');
                resolveRequest(id);
            });
            
            $('.reject-btn').click(function() {
                const id = $(this).data('id');
                rejectRequest(id);
            });
        }
        
        function updateStats() {
            const pendientes = solicitudes.filter(s => s.estado === 'pendiente').length;
            const revision = solicitudes.filter(s => s.estado === 'revision').length;
            const resueltas = solicitudes.filter(s => s.estado === 'resuelta').length;
            const rechazadas = solicitudes.filter(s => s.estado === 'rechazada').length;
            
            $('#pending-count').text(pendientes);
            $('#review-count').text(revision);
            $('#resolved-count').text(resueltas);
            $('#rejected-count').text(rechazadas);
        }
        
        function toggleReviewStatus(id, isChecked) {
            const index = solicitudes.findIndex(s => s.id === id);
            if (index !== -1) {
                solicitudes[index].revisado = isChecked;
                if (isChecked && solicitudes[index].estado === 'pendiente') {
                    solicitudes[index].estado = 'revision';
                }
                loadRequests();
                showAlert(`Solicitud ${isChecked ? 'marcada como revisada' : 'desmarcada'}`, 'success');
            }
        }
        
        function showRequestDetails(id) {
            const solicitud = solicitudes.find(s => s.id === id);
            if (solicitud) {
                const categoriaNombre = getCategoryName(solicitud.categoria);
                const statusName = getStatusName(solicitud.estado);
                const priorityName = getPriorityName(solicitud.prioridad);
                
                $('#modal-title').text(solicitud.titulo);
                
                const detailsContent = `
                    <div class="details-section">
                        <div class="details-label">Descripción</div>
                        <div class="details-value">${solicitud.contenido}</div>
                    </div>
                    
                    <div class="ui three column grid">
                        <div class="column">
                            <div class="details-label">Categoría</div>
                            <div class="details-value">${categoriaNombre}</div>
                        </div>
                        <div class="column">
                            <div class="details-label">Estado</div>
                            <div class="details-value">${statusName}</div>
                        </div>
                        <div class="column">
                            <div class="details-label">Prioridad</div>
                            <div class="details-value">${priorityName}</div>
                        </div>
                    </div>
                    
                    <div class="ui three column grid">
                        <div class="column">
                            <div class="details-label">Habitante</div>
                            <div class="details-value">${solicitud.habitante}</div>
                        </div>
                        <div class="column">
                            <div class="details-label">Apartamento</div>
                            <div class="details-value">${solicitud.apartamento}</div>
                        </div>
                        <div class="column">
                            <div class="details-label">Fecha</div>
                            <div class="details-value">${formatDate(solicitud.fecha)}</div>
                        </div>
                    </div>
                    
                    <div class="details-section">
                        <div class="details-label">Última actualización</div>
                        <div class="details-value">${formatDate(new Date().toISOString().split('T')[0])}</div>
                    </div>
                `;
                
                $('#request-details-content').html(detailsContent);
                $('#request-details-modal').modal('show');
                
                // Configurar botón de resolver
                $('#resolve-request-btn').off('click').click(function() {
                    resolveRequest(id);
                    $('#request-details-modal').modal('hide');
                });
            }
        }
        
        function resolveRequest(id) {
            if (confirm('¿Marcar esta solicitud como resuelta?')) {
                const index = solicitudes.findIndex(s => s.id === id);
                if (index !== -1) {
                    solicitudes[index].estado = 'resuelta';
                    solicitudes[index].revisado = true;
                    loadRequests();
                    showAlert('Solicitud marcada como resuelta', 'success');
                }
            }
        }
        
        function rejectRequest(id) {
            if (confirm('¿Rechazar esta solicitud?')) {
                const index = solicitudes.findIndex(s => s.id === id);
                if (index !== -1) {
                    solicitudes[index].estado = 'rechazada';
                    solicitudes[index].revisado = true;
                    loadRequests();
                    showAlert('Solicitud rechazada', 'info');
                }
            }
        }
        
        function getCategoryName(category) {
            const categories = {
                'mantenimiento': 'Mantenimiento',
                'ruido': 'Ruido',
                'limpieza': 'Limpieza',
                'seguridad': 'Seguridad',
                'otros': 'Otros'
            };
            return categories[category] || 'Sin categoría';
        }
        
        function getStatusName(status) {
            const statuses = {
                'pendiente': 'Pendiente',
                'revision': 'En Revisión',
                'resuelta': 'Resuelta',
                'rechazada': 'Rechazada'
            };
            return statuses[status] || 'Desconocido';
        }
        
        function getPriorityName(priority) {
            const priorities = {
                'alta': 'Alta',
                'media': 'Media',
                'baja': 'Baja'
            };
            return priorities[priority] || 'Normal';
        }
        
        function getPriorityBadge(priority) {
            const badges = {
                'alta': '<span class="ui red horizontal label">Alta</span>',
                'media': '<span class="ui yellow horizontal label">Media</span>',
                'baja': '<span class="ui green horizontal label">Baja</span>'
            };
            return badges[priority] || '';
        }
        
        function formatDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString('es-ES', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            });
        }
        
        function showAlert(message, type) {
            let alertClass = 'blue';
            if (type === 'success') alertClass = 'green';
            if (type === 'error') alertClass = 'red';
            if (type === 'warning') alertClass = 'yellow';
            if (type === 'info') alertClass = 'blue';
            
            const alert = $(`
                <div class="ui ${alertClass} message" style="position: fixed; top: 70px; right: 20px; z-index: 9999; max-width: 400px;">
                    <i class="close icon"></i>
                    <div class="header">
                        ${type === 'success' ? 'Éxito' : type === 'error' ? 'Error' : 'Información'}
                    </div>
                    <p>${message}</p>
                </div>
            `);
            
            $('body').append(alert);
            alert.transition('fade up');
            
            alert.find('.close.icon').click(function() {
                alert.transition('fade up');
            });
            
            setTimeout(() => {
                alert.transition('fade up');
            }, 4000);
        }