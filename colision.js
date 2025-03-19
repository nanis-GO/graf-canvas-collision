const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

const window_height = window.innerHeight;
const window_width = window.innerWidth;
canvas.height = window_height;
canvas.width = window_width;
canvas.style.background = "#000";

let score = 0;
const colors = ["#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#A133FF", "#33FFF5", "#F5FF33", "#FF3333", "#33FF8C", "#8C33FF"];

class Circle {
    constructor(x, radius, color, text, speed) {
        this.posX = x;
        this.posY = Math.random() * (window_height - radius * 2) + radius;
        this.radius = radius;
        this.color = color;
        this.text = text;
        this.speed = speed;
        this.dy = speed;
    }

    draw(context) {
        context.beginPath();
        context.fillStyle = this.color;
        context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2);
        context.fill();
        context.fillStyle = "#000";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = "20px Arial";
        context.fillText(this.text, this.posX, this.posY);
        context.closePath();
    }

    update() {
        this.posY += this.dy;
        
        if (this.posY + this.radius >= window_height || this.posY - this.radius <= 0) {
            this.dy = -this.dy;
        }
    }

    isClicked(mouseX, mouseY) {
        const dx = this.posX - mouseX;
        const dy = this.posY - mouseY;
        return Math.sqrt(dx * dx + dy * dy) < this.radius;
    }
}

let circles = [];

function generateCircles(n) {
    circles = []; // Limpiar el array antes de generar nuevos círculos
    for (let i = 0; i < n; i++) {
        let radius = Math.random() * 30 + 20;
        let x = Math.random() * (window_width - radius * 2) + radius;
        let color = colors[i % colors.length];
        let speed = (Math.random() * 4 + 1) * (Math.random() < 0.5 ? 1 : -1);
        let text = `C${i + 1}`;
        circles.push(new Circle(x, radius, color, text, speed));
    }
}

function drawScore() {
    ctx.fillStyle = "#FFF";
    ctx.font = "20px Arial";
    ctx.fillText(`Eliminados: ${score}`, window_width - 120, 30);
}

function animate() {
    ctx.clearRect(0, 0, window_width, window_height);
    circles.forEach(circle => {
        circle.update();
        circle.draw(ctx);
    });
    drawScore();
    
    if (circles.length === 0) {
        setTimeout(() => {
            generateCircles(10);
        }, 1000);
    }
    
    requestAnimationFrame(animate);
}

canvas.addEventListener("click", function (event) {
    const mouseX = event.clientX;
    const mouseY = event.clientY;
    for (let i = circles.length - 1; i >= 0; i--) {
        if (circles[i].isClicked(mouseX, mouseY)) {
            circles.splice(i, 1);
            score++;
            break;
        }
    }
});

generateCircles(10);
animate();
