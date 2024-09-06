class Point {
    constructor(getXOffsetPercentage, getYOffsetPercentage) {
        this.getXOffsetPercentage = getXOffsetPercentage;
        this.getYOffsetPercentage = getYOffsetPercentage;
    }

    getX(canvasWidth) {
        return this.getXOffsetPercentage() * canvasWidth;
    }

    getY(canvasHeight) {
        return canvasHeight - this.getYOffsetPercentage() * canvasHeight;
    }
}

class Rectangle {
    constructor(topLeftPoint, bottomRightPoint) {
        this.topLeftPoint = topLeftPoint;
        this.bottomRightPoint = bottomRightPoint;
    }

    draw(context, canvasWidth, canvasHeight) {
        const x = this.topLeftPoint.getX(canvasWidth);
        const y = this.topLeftPoint.getY(canvasHeight);
        const width = this.bottomRightPoint.getX(canvasWidth) - x;
        const height = y - this.bottomRightPoint.getY(canvasHeight);
        context.fillStyle = "rgba(0, 150, 255, 0.5)";
        context.fillRect(x, y - height, width, height);
    }
}

class RectangleDrawer {
    constructor(canvas, refreshRateHz = 60) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        this.rectangles = [];
        this.refreshIntervalMs = 1000 / refreshRateHz;
        this.startDrawing();
    }

    startDrawing() {
        this.intervalId = setInterval(() => {
            this.clearCanvas();
            this.drawAllRectangles();
        }, this.refreshIntervalMs);
    }

    stopDrawing() {
        clearInterval(this.intervalId);
    }

    clearCanvas() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawAllRectangles() {
        for (let rectangle of this.rectangles) {
            rectangle.draw(this.context, this.canvas.width, this.canvas.height);
        }
    }

    addRectangle(rectangle) {
        this.rectangles.push(rectangle);
    }

    resizeCanvasToFitSquare() {
        const parentElement = this.canvas.parentElement;
        const minSize = Math.min(parentElement.clientWidth, parentElement.clientHeight);
        this.canvas.width = minSize;
        this.canvas.height = minSize;
    }
}

// Инициализация
const canvas = document.getElementById('squareCanvas');
const drawer = new RectangleDrawer(canvas);

// Начальные смещения
let xOffset = 0;
let yOffset = 0;
const moveStepPercentage = 0.05; // Шаг движения в процентах

// Функция для создания лямбда-выражений с учетом смещений
function createPoint(xBase, yBase) {
    return new Point(
        () => xBase + xOffset,
        () => yBase + yOffset
    );
}

// Добавляем тестовый квадрат
const smallRectangle = new Rectangle(
    createPoint(0.25, 0.75),
    createPoint(0.75, 0.25)
);
drawer.addRectangle(smallRectangle);

// Обновление размера холста при изменении окна
window.addEventListener('resize', () => {
    drawer.resizeCanvasToFitSquare();
});
drawer.resizeCanvasToFitSquare();

// Обработчики для кнопок
document.getElementById('upButton').addEventListener('click', () => {
    yOffset += moveStepPercentage;
    updateRectanglePosition();
});

document.getElementById('downButton').addEventListener('click', () => {
    yOffset -= moveStepPercentage;
    updateRectanglePosition();
});

document.getElementById('leftButton').addEventListener('click', () => {
    xOffset -= moveStepPercentage;
    updateRectanglePosition();
});

document.getElementById('rightButton').addEventListener('click', () => {
    xOffset += moveStepPercentage;
    updateRectanglePosition();
});

// Функция для обновления положения прямоугольника при изменении смещений
function updateRectanglePosition() {
    smallRectangle.topLeftPoint = createPoint(0.25, 0.75);
    smallRectangle.bottomRightPoint = createPoint(0.75, 0.25);
}
 
