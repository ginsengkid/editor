const canvas = document.querySelector("canvas"),
    toolBtns = document.querySelectorAll(".tool"),
    fillColor = document.querySelector("#fill-color"),
    sizeSlider = document.querySelector("#size-slider"),
    colorBtns = document.querySelectorAll(".colors .option"),
    colorPicker = document.querySelector("#color-picker"),
    clearCanvas = document.querySelector(".clear-canvas"),
    saveImg = document.querySelector(".save-img"),
    undoImg = document.querySelector(".undo-canvas"),
    uploadImg = document.querySelector(".upload-img"),
    context = canvas.getContext("2d");

let prevMouseX, prevMouseY, snapshot, tmpCanvas,
    isDrawing = false,
    undo = false,
    selectedTool = "brush",
    brushWidth = 5,
    selectedColor = "#000";

const setCanvasBackground = () => {
    context.fillStyle = "#fff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = selectedColor;
}

window.addEventListener("load", () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    setCanvasBackground();
});

const drawRect = (e) => {
    if(!fillColor.checked) {
        return context.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
    }
    context.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
}

const startDraw = (e) => {
    undo = true;
    tmpCanvas = canvas.toDataURL();
    isDrawing = true;
    prevMouseX = e.offsetX;
    prevMouseY = e.offsetY;
    context.beginPath();
    context.lineWidth = brushWidth;
    context.strokeStyle = selectedColor;
    context.fillStyle = selectedColor;
    snapshot = context.getImageData(0, 0, canvas.width, canvas.height);
}

const drawing = (e) => {
    if(!isDrawing) return;
    context.putImageData(snapshot, 0, 0);

    if(selectedTool === "brush" || selectedTool === "eraser") {
        context.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor;
        context.lineTo(e.offsetX, e.offsetY);
        context.stroke();
    } else if(selectedTool === "rectangle"){
        drawRect(e);
    }
}

for (const btn of toolBtns){
    btn.addEventListener("click", () => {
        document.querySelector(".options .active").classList.remove("active");
        btn.classList.add("active");
        selectedTool = btn.id;
    });
}

sizeSlider.addEventListener("change", () => brushWidth = sizeSlider.value);

for (const btn of colorBtns){
    btn.addEventListener("click", () => {
        document.querySelector(".options .selected").classList.remove("selected");
        btn.classList.add("selected");
        selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color");
    });
}

colorPicker.addEventListener("input", () => {
    document.querySelector(".options .selected").classList.remove("selected");
    colorPicker.classList.add("selected");
    selectedColor = colorPicker.value;
});

clearCanvas.addEventListener("click", () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    setCanvasBackground();
});

saveImg.addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = `${Date.now()}.jpg`;
    link.href = canvas.toDataURL();
    link.click();
});

undoImg.addEventListener("click", () => {
    const tempImg = new Image();
    tempImg.src = tmpCanvas;
    tempImg.onload = function () {
        context.drawImage(tempImg, 0, 0);
    };
});

uploadImg.addEventListener("click", async () => {
    undo = true;
    tmpCanvas = canvas.toDataURL();
    let input = document.querySelector('.upload-img-hidden');
    input.addEventListener('change', function(ev2) {
        if (input.files.length) {
            let i = new Image();
            i.onload = function () {
                let k = i.height + 200 > i.width  ? canvas.height / i.height : canvas.width / i.width;
                context.drawImage(i, 0,0,i.width * k, i.height * k);
            };
            i.src = URL.createObjectURL(input.files[0]);
        }
    });
    input.click();
});

canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", () => undo = isDrawing = false);