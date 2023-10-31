# What is this repo for?

This repo is the first part of a two step process. Discord-Scraper-Process is the second part.

This repository contains the code used to scrape all messages from the channels you select from a discord server.

## How to use

Before you can start scraping you'll need to fill in some details about the account you'll be using for it.

### Step 1: Setup auth

- **Copy** the `auth_example.json` file and rename it to `auth.json`.
- Open discord in your browser, open your browser's devtools and go to the network tab. Make sure that only fetch/xhr requests will be shown.
- Click on one of the channels in the server you want to scrape and look for a request to `messages?limit=50`. If you can't find it you might have to scroll up in that channel.
- Click on the request and go to the headers tab.
- Copy the value of the `authorization` header. Paste this into the `token` variable in the `auth.json` file.
- Find the `X-Super-Properties` header and copy the value into the `auth.json` file.
- Copy the url at the top of your browser and paste it into the `auth.json` file in the `referrer` field. It should look something like this: `https://discord.com/channels/123456789012345678/123456789012345678`.

### Step 2: Setup scraper

- **Copy** the `channels_example.js` file and rename it to `channels.js`. This file contains the names and id's of all the channels you want to scrape. You can add as little or as many as you want. But they all have to be from the server you used as the `referrer` in the previous step.
- Turn on developer settings in your discord account settings. This enables you to use the "copy channel id" option in a channel's context menu.
- Right click on the channel you want to scrape and click on "copy channel id". Paste this into the `channels.js` file in the `ID` field. Fill in the channel name in the `name` field.
- Next up, if it isn't already present, you need to create a folder called `output` in the root of the Discord-Scraper folder. This is where the output will be saved.
- Lastly, line 14 of the index.js file contains the date from when messages should be scraped. Meaning all messages after this date will be scraped. However, the messages are scraped in order of newest to oldest.

### Step 3: Setup your Node.js environment

- Install Node.js if you haven't already.
- Open a terminal in the Discord-Scraper folder and run `npm install`. This will install all the dependencies needed to run the code.

### Step 4: Run the code

- Open a terminal in the Discord-Scraper folder and run `node index.js`. This will start the scraping process. It will take a while depending on how many messages you're scraping.
- When all messages from a channel have been scraped the output will be saved in the `output` folder.
- The output is a json file with the name of the channel you scraped. The output saved after every channel contains all messages that have been scraped up until now so you can stop the process at any time and still have all the messages that have been scraped up until that point. Consider them checkpoints.
