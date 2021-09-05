var requestAnimationFrame = window.requestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                function (callback) { setTimeout (callback, 1000 / 30); };

var canvas = document.getElementById("canvas-id");
const size = screen.width > screen.height 
    ? screen.height
    : screen.width;

canvas.width = canvas.height = size;
var context = canvas.getContext("2d");

let pixels = [];
let rangeA = -2, rangeB = 2, neededIterationsForStable = 1000, outOfStableCoeff = 16;

const map = (value, x1, y1, x2, y2) => (value - x1) * (y2 - x2) / (y1 - x1) + x2;

function getEmptyPixelsGrid() {
    const pixels = [];
    for (let y = 0; y < canvas.height; y++) {
        pixels[y] = [];
        for (let x = 0; x < canvas.width; x++) {
            pixels[y][x] = 0;
        }
    }
    return pixels;
}

function calculateFrame(rangeA, rangeB, outOfStableCoeff, neededIterationsForStable) {
    framePixels = getEmptyPixelsGrid();
    for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
            let a = map(x, 0, canvas.width, rangeA, rangeB);
            let b = map(y, 0, canvas.height, rangeA, rangeB);

            let ca = a, cb = b;
            let iterations = 0;

            // Check if f(x) goes to lim infinity or remains stable.
            while (iterations < neededIterationsForStable) {
                let aa = a * a - b * b;
                let bb = 2 * a * b;

                a = aa + ca;
                b = bb + cb;

                if (a + b > outOfStableCoeff) {
                    // Goes to infinity.
                    break;
                }

                iterations ++;
            }

            // Set pixel color based on stableness.
            framePixels[y][x] = iterations === neededIterationsForStable ? {r: 0, g: 0, b: 0} : getColor(iterations)
        }
    }
    return framePixels;
}

function getColor(iterations) {
    const colors = [];
    colors[0] = {r: 66, g: 30, b: 15};
    colors[1] = {r: 25, g: 7, b: 26};
    colors[2] = {r: 9, g: 1, b: 47};
    colors[3] = {r: 4, g: 4, b: 73};
    colors[4] = {r: 0, g: 7, b: 100};
    colors[5] = {r: 12, g: 44, b: 138};
    colors[6] = {r: 24, g: 82, b: 177};
    colors[7] = {r: 57, g: 125, b: 209};
    colors[8] = {r: 134, g: 181, b: 229};
    colors[9] = {r: 211, g: 236, b: 248};
    colors[10] = {r: 241, g: 233, b: 191};
    colors[11] = {r: 248, g: 201, b: 95};
    colors[12] = {r: 255, g: 170, b: 0};
    colors[13] = {r: 204, g: 128, b: 0};
    colors[14] = {r: 153, g: 87, b: 0};
    colors[15] = {r: 106, g: 52, b: 3};

    return colors[iterations % 16];
}

pixels = calculateFrame(rangeA, rangeB, outOfStableCoeff, neededIterationsForStable);

window.addEventListener("mouseup", function (args) {
    let mouseX = args.clientX - canvas.offsetLeft;
    let mouseY = args.clientY - canvas.offsetTop;

    rangeA = map(mouseY, 0, size, rangeA, rangeB);
    rangeB = map(mouseX, 0, size, rangeA, rangeB);

    pixels = calculateFrame(rangeA, rangeB, outOfStableCoeff, neededIterationsForStable);
}, false);

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.globalAlpha = 1;
    for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
            context.fillStyle = `rgb(${pixels[y][x].r}, ${pixels[y][x].g}, ${pixels[y][x].b})`;
            context.fillRect(x, y, 1, 1); 
        }
    }

    requestAnimationFrame(draw);
}

draw();