const { sendCvs } = require("./sender");
const { createCanvas } = require("canvas");

// This utility can bundle multiple canvases together for a single message

class CvsBundler {
    constructor(padding = 0) {
        this.width = 0;
        this.height = 0;
        this.canvases = [];
        this.padding = padding;
    }
    add(cvs) {
        this.canvases.push(cvs);
        this.width = Math.max(this.width, cvs.width);
        this.height += cvs.height + this.padding;
    }
    send(message) {
        const full_cvs = createCanvas(this.width, this.height)
        const full_ctx = full_cvs.getContext('2d');

        let y = 0;
        this.canvases.forEach((cvs) => {
            full_ctx.drawImage(cvs, 0, y, cvs.width, cvs.height);
            y += cvs.height + this.padding;
        })
        
        sendCvs(message, full_cvs);
    }
}
exports.CvsBundler = CvsBundler;