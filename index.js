const config = require("./config.json");
const discord = require("discord.js");
const client = new discord.Client();
const Trello = require("trello");
const trello = new Trello("d40916286a14c6655c32032dfb594d07",config.trelloToken);


client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", message => {
  if (message.author.bot) return;
  // This is where we'll put our code.
  if (message.content.indexOf(config.prefix) !== 0) return;
 
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
 
  if(command === 'help') {
    message.channel.send({embed: {
    color: 3447003,
    author: {
      name: client.user.username,
      icon_url: client.user.avatarURL
    },
    title: "Greetings!",
    description: "Hey! This is a bot created by dude for tbans! Any support or questions? Use the support link below!",
    fields: [{
        name: "Prefix",
        value: "The current prefix is `!`. Ask dude if you wish to change this."
      },
      {
        name: "Commands.",
        value: "The current commands are: `help` and `tban`.."
      },
      {
        name: "Support server.",
        value: "Here is the link for the support server: https://discord.gg/3GaYG48 . To view our ToS, [click here](https://dude-tech-tos.glitch.me/)"
      }
    ],
    timestamp: new Date(),
    footer: {
      icon_url: client.user.avatarURL,
      text: "Made for Aztro Hotels by Dude Technologies  | V1 BETA"
    }
  }
});
  } else
  if (command === 'tban') {
    if(!message.member.roles.some(r=>["TBan Permission"].includes(r.name)) )
            return message.channel.send({embed: {
                color: 15406156,
                description: "I don't think you have the facilities for that, big man. ",
                author: {
                    name: message.author.tag,
                    icon_url: message.author.displayAvatarURL
                }
            }});
   let targetUser = args[0];
   let banReason = args.slice(1).join(" ");
   let listID = "5e0103909d50d08a367a91b5";
  trello.addCard(targetUser, banReason, listID,
      function (error, trelloCard) {
          if (error) {
              console.log('An error occured with Trello card.')
            message.channel.send({embed: {
  color: 3447003,
  description: "An error occured! Please try again later or use the support server link."
}});
          }
          else {
              console.log('Added card:', trelloCard);
            message.channel.send({embed: {
    color: 3447003,
    author: {
      name: client.user.username,
      icon_url: client.user.avatarURL
    },
    title: "Trello ban card created!",
    description: "Card details:",
    fields: [{
        name: "Suspect:",
        value: targetUser
      },
      {
        name: "Ban Reason",
        value: banReason
      },
    ],
    timestamp: new Date(),
    footer: {
      icon_url: client.user.avatarURL,
      text: "Dude Technologies x Aztro Hotels| V1 BETA"
    }
  }
});
          }
      });
  }
});

client.login(config.token);
