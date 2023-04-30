const { sendCvs } = require("./sender");
const { createCanvas } = require("canvas");

// This utility can bundle multiple canvases together for a single message

class CvsBundler {
    // Creates the canvas bundler, padding can be passed in defining px between canvases
    constructor(padding = 0) {
        this.width = 0;
        this.height = 0;
        this.canvases = [];
        this.padding = padding;
    }
    // Add a new canvas to the bundle, below the last one
    add(cvs) {
        this.canvases.push(cvs);
        this.width = Math.max(this.width, cvs.width);
        this.height += cvs.height + this.padding;
    }
    // Send the full canvas bundle in the message's channel
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