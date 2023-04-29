const { sendCvs } = require("./sender");
const { createCanvas } = require("canvas")

class CvsBundler {
    constructor() {
        this.width = 0;
        this.height = 0;
        this.canvases = [];
    }
    add(cvs) {
        this.canvases.push(cvs);
        this.width = Math.max(this.width, cvs.width);
        this.height += cvs.height;
    }
    send(message) {
        const full_cvs = createCanvas(this.width, this.height)
        const full_ctx = full_cvs.getContext('2d');

        let y = 0;
        this.canvases.forEach((cvs) => {
            full_ctx.drawImage(cvs, 0, y, cvs.width, cvs.height);
            y += cvs.height;
        })
        
        sendCvs(message, full_cvs);
    }
}
exports.CvsBundler = CvsBundler;