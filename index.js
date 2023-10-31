const fetch = require("node-fetch");
const fs = require("fs");
const { stdout } = require("process");
const auth = require("./auth.json");

let currentChannel = -1;
let output = {
  channels: {},
};
let doneChannels = [];

const channels = require("./channels");
const channelsObj = channels.channelsObj;
const fetchStartDate = "2022-01-01T00:00:00.000000+00:00"; // New Year 2022

let startTime = Date.now();
let channelID;
let channelName;
let lastMessageID;

function getOlderMessages() {
  fetch(
    `https://discord.com/api/v9/channels/${channelID}/messages?limit=100` +
      (lastMessageID ? `&before=${lastMessageID}` : ""),
    {
      credentials: "include",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0",
        Accept: "*/*",
        "Accept-Language": "en-US",
        Authorization: `${auth.token}`,
        "X-Super-Properties": `${auth["X-Super-Properties"]}`,
        "Sec-GPC": "1",
      },
      referrer: `${auth.referrer}`,
      method: "GET",
      mode: "cors",
    }
  )
    .then(function (result) {
      return result.json();
    })
    .then(function (result) {
      if (result.length <= 0 || result.length === undefined) {
        console.log(`Got all messages from ${channelName.toUpperCase()}`);
        fs.writeFile(
          `./output/${channelName.split(" ").join("-")}.txt`,
          JSON.stringify(output, null, 2),
          function (err) {
            if (err) {
              return console.log(err);
            }
          }
        );
        console.log("Output of channel saved to file!");
        doneChannels.push(channelName);
        setupNextChannel();
        return;
      }

      let maxDateReached = false;

      for (let i = 0; i < result.length; i++) {
        if (new Date(result[i].timestamp) > new Date(fetchStartDate)) {
          // Here you can define which fields of the message you want to save
          let newMsg = {
            id: result[i].id, // REQUIRED
            // ype: result[i].type,
            // content: result[i].content,
            // channelID: result[i].channel_id,
            author: result[i].author.username,
            // attachments: result[i].attachments, // Not tested
            // embeds: result[i].embeds, // Not tested
            // mentions: result[i].mentions, // Not tested
            // mention_roles: result[i].mention_roles, // Not tested
            // pinned: result[i].pinned,
            // mention_everyone: result[i].mention_everyone, // Not tested
            // tts: result[i].tts, // Not tested
            reactions: result[i].reactions,
            timestamp: result[i].timestamp, // REQUIRED
            // edited_timestamp: result[i].edited_timestamp,
            // flags: result[i].flags, // Not tested
            // components: result[i].components, // Not tested
          };
          output.channels[channelName].push(newMsg);
        } else if (new Date(result[i].timestamp) <= new Date(fetchStartDate)) {
          maxDateReached = true;
        }
      }

      if (!maxDateReached) {
        lastMessageID = result[result.length - 1].id;
      } else {
        lastMessageID = -1;
      }

      process.stdout.write(
        output.channels[channelsObj[currentChannel].name].length + "\r"
      );

      currentTimeout = setTimeout(getOlderMessages, 2000); // 2 seconds is a safe delay between requests to not get rate limited
    });
}

function msToMinAndSec(millis) {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return (
    minutes + " mins and " + (seconds < 10 ? "0" : "") + seconds + " seconds"
  );
}

function setupNextChannel() {
  if (currentChannel < channelsObj.length - 1) {
    currentChannel++;
    output.channels[channelsObj[currentChannel].name] = [];

    lastMessageID = null;
    channelID = channelsObj[currentChannel].ID;
    channelName = channelsObj[currentChannel].name;

    console.clear();
    console.log(`${doneChannels.length}/${channelsObj.length} channels done.`);
    doneChannels.forEach((channel) => {
      console.log(channel);
    });

    // Render the progress bar
    console.log(
      `Overall progress:\n${"█".repeat(doneChannels.length)}${"▒".repeat(
        channelsObj.length - doneChannels.length
      )}\n`
    );
    console.log(
      `Current channel: ${channelName.toUpperCase()}\n# of messages downloaded:`
    );
    getOlderMessages();
  } else {
    console.log("DONE BOI");
    console.log(`Completed in ${msToMinAndSec(Date.now() - startTime)}`);
  }
}

console.clear();
setupNextChannel();
