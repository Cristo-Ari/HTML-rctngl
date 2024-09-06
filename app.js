class Point {
    constructor(getXOffsetPercentage, getYOffsetPercentage) {
        this.getXOffsetPercentage = getXOffsetPercentage;
        this.getYOffsetPercentage = getYOffsetPercentage;
    }
}

class Rectangle {
    constructor(topLeftPoint, bottomRightPoint) {
        this.topLeftPoint = topLeftPoint;
        this.bottomRightPoint = bottomRightPoint;
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
            this.drawRectangle(rectangle);
        }
    }

    drawRectangle(rectangle) {
        const x = rectangle.topLeftPoint.getXOffsetPercentage() * this.canvas.width;
        const y = (1 - rectangle.topLeftPoint.getYOffsetPercentage()) * this.canvas.height;
        const width = (rectangle.bottomRightPoint.getXOffsetPercentage() * this.canvas.width) - x;
        const height = y - (1 - rectangle.bottomRightPoint.getYOffsetPercentage()) * this.canvas.height;

        this.context.fillStyle = "rgba(0, 150, 255, 0.5)";
        this.context.fillRect(x, y - height, width, height);
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
});

document.getElementById('downButton').addEventListener('click', () => {
    yOffset -= moveStepPercentage;
});

document.getElementById('leftButton').addEventListener('click', () => {
    xOffset -= moveStepPercentage;
});

document.getElementById('rightButton').addEventListener('click', () => {
    xOffset += moveStepPercentage;
});
