## Unstable Minion - A Discord Bot for making images
### Another Discord Bot? 
<hr>
Unstable Minion is a personal project to fix one issue, on the fly npc generation/inspiration! Numerous dnd games involve coming up with a character on the fly whether it be shop keepers, quest givers, or random love interests that may or may not be cursed eldritch gods in disguise!

## Getting Started
This project is currently in prototype stages as I work out the kinks on deployment, testing, and typing. So these steps are fairly simple as they stand right now. 

### Config.json
You're going to need to create a file called `config.json` in the root of your project directory. Here you'll need the following values. 


* token: This is your Discord API token
* clientId: The Client id of the discord server you've oauthed your bot to
* guildId: The Guild id of the discord server you've oauthed your bot to
* ComfyServerAddress: The server address for your comfy api endpoint

### Install and Running
Now after getting your config setup you'll need a running Comfy ui installation, this project was designed around using comfy as it was easier to export and import workflows for api calls. This will be the address that *ComfyServerAddress* in config.json needs to point to. 


First you'll install all the dependencies with npm install or your preferred package manager. `npm install`

Then you'll need to deploy your commands this will use the guild id and client id to ensure it targets the correct server instance. Run this by using the deploy script as so. `npm run deploy`

You should see confirmation that all your commands have been deployed. Now all you need to do is start the server with `npm run start` and you'll be able to send and run commands from discord! 

## Commands
As of the current iteration the following commands are supported. 

* NPC: Generates a simple npc from a randomized set of wildcard tokens.
* Husbaindu: Creates a romancable male npc that is *visually* appealing
* Waifu: Creates a romancable female npc that is *visually* appealing

## Modfying Prompts
If you are familiar with comfyui or stable diffusion i general you may find you like the concept of the bot, but want to do more complicated prompts or commands. The folder `common/workflows` has all of the prompts in an exported module. Here i simply export my workflows from comfy and place them under the corresponding tag of exports.