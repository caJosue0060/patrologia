document.addEventListener('DOMContentLoaded', function() {

    // Determina la ruta base para los componentes
    const base = window.location.pathname.includes('/subcategorias/') || window.location.pathname.includes('/tesis/') ? '..' : '.';

    // Función para cargar un componente HTML en un placeholder
    const loadComponent = (url, placeholderId) => {
        return fetch(url)
            .then(response => response.ok ? response.text() : Promise.reject('Component not found'))
            .then(data => {
                const placeholder = document.getElementById(placeholderId);
                if (placeholder) {
                    placeholder.outerHTML = data;
                }
            })
            .catch(error => console.error(`Error loading component ${url}:`, error));
    };

    // Carga todos los componentes y luego inicializa los scripts de la página
    const loadAndInit = async () => {
        await Promise.all([
            loadComponent(`${base}/componentes/header.html`, 'header-placeholder'),
            loadComponent(`${base}/componentes/sidebar.html`, 'sidebar-placeholder'),
            loadComponent(`${base}/componentes/footer.html`, 'footer-placeholder')
        ]);
        
        // Una vez que los componentes están en el DOM, inicializa la funcionalidad
        initializePageFunctionality();
    };

    const initializePageFunctionality = () => {
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const sidebar = document.getElementById('sidebar');
        const mobileOverlay = document.getElementById('mobileOverlay');

        // Funcionalidad del menú móvil
        if (mobileMenuToggle) {
            mobileMenuToggle.addEventListener('click', function() {
                sidebar.classList.toggle('mobile-open');
                mobileOverlay.classList.toggle('active');
                document.body.style.overflow = sidebar.classList.contains('mobile-open') ? 'hidden' : '';
                
                // Cambiar el icono del botón
                this.innerHTML = sidebar.classList.contains('mobile-open') ? '✕' : '☰';
            });
        }
        
        if (mobileOverlay) {
            mobileOverlay.addEventListener('click', function() {
                sidebar.classList.remove('mobile-open');
                mobileOverlay.classList.remove('active');
                document.body.style.overflow = '';
                
                // Restaurar el icono del botón
                if (mobileMenuToggle) {
                    mobileMenuToggle.innerHTML = '☰';
                }
            });
        }

        // Funcionalidad del accordion en el sidebar
        document.querySelectorAll('.category-header').forEach(header => {
            header.addEventListener('click', function() {
                const submenu = this.nextElementSibling;
                const toggle = this.querySelector('.toggle');
                const isActive = submenu.classList.contains('active');

                // Cerrar todos los otros menús
                document.querySelectorAll('.submenu.active').forEach(openMenu => {
                    if (openMenu !== submenu) {
                        openMenu.classList.remove('active');
                        const openToggle = openMenu.parentElement.querySelector('.toggle');
                        openToggle.textContent = '+';
                        openToggle.classList.remove('active');
                    }
                });
                
                // Alternar el menú actual
                if (!isActive) {
                    submenu.classList.add('active');
                    toggle.textContent = '−';
                    toggle.classList.add('active');
                } else {
                    submenu.classList.remove('active');
                    toggle.textContent = '+';
                    toggle.classList.remove('active');
                }
            });
        });

        // Funcionalidad de las notas (versión actualizada y más robusta)
        document.addEventListener('click', function(e) {
            // Para abrir una nota
            if (e.target.classList.contains('note-toggle')) {
                // Busca el contenedor padre (.citation o .objection) y luego la nota dentro de él.
                const parentContainer = e.target.closest('.citation, .objection');
                if (parentContainer) {
                    const note = parentContainer.querySelector('.note');
                    if (note) {
                        note.classList.toggle('visible');
                    }
                }
            }
            
            // Para cerrar una nota
            if (e.target.classList.contains('close-note')) {
                e.target.closest('.note').classList.remove('visible');
            }
        });
        
        // Cerrar menú móvil al cambiar tamaño de ventana
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                sidebar.classList.remove('mobile-open');
                mobileOverlay.classList.remove('active');
                document.body.style.overflow = '';
                if (mobileMenuToggle) {
                    mobileMenuToggle.innerHTML = '☰';
                }
            }
        });

        // Cerrar menú móvil al hacer clic en enlaces del sidebar (opcional)
        document.querySelectorAll('.submenu a').forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    sidebar.classList.remove('mobile-open');
                    mobileOverlay.classList.remove('active');
                    document.body.style.overflow = '';
                    if (mobileMenuToggle) {
                        mobileMenuToggle.innerHTML = '☰';
                    }
                }
            });
        });

        // Smooth scroll para enlaces internos
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Efecto de fade-in para el contenido principal
        const mainContent = document.getElementById('mainContent');
        if (mainContent) {
            mainContent.style.opacity = '0';
            mainContent.style.transform = 'translateY(20px)';
            mainContent.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            
            setTimeout(() => {
                mainContent.style.opacity = '1';
                mainContent.style.transform = 'translateY(0)';
            }, 100);
        }

        // Añadir clase active al enlace actual en el sidebar (opcional)
        const currentPath = window.location.pathname;
        document.querySelectorAll('.submenu a').forEach(link => {
            if (link.getAttribute('href') === currentPath) {
                link.style.background = 'rgba(210, 180, 140, 0.2)';
                link.style.borderLeftColor = '#D2B48C';
                link.style.color = '#D2B48C';
                
                // Abrir el menú padre
                const parentSubmenu = link.closest('.submenu');
                if (parentSubmenu) {
                    parentSubmenu.classList.add('active');
                    const parentToggle = parentSubmenu.parentElement.querySelector('.toggle');
                    parentToggle.textContent = '−';
                    parentToggle.classList.add('active');
                }
            }
        });
    };

    loadAndInit();
});