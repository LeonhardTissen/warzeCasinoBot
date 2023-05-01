# Warze.org/casino Discord bot
You can try the bot over on my Discord server: https://discord.gg/jtcqgvkZY7
## Setup
### Create an application
- Build a bot at https://discordapp.com/developers
- Copy the token for later
### Get required packages, make sure you're on a recent version of node
```bash
npm install
```
### Enter your bot's token and discord user ID in "/settings.json" (You can rename "/sample_settings.json):
```json
{
    "token": "BOTTOKENHERE",
    "admin": "345103284463206400",
    "prefix": "--",
    "channel": "1101531707934527580",
    "color": "23F843"
}
```
### Run the bot master
```bash
node bot.js
```
### Add your own emotes
Because the bot won't have access to the predefined emotes referenced in "/utils/emojis.js", you should add your own.