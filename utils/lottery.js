const { loadImage, createCanvas } = require("canvas");
const { changeBalance } = require("./currency");
const { emojis } = require("./emojis");
const { randChoice } = require("./random");
const { send, sendBoth } = require("./sender");
const { addToStat } = require("./stats");
const { secToReadable } = require("./timestr");

class Lottery {
    constructor() {
        this.avatars = {};
        this.tickets = [];
        this.ongoing = false;
        this.ogmsg = false;
        this.prize = 0;
        this.duration = 180;
        this.startedAt = 0;
    }
    canvas(message) {
        // Size of the canvas stays about the same but size of indiv avatars gets smaller
        const width = Math.ceil(Math.sqrt(this.tickets.length));

        const px = Math.min(128, Math.floor(500 / width));

        const cvs = createCanvas(width * px, width * px);
        const ctx = cvs.getContext('2d');

        // Draw in a grid pattern
        let index = 0;
        for (let y = 0; y < width; y ++) {
            for (let x = 0; x < width; x ++) {
                const ticket = this.tickets[index]
                if (ticket) {
                    const img = this.avatars[ticket.userid];
                    ctx.drawImage(img, x * px, y * px, px, px);
                }
                index ++;
            }   
        }

        sendBoth(message, `Total tickets: **${this.tickets.length}** ${emojis.ticket} Prize: **${this.prize}** ${emojis.diamond}`, cvs);
    }
    addtickets(message, userid, amount, duration) {
        // If there is no ongoing lottery, the first user must start by putting atleast 10 tickets in
        if (!this.ongoing) {
            if (amount < 10) {
                send(message, `You have to buy atleast **10 tickets** ${emojis.ticket} yourself to start the lottery.`)
                return;
            } else {
                this.ongoing = true;
                this.startedAt = Date.now() / 1000;
                this.ogmsg = message;
                this.duration = duration * 60;

                send(message, `The Lottery buying phase has begun!\nThe winner will be drawn in **${secToReadable(this.duration)}**.\nEvery new participant in the lottery adds **+100** ${emojis.diamond} to the pool.`);
            }
        }

        // Buy n tickets as the userid
        for (let i = 0; i < amount; i ++) {
            this.tickets.push(this.randomticketid(userid))
        }

        // Add the amount to the prize
        this.prize += amount * 10;

        // Save the img
        loadImage(`https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.jpeg`).then((img) => {
            if (!this.avatars[message.author.id]) {
                this.avatars[message.author.id] = img;
                if (message.author.id !== this.ogmsg.author.id) {
                    this.prize += 100;
                }
            }

            // Show the tickets
            this.canvas(message);
        })
    }
    randomticketid(userid) {
        return {
            userid: userid,
            ticketid: `tkt-${Math.floor(Math.random() * 10000000)}`
        }
    }
    minuntilwinner() {
        const now = Date.now() / 1000;
        const minutes_left = Math.floor((this.startedAt + this.duration - now) / 60)
        return minutes_left
    }
    drawwinner() {
        if (!this.ongoing) return

        const minutes_left = this.minuntilwinner();
        if (minutes_left <= 0) {
            // Draw the winner
            const winning_ticket = randChoice(this.tickets);
            const winner = winning_ticket.userid;
            send(this.ogmsg, `<@${winner}> won the lottery! :tada: **+${this.prize}** ${emojis.diamond}`)
            changeBalance(winner, this.prize);
            addToStat('lotterywon', winner, 1);

            // Reset lottery
            this.tickets = [];
            this.avatars = {};
            this.prize = 0;

            // Stop the lottery
            this.ongoing = false;
        } else {
            send(this.ogmsg, `There are **${secToReadable(minutes_left * 60)}** left before the winner is announced.`)
        }
    }
}

let lottery = new Lottery();
exports.lottery = lottery;