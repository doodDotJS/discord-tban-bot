const config = require("./config.json");
const discord = require("discord.js");
const client = new discord.Client();
const Trello = require("trello");
const trello = new Trello(config.trelloAppKey,config.trelloToken);


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
    description: "Hey! This is a bot for tbans! Any support or questions? Use the support link below!",
    fields: [{
        name: "Prefix",
        value: `The current prefix is ${config.prefix}.`
      },
      {
        name: "Commands.",
        value: "The current commands are: `help` and `tban`."
      },
      {
        name: "Support server.",
        value: "Here is the link for the support server: https://discord.gg/3GaYG48."
      }
    ],
    timestamp: new Date(),
    footer: {
      icon_url: client.user.avatarURL,
      text: "Trello ban bot"
    }
  }
});
  } else
  if (command === 'tban') {
    if(!message.member.roles.some(r=>["TBan Permission"].includes(r.name)) )
            return message.channel.send({embed: {
                color: 15406156,
                description: "You do not have permission to run this command.",
                author: {
                    name: message.author.tag,
                    icon_url: message.author.displayAvatarURL
                }
            }});
   let targetUser = args[0];
    if (!targetUser) return  message.channel.send({embed: {
  color: 3447003,
  description: "Too few arguments given. `!tban [username:userid][reason]` **REMEMBER THE COLON BETWEEN THE USERNAME AND USERID**"
}});
   let banReason = args.slice(1).join(" ");
    if (!banReason) return  message.channel.send({embed: {
  color: 3447003,
  description: "Please put in a reason. If there isn't one, put a symbol to indicate this, like a dash(-)."
}});
   let listID = config.listID;
  trello.addCard(targetUser, banReason, listID,
      function (error, trelloCard) {
          if (error) {
              console.log('An error occured with Trello card.' + error)
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
      text: "Trello ban"
    }
  }
});
          }
      });
  }
});

client.login(config.token);
