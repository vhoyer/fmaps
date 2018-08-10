"use strict";

class My2dContext {

    constructor(ctx){
        this._ctx = ctx;
        this._zoom = 1;
        this.draw = function() {};

        this.canvas.addEventListener('mousewheel', (e) => {
            if (e.deltaY > 0) {
                this.zoomOut();
            } else {
                this.zoomIn();
            }
        }, { passive: true });
    }

    get canvas() { return this._ctx.canvas; }
    set canvas(value) { this._ctx.canvas = value; }

    get zoom() { return this._zoom; }
    set zoom(value) {
        if (value < 0.05){
            return;
        }
        this._zoom = value;
        this.draw();
    }

    get w() {
        return this.canvas.width / this.zoom;
    }

    get h() {
        return this.canvas.height / this.zoom;
    }

    get fillStyle() { return this._ctx.fillStyle; }
    set fillStyle(value) { this._ctx.fillStyle = value; }

    get strokeStyle() { return this._ctx.strokeStyle; }
    set strokeStyle(value) { this._ctx.strokeStyle = value }

    fillRect(){ return this._ctx.fillRect(...arguments); }
    beginPath() { return this._ctx.beginPath(); }
    stroke() { return this._ctx.stroke(); }
    drawImage() {
        //https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
        if (arguments.length === 5){
            return this._ctx.drawImage(
                arguments[0], //thats the image
                arguments[1] * this.zoom,
                arguments[2] * this.zoom,
                arguments[3] * this.zoom,
                arguments[4] * this.zoom
            );
        }
        return this._ctx.drawImage(...arguments);
    }
    moveTo(x,y) {
        //https://developer.mozilla.org/pt-BR/docs/Web/API/CanvasRenderingContext2D/moveTo
        return this._ctx.moveTo(
            x * this.zoom,
            y * this.zoom
        );
    }
    lineTo(x, y) {
        //https://developer.mozilla.org/pt-BR/docs/Web/API/CanvasRenderingContext2D/lineTo
        return this._ctx.lineTo(
            x * this.zoom,
            y * this.zoom
        );
    }

    zoomIn(){
        this.zoom += 0.05;
    }
    zoomOut(){
        this.zoom -= 0.05;
    }

    //sqr => square size
    drawBackground(sqr) {
        this.fillStyle = "#FFFDF7";
        this.fillRect(0, 0, w, h);

        this.beginPath();
        for (let i = 0; i < this.w / sqr; i++) {
            this.moveTo(sqr * i, 0     );
            this.lineTo(sqr * i, this.h);
        }
        for (let i = 0; i < this.h / sqr; i++) {
            this.moveTo(0     , sqr * i);
            this.lineTo(this.w, sqr * i);
        }
        this.strokeStyle = "#FFEECE";
        this.stroke();
    }
};
