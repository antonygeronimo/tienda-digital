// Funcionalidad para el menú en dispositivos móviles
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const menu = document.querySelector('.menu');
    
    if (menuToggle && menu) {
        menuToggle.addEventListener('click', function() {
            menu.classList.toggle('active');
        });
    }
    
    // Slider de testimonios
    const testimonios = document.querySelectorAll('.testimonio');
    const prevButton = document.getElementById('prev-testimonio');
    const nextButton = document.getElementById('next-testimonio');
    let testimonioActual = 0;
    
    // Ocultar todos los testimonios excepto el primero
    if (testimonios.length > 1) {
        for (let i = 1; i < testimonios.length; i++) {
            testimonios[i].style.display = 'none';
        }
    }
    
    // Función para mostrar el testimonio siguiente
    function mostrarSiguienteTestimonio() {
        testimonios[testimonioActual].style.display = 'none';
        testimonioActual = (testimonioActual + 1) % testimonios.length;
        testimonios[testimonioActual].style.display = 'block';
    }
    
    // Función para mostrar el testimonio anterior
    function mostrarTestimonioAnterior() {
        testimonios[testimonioActual].style.display = 'none';
        testimonioActual = (testimonioActual - 1 + testimonios.length) % testimonios.length;
        testimonios[testimonioActual].style.display = 'block';
    }
    
    // Agregar eventos a los botones
    if (prevButton && nextButton) {
        nextButton.addEventListener('click', mostrarSiguienteTestimonio);
        prevButton.addEventListener('click', mostrarTestimonioAnterior);
    }
    
    // Auto-rotación de testimonios
    setInterval(mostrarSiguienteTestimonio, 8000);
    
    // Accordion para FAQs
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const pregunta = item.querySelector('.faq-pregunta');
        pregunta.addEventListener('click', () => {
            // Cerrar todos los demás items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('activo');
                }
            });
            
            // Abrir/cerrar el item actual
            item.classList.toggle('activo');
        });
    });
    
    // Modal de checkout
    const modal = document.getElementById('modal-checkout');
    const btnComprar = document.getElementById('btn-comprar');
    const btnCerrar = document.querySelector('.close');
    const formCheckout = document.getElementById('checkout-form');
    
    if (btnComprar && modal) {
        btnComprar.addEventListener('click', function(e) {
            e.preventDefault();
            modal.style.display = 'block';
        });
    }
    
    if (btnCerrar) {
        btnCerrar.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }
    
    // Cerrar modal haciendo clic fuera del contenido
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Manejar el envío del formulario
    if (formCheckout) {
        formCheckout.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Aquí se conectaría con la pasarela de pago
            // Por ahora, solo mostramos un mensaje de confirmación
            
            alert('¡Gracias por tu compra! Recibirás un correo con los detalles de tu pedido.');
            modal.style.display = 'none';
        });
    }
    
    // Cambiar precio según la opción seleccionada
    const opcionesFormato = document.querySelectorAll('input[name="formato"]');
    const precioActual = document.querySelector('.precio-actual-large');
    
    if (opcionesFormato.length && precioActual) {
        opcionesFormato.forEach(opcion => {
            opcion.addEventListener('change', function() {
                let nuevoPrecio;
                
                switch(this.id) {
                    case 'fisico':
                        nuevoPrecio = '$29.99';
                        break;
                    case 'digital':
                        nuevoPrecio = '$19.99';
                        break;
                    case 'combo':
                        nuevoPrecio = '$39.99';
                        break;
                }
                
                precioActual.textContent = nuevoPrecio;
            });
        });
    }
    
    // Efecto de scroll suave para enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
                
                // Cerrar menú móvil si está abierto
                if (menu.classList.contains('active')) {
                    menu.classList.remove('active');
                }
            }
        });
    });
    
    // Validación básica del formulario
    const inputTarjeta = document.getElementById('tarjeta');
    const inputExpiracion = document.getElementById('expiracion');
    const inputCVV = document.getElementById('cvv');
    
    if (inputTarjeta) {
        inputTarjeta.addEventListener('input', function() {
            this.value = this.value.replace(/[^\d]/g, '');
            
            if (this.value.length > 16) {
                this.value = this.value.slice(0, 16);
            }
            
            // Formatear con espacios cada 4 dígitos
            if (this.value.length > 0) {
                this.value = this.value.match(/.{1,4}/g).join(' ');
            }
        });
    }
    
    if (inputExpiracion) {
        inputExpiracion.addEventListener('input', function() {
            this.value = this.value.replace(/[^\d]/g, '');
            
            if (this.value.length > 4) {
                this.value = this.value.slice(0, 4);
            }
            
            // Formatear como MM/AA
            if (this.value.length > 2) {
                this.value = this.value.slice(0, 2) + '/' + this.value.slice(2);
            }
        });
    }
    
    if (inputCVV) {
        inputCVV.addEventListener('input', function() {
            this.value = this.value.replace(/[^\d]/g, '');
            
            if (this.value.length > 3) {
                this.value = this.value.slice(0, 3);
            }
        });
    }
    
    // Efectos de animación al hacer scroll
    function animarElementosAlVerlos() {
        const elements = document.querySelectorAll('.beneficio-card, .caracteristica-imagen, .autor-imagen, .bonus-item');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }
    
    // Establecer estilos iniciales para animación
    document.querySelectorAll('.beneficio-card, .caracteristica-imagen, .autor-imagen, .bonus-item').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    // Activar animaciones al cargar la página y al hacer scroll
    window.addEventListener('load', animarElementosAlVerlos);
    window.addEventListener('scroll', animarElementosAlVerlos);
});