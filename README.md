# Warze.org/casino Discord bot
You can try the bot over on my Discord server: https://discord.gg/jtcqgvkZY7
## Setup
### Create an application
<https://discordapp.com/developers>
### Get required packages, make sure you're on a recent version of node
```bash
npm install
```
### You may also need to install canvas
```bash
npm install canvas
```
### Enter your bot's token and discord user ID in the settings.json:
```json
{
    "token": "BOTTOKENHERE",
    "admin": "345103284463206400",
    "prefix": "--",
    "channel": "1101531707934527580",
    "color": "23F843"
}
```
### Run the bot
```bash
node bot.js
```