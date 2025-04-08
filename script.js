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

    // Inicializar PayPal de manera más robusta
    function inicializarPayPal() {
        // Verificar que el contenedor existe
        const paypalContainer = document.getElementById('paypal-button-container');
        if (!paypalContainer) {
            console.error('No se encontró el contenedor de PayPal');
            return;
        }

        // Verificar que la librería de PayPal está cargada
        if (typeof paypal === 'undefined') {
            console.error('La librería de PayPal no está cargada');
            
            // Cambiar el client-id a uno de prueba y recargar el SDK
            const paypalScript = document.getElementById('paypal-script');
            if (paypalScript) {
                paypalScript.src = 'https://www.paypal.com/sdk/js?client-id=test&currency=USD';
            } else {
                // Si no existe el script, crearlo
                const script = document.createElement('script');
                script.id = 'paypal-script';
                script.src = 'https://www.paypal.com/sdk/js?client-id=test&currency=USD';
                script.onload = configurarBotonesPayPal;
                document.body.appendChild(script);
            }
            return;
        }

        configurarBotonesPayPal();
    }

    function configurarBotonesPayPal() {
        if (typeof paypal === 'undefined') {
            console.error('PayPal sigue sin estar disponible');
            return;
        }

        // Limpiar el contenedor antes de renderizar
        const paypalContainer = document.getElementById('paypal-button-container');
        paypalContainer.innerHTML = '';

        paypal.Buttons({
            style: {
                layout: 'vertical',
                color: 'gold',
                shape: 'rect',
                label: 'pay'
            },
            
            // Configurar la transacción cuando se hace clic en el botón de PayPal
            createOrder: function(data, actions) {
                // Obtener el formato seleccionado
                const formatoSeleccionado = document.querySelector('input[name="formato"]:checked').id;
                let precio;
                
                switch(formatoSeleccionado) {
                    case 'fisico':
                        precio = 29.99;
                        break;
                    case 'digital':
                        precio = 19.99;
                        break;
                    case 'combo':
                        precio = 39.99;
                        break;
                    default:
                        precio = 19.99;
                }
                
                // Crear la orden en PayPal
                return actions.order.create({
                    purchase_units: [{
                        description: 'Libro - ' + formatoSeleccionado.charAt(0).toUpperCase() + formatoSeleccionado.slice(1),
                        amount: {
                            currency_code: 'USD',
                            value: precio
                        }
                    }]
                });
            },
            
            // Finalizar la transacción
            onApprove: function(data, actions) {
                return actions.order.capture().then(function(details) {
                    // Mostrar mensaje de éxito
                    const confirmacionCompra = document.getElementById('confirmacion-compra');
                    if (confirmacionCompra) {
                        confirmacionCompra.innerHTML = `
                            <div class="exito-mensaje">
                                <h3>¡Gracias por tu compra, ${details.payer.name.given_name}!</h3>
                                <p>Tu pedido ha sido procesado correctamente.</p>
                                <p>ID de transacción: ${details.id}</p>
                                <p>Recibirás un correo electrónico con los detalles de tu compra.</p>
                            </div>
                        `;
                        confirmacionCompra.style.display = 'block';
                        
                        // Ocultar el formulario de compra
                        const formularioCompra = document.getElementById('formulario-compra');
                        if (formularioCompra) {
                            formularioCompra.style.display = 'none';
                        }
                        
                        // Desplazarse hacia el mensaje de confirmación
                        window.scrollTo({
                            top: confirmacionCompra.offsetTop - 100,
                            behavior: 'smooth'
                        });
                    }
                });
            },
            
            // Manejo de errores
            onError: function(err) {
                console.error('Error en la transacción de PayPal:', err);
                const mensajeError = document.getElementById('mensaje-error');
                if (mensajeError) {
                    mensajeError.textContent = 'Ha ocurrido un error al procesar tu pago. Por favor, inténtalo de nuevo.';
                    mensajeError.style.display = 'block';
                }
            }
        }).render('#paypal-button-container');
    }

    // Intentar inicializar PayPal cuando la página esté completamente cargada
    if (document.getElementById('paypal-button-container')) {
        inicializarPayPal();
    }
    
    // Formulario de contacto
    const formularioContacto = document.getElementById('formulario-contacto');
    if (formularioContacto) {
        formularioContacto.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nombre = document.getElementById('contacto-nombre').value;
            const email = document.getElementById('contacto-email').value;
            const mensaje = document.getElementById('contacto-mensaje').value;
            
            // Validación básica
            if (!nombre || !email || !mensaje) {
                alert('Por favor, completa todos los campos.');
                return;
            }
            
            // Simular envío (aquí se conectaría con un backend real)
            const botonEnviar = document.getElementById('contacto-enviar');
            const mensajeConfirmacion = document.getElementById('contacto-confirmacion');
            
            if (botonEnviar && mensajeConfirmacion) {
                botonEnviar.disabled = true;
                botonEnviar.textContent = 'Enviando...';
                
                // Simular retardo de red
                setTimeout(function() {
                    botonEnviar.disabled = false;
                    botonEnviar.textContent = 'Enviar Mensaje';
                    
                    // Mostrar confirmación
                    mensajeConfirmacion.textContent = '¡Gracias! Tu mensaje ha sido enviado correctamente.';
                    mensajeConfirmacion.style.display = 'block';
                    
                    // Resetear formulario
                    formularioContacto.reset();
                    
                    // Ocultar confirmación después de un tiempo
                    setTimeout(function() {
                        mensajeConfirmacion.style.display = 'none';
                    }, 5000);
                }, 1500);
            }
        });
    }
});