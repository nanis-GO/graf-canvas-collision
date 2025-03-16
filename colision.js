const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

// Obtener las dimensiones de la pantalla actual
const window_height = window.innerHeight;
const window_width = window.innerWidth;
canvas.height = window_height;
canvas.width = window_width;
canvas.style.background = "#000"; // Fondo negro

class Circle {
    constructor(x, y, radius, color, text, speed) {
        this.posX = x;
        this.posY = y;
        this.radius = radius;
        this.color = color;
        this.text = text;
        this.speed = speed;
        this.dx = (Math.random() - 0.5) * 2 * this.speed; // Dirección X aleatoria
        this.dy = (Math.random() - 0.5) * 2 * this.speed; // Dirección Y aleatoria
        this.originalColor = color; // Guardar el color original
        this.colliding = false; // Estado de colisión
    }

    // Método para dibujar el círculo
    draw(context) {
        context.beginPath();
        context.strokeStyle = this.color;
        context.fillStyle = this.color; // Rellenar el círculo con color
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = "20px Arial";
        context.fillText(this.text, this.posX, this.posY);
        context.lineWidth = 2;
        context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false);
        context.stroke();
        context.fill(); // Rellenar el círculo
        context.closePath();
    }

    // Método para actualizar la posición del círculo
    update(context) {
        this.draw(context);

        // Actualizar la posición X
        this.posX += this.dx;
        // Cambiar la dirección si el círculo llega al borde del canvas en X
        if (this.posX + this.radius > window_width || this.posX - this.radius < 0) {
            this.dx = -this.dx;
        }

        // Actualizar la posición Y
        this.posY += this.dy;
        // Cambiar la dirección si el círculo llega al borde del canvas en Y
        if (this.posY + this.radius > window_height || this.posY - this.radius < 0) {
            this.dy = -this.dy;
        }
    }

    // Método para detectar colisiones con otro círculo
    checkCollision(otherCircle) {
        const dx = this.posX - otherCircle.posX;
        const dy = this.posY - otherCircle.posY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < this.radius + otherCircle.radius;
    }

    // Método para cambiar el color durante la colisión
    setColliding(isColliding) {
        if (isColliding) {
            this.color = "#0000FF"; // Cambiar a azul
        } else {
            this.color = this.originalColor; // Restaurar el color original
        }
        this.colliding = isColliding; // Actualizar el estado de colisión
    }

    // Método para manejar el rebote durante la colisión
    bounce(otherCircle) {
        const dx = this.posX - otherCircle.posX;
        const dy = this.posY - otherCircle.posY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Calcular el ángulo de colisión
        const angle = Math.atan2(dy, dx);

        // Calcular las nuevas velocidades
        const speed1 = Math.sqrt(this.dx * this.dx + this.dy * this.dy);
        const speed2 = Math.sqrt(otherCircle.dx * otherCircle.dx + otherCircle.dy * otherCircle.dy);

        // Calcular las nuevas direcciones
        this.dx = Math.cos(angle) * speed2;
        this.dy = Math.sin(angle) * speed2;
        otherCircle.dx = Math.cos(angle + Math.PI) * speed1;
        otherCircle.dy = Math.sin(angle + Math.PI) * speed1;
    }
}

// Crear un array para almacenar 10 círculos
let circles = [];

// Función para generar círculos aleatorios
function generateCircles(n) {
    const colors = ["#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#A133FF", "#33FFF5", "#F5FF33", "#FF3333", "#33FF8C", "#8C33FF"]; // Colores predefinidos (no azules)
    for (let i = 0; i < n; i++) {
        let radius = Math.random() * 30 + 20; // Radio entre 20 y 50
        let x = Math.random() * (window_width - radius * 2) + radius;
        let y = Math.random() * (window_height - radius * 2) + radius;
        let color = colors[i % colors.length]; // Asignar un color de la lista
        let speed = Math.random() * 4 + 1; // Velocidad entre 1 y 5
        let text = `C${i + 1}`; // Etiqueta del círculo
        circles.push(new Circle(x, y, radius, color, text, speed));
    }
}

// Función para animar los círculos
function animate() {
    ctx.clearRect(0, 0, window_width, window_height); // Limpiar el canvas

    // Restablecer el estado de colisión de todos los círculos
    circles.forEach(circle => circle.setColliding(false));

    // Verificar colisiones entre todos los círculos
    for (let i = 0; i < circles.length; i++) {
        for (let j = i + 1; j < circles.length; j++) {
            if (circles[i].checkCollision(circles[j])) {
                circles[i].setColliding(true); // Cambiar a azul
                circles[j].setColliding(true); // Cambiar a azul
                circles[i].bounce(circles[j]); // Rebotar
            }
        }
    }

    // Actualizar y dibujar cada círculo
    circles.forEach(circle => {
        circle.update(ctx);
    });

    requestAnimationFrame(animate); // Repetir la animación
}

// Generar 10 círculos y comenzar la animación
generateCircles(10);
animate();