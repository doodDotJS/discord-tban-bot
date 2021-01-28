const config = require("./config.json");
const discord = require("discord.js");
const client = new discord.Client();
const Trello = require("trello");
const trello = new Trello(config.trelloAppKey, config.trelloToken);

client.on("ready", () => {
  console.log("I am ready!");
  client.user.setPresence({ activity: { name: 'trello bans' }, status: 'online' })
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
    description: "Hey! This is a bot for tbans! Any support or questions? Use the support link below!",
    fields: [{
        name: "Prefix",
        value: `The current prefix is ${config.prefix}. `
      },
      {
        name: "Commands.",
        value: "The current commands are: `help`,`tban`, and `misc`"
      },
      {
        name: "Support server.",
        value: "Here is the link for the support server of the original bot scripter: https://discord.gg/3GaYG48."
      }
    ],
    timestamp: new Date(),
    footer: {
      icon_url: client.user.avatarURL,
      text: "Trello Bans"
    }
  }
});
  } else
  if (command === 'tban') {
    if(!message.member.roles.cache.some(role => role.name === 'TBan Permission')) 
            return message.channel.send({embed: {
                color: 15406156,
                description: "You do not have permission to use this command.",
                author: {
                    name: message.author.tag,
                    icon_url: message.author.displayAvatarURL
                }
            }});
    let suspect = args[0]
    if (!suspect) {
       return message.channel.send({embed: {
                color: 15406156,
                description: "Use this format: `!tban [Username:UserID][banReason]`",
                author: {
                    name: message.author.tag,
                    icon_url: message.author.displayAvatarURL
                }
            }}); 
    };
    let reason = args.slice(1).join(" ");
    if (!reason) {
       return message.channel.send({embed: {
                color: 15406156,
                description: "Use this format: `!tban [Username:UserID][banReason]`",
                author: {
                    name: message.author.tag,
                    icon_url: message.author.displayAvatarURL
                }
            }}); 
    };
      trello.addCard(suspect, reason, config.listID,
      function (error, trelloCard) {
          if (error) {
              console.log("An error occured", error)
               return message.channel.send({embed: {
                color: 15406156,
                description: "An error occured. Please try again later. \n ERROR:" + error,
                author: {
                    name: message.author.tag,
                    icon_url: message.author.displayAvatarURL
                }
            }}); 
          }
          else {
              console.log('Added card:', trelloCard);
              return message.channel.send({embed: {
    color: 3447003,
    author: {
      name: client.user.username,
      icon_url: client.user.avatarURL
    },
    title: "Trello ban card created!",
    description: "Card details:",
    fields: [{
        name: "Suspect:",
        value: suspect,
      },
      {
        name: "Ban Reason",
        value: reason,
      },
    ],
    timestamp: new Date(),
    footer: {
      icon_url: client.user.avatarURL,
      text: "Trello Bans."
    }
  }
});
          }
      });
  }else;
  if (command === 'misc') {
     message.channel.send("My uptime is: `" + client.uptime + "ms` \nMy ping is: `" + client.ws.ping + "ms`");
   }
});

client.login(config.token)
