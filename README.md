# Aurebesh_DiscordBot

you will need to have npm and nodejs installed on your computer.

I also reccomend installing nodemon globally on your computer too.

clone the repository
run `npm install`
create a file named .env `touch.env`
in this file you will need to set 3 constant variables.
The Discord bot token `TOKEN = ''`
The ID for your server `GUILD_ID = `
    (This is needed to register the slash commands on your server)
The ID for the bot.  `CLIENT_ID = `

Lastly you just need to run `npm start` to run the bot.  
running /aurebesh from discord will allow you to translate anything
to aurebesh.


Note:  if running from a raspberry pi there is a chrome bug.
You will need the desktop version of raspi and you will need to 
checkout the raspberrypi branch to point it to the working 
version of chromium-browser.
