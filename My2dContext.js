"use strict";

class My2dContext {

    constructor(ctx){
        this._ctx = ctx;
        this._zoom = 1;
        this.draw = function() {};

        this.setZoomListeners();
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

    get font() { return this._ctx.font; }
    set font(value) { this._ctx.font = value; }

    fillText() { return this._ctx.fillText(...arguments); }
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

    zoomIn(){ this.zoom += 0.05; } 
    zoomOut(){ this.zoom -= 0.05; }
    zooming(isOut) {
        if (isOut) {
            this.zoomOut();
        } else {
            this.zoomIn();
        }
    }

    debug(){
        this.fillStyle = "#333";
        this.fillRect(10, h-110, 300, 100);

        this.fillStyle = "#ddd";
        this.font = "26px helvetica";
        this.fillText(`zoom: ${Math.round(this.zoom * 100) / 100}`, 15, h-85, 200);
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

    setZoomListeners() {
        this.canvas.addEventListener(
            'mousewheel',
            (e) => this.zooming(e.deltaY > 0),
            { passive: true }
        );

        this.setPinchListener();
    }
    
    //
    // https://github.com/mdn/dom-examples/blob/master/pointerevents/Pinch_zoom_gestures.html
    //

    setPinchListener(){
        // Global vars to cache event state
        this.canvas.evCache = new Array();
        this.canvas.prevDiff = -1;
        this.canvas.self = this;

        this.canvas.onpointerdown = this.pointerdown_handler;
        this.canvas.onpointermove = this.pointermove_handler;

        this.canvas.onpointerup = this.pointerup_handler;
        this.canvas.onpointercancel = this.pointerup_handler;
        this.canvas.onpointerout = this.pointerup_handler;
        this.canvas.onpointerleave = this.pointerup_handler;
    }

    pointerdown_handler(ev) {
        this.evCache.push(ev);
    }
    pointermove_handler(ev) {
        // Find this event in the cache and update its record with this event
        for (var i = 0; i < this.evCache.length; i++) {
            if (ev.pointerId == this.evCache[i].pointerId) {
                this.evCache[i] = ev;
                break;
            }
        }
        // If two pointers are down, check for pinch gestures
        if (this.evCache.length == 2) {
            // Calculate the distance between the two pointers
            var curDiff = Math.abs(this.evCache[0].clientX - this.evCache[1].clientX);
            if (this.prevDiff > 0) {
                if (curDiff > this.prevDiff) {
                    this.self.zoomIn();
                }
                if (curDiff < this.prevDiff) {
                    this.self.zoomOut();
                }
            }
            // Cache the distance for the next move event 
            this.prevDiff = curDiff;
        }
    }
    pointerup_handler(ev) {
        // Remove this pointer from the cache
        for (var i = 0; i < this.evCache.length; i++) {
            if (this.evCache[i].pointerId == ev.pointerId) {
                this.evCache.splice(i, 1);
                break;
            }
        }

        // If the number of pointers down is less than two then reset diff tracker
        if (this.evCache.length < 2) this.prevDiff = -1;
    }
}
