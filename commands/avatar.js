const { registerCommand } = require("../commands");
const { createCanvas, loadImage } = require('canvas');
const { sendCvs } = require("../utils/sender");

function cmdAvatar(message) {
    loadImage("https://cdn.discordapp.com/avatars/"+message.author.id+"/"+message.author.avatar+".jpeg").then((img) => {
        const cvs = createCanvas(300, 300);
        
        const ctx = cvs.getContext('2d');
        
        const w = img.width;
        const h = img.height;

        ctx.drawImage(img, 0, 0, w, h, 0, 200, 100, 100);
        ctx.drawImage(img, 0, 0, w, h, 100, 0, 100, 300);
        ctx.drawImage(img, 0, 0, w, h, 200, 200, 100, 100);
        

        sendCvs(message, cvs);
    })
}
registerCommand(cmdAvatar, "Responds with your avatar", ['avatar', 'av'], "", false, true);