# TJS Discord Bot

Functions

- `/clear-messages` clear messages in a channel (up to 100 most recent messages)
- `/breakout create {#}` create # of breakout rooms and move members currently in `lobby` to them
- `/breakout delete` delete all breakout rooms and move members to `lobby`


## Create a New Bot

Open https://discord.com/developers/applications

Select `New Application`

Give your bot a name

Select `Create`

Fill out any info and give it an avatar (this will show in your Discord)

Go to 'Bot' tab - select 'Reset Token', 'yes' and copy the new token it gives you.
Put this token in `DISCORD_TOKEN` in `.env` file

Go to your Discord, right click on your server's thumbnail and select `Copy Server ID`
Put it in `GUILD_ID` in `.env` file

Go to 'OAuth2' tab - copy the `CLIENT_ID` and put it in the `.env` file


## Invite Bot to your Server

Again in the `OAuth2` tab, go to `URL GENERATOR`

Select `bot`

Select `Administrator` (This can be done with less perms - probably Manage Channels, Read Messages/View Channels, Move Members, Read Message History and Manage Messages)

Copy the URL and paste into your browser

Go through the process to grant your new bot those permissions

Your new bot will now be in your server showing *offline*

In your terminal run `node deploy-commands.mjs` to create the slash commands in your server

Run `npm run dev` to spin it up locally

If all is good, you'll see

`Ready!`

And your bot will be *online* in your server


## Potential Issues:

- If you get an `invalidToken` error, repeat the `Reset Token` process above and try again

- If your voice channel is not named 'lobby' you can customize in `breakout.mjs`
