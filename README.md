# Warze.org/casino Discord bot

Please try the bot here: [My Discord Server](https://discord.gg/jtcqgvkZY7)

## Features
- Economy
- Inventory
- Shop
- Singleplayer and Multiplayer games

## Setup

### Create an application
- Build a bot at https://discordapp.com/developers
- Enable all 3 intents
- Copy the token for later

### Get required packages, make sure you're on a recent version of node
```bash
npm i
```

### Enter your bot's token and discord user ID in "/settings.json" (You can rename "/sample_settings.json):
```json
{
    "token": "BOTTOKENHERE",
    "admin": "345103284463206400",
    "prefix": "-",
    "mainchannel": "1101531707934527580",
    "channels": ["1101531707934527580"],
    "color": "23F843"
}
```
### Run the bot master
```bash
node bot.js
```
### Setup custom emotes
Because your bot needs to be in a server where the custom emotes are present, there is a utility that adds all the necessary emotes in any server.
Run -setupemotes in the server you want the emotes to be added in.
Please make sure that:
- The channel you're executing the command in is in the **settings.json's "channels"**
- The bot has **"Manage Expressions"** permissions
- There are enough emote slots (12 or more)
- When done, copy the generated JSON into **"emojis.json"** and restart the bot.

### If you enjoy this bot, please leave a Star ⭐

<p align="center">
	<img src="https://s.warze.org/paddingleft3.png" style="display: inline-block;"><a href="https://twitter.warze.org" style="text-decoration: none;"><img src="https://s.warze.org/x3.png" alt="Leonhard Tissen on X/Twitter" style="display: inline-block;"/></a><a href="https://youtube.warze.org" style="text-decoration: none;"><img src="https://s.warze.org/youtube3.png" alt="Leonhard Tissen on YouTube" style="display: inline-block;"/></a><a href="https://linkedin.warze.org" style="text-decoration: none;"><img src="https://s.warze.org/linkedin3.png" alt="Leonhard Tissen on LinkedIn" style="display: inline-block;"/></a><a href="https://github.warze.org" style="text-decoration: none;"><img src="https://s.warze.org/github3.png" alt="Leonhard Tissen on GitHub" style="display: inline-block;"/></a><a href="https://gitlab.warze.org" style="text-decoration: none;"><img src="https://s.warze.org/gitlab3.png" alt="Leonhard Tissen on GitLab" style="display: inline-block;"/></a><img src="https://s.warze.org/paddingright2.png">
</p>
