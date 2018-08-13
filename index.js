const Discord = require("discord.js");
const { Client } = require('discord.js');
const client = new Client({ disableEveryone: true});
let prefix = 'R!'
const ms = require('ms');
const moment = require('moment');
const node = {};
client.on(`ready`, () => console.log(`Ready!`))

client.on('voiceStateUpdate',async function(oldmember, member) {
if(member.user.bot) return;
if(member.voiceChannel === undefined && node[member.id]) {
console.log(member.guild.members.filter(m => m.voiceChannelID === node[member.id].channel).size)
if(member.guild.members.filter(m => m.voiceChannelID === node[member.id].channel).size < 1) {
member.guild.channels.get(node[member.id].channel).delete();
node[member.id].channel = undefined;
}
}
if(oldmember.voiceChannel !== undefined || member.voiceChannel !== undefined) {
if(member.voiceChannelID === '478010154919395329') {
member.guild.createChannel(member.displayName, "voice", [{
id: member.id,
allow: ['CONNECT'],
}, {
id: member.guild.id,
deny: ['CONNECT']
}]).then((channel)=> {
    const parent = member.guild.channels.get('478010154919395329').parentID
    channel.setParent(parent);
    if(!node[member.id]) node[member.id] = {
        channel: channel.id,
        }
member.user.send(`Hey **${member.displayName}** I've created a channel for you!
------------------------------------------------------------
Use \`\`!unlock [@user | all]\`\` to unlock for a specify or for all.
Use \`\`!lock [@user | all]\`\` to lock & kick for a specify or for all in your voice channel.
Use \`\`!rename [new name]\`\` to rename your voice channel name.
------------------------------------------------------------
`)
member.setVoiceChannel(channel.id);
})
} else return undefined;
}
});
 
client.on(`message`, async message => {
let args = message.content.trim().split(" ").slice(1); //substring(prefix.length) before split(" ") if you had a prefix.
let user = message.mentions.users.first();
if(message.content.startsWith("!unlock")) {
if(node[message.author.id] !== undefined) {
if(user) {
if(message.guild.channels.get(node[message.author.id].channel).permissionsFor(user.id).has(`CONNECT`)) return message.channel.send(`**The user already can connect to your voice channel**\n to lock & kick user use \`\`!lock\`\` `);
message.guild.channels.get(node[message.author.id].channel).overwritePermissions(user.id, {
CONNECT: true
}).then(message.channel.send(`**${user.username}** can connect to your room now!`))
}
else if(args.includes("all")) {
message.guild.channels.get(node[message.author.id].channel).overwritePermissions(message.guild.id, {
CONNECT: true
}).then(message.channel.send("**Everyone** can connect to your room now!"));
} else return message.channel.send(`**Usage: !unlock [all | @user]**`)
}
}
if(message.content.startsWith("!lock")) {
if(node[message.author.id] !== undefined) {
if(user) {
if(!message.guild.channels.get(node[message.author.id].channel).permissionsFor(user.id).has(`CONNECT`)) return message.channel.send(`**The user already cannot connect to your voice channel**`);
try {
if(message.guild.members.get(user.id).voiceChannelID === node[message.author.id].channel) {
message.guild.members.get(user.id).setVoiceChannel('478010498978152448'); // المكان الي راح ينحطوله بعد ما يصير لهم lock
}  
} catch (error) {
console.log(error)
}
message.guild.channels.get(node[message.author.id].channel).overwritePermissions(user.id, {
CONNECT: false
}).then(message.channel.send(`:x: **${user.username}** cannot connect to your room now!`))
}
else if(args.includes("all")) {
message.guild.channels.get(node[message.author.id].channel).overwritePermissions(message.guild.id, {
CONNECT: false
}).then(message.channel.send(":x: **Everyone** cannot connect to your room now!"));
} else return message.channel.send(`**Usage: !lock [all | @user]**`)
}  
}
if(message.content.startsWith("!rename")) {
if(node[message.author.id] !== undefined) {
if(args.length <= 0) return message.channel.send(`:scroll: **Hmmm the name please*`);
if(message.content.length > 7+15) return message.channel.send(`:x: It appears that's the max letters allowed is **15**.`)
const oldName = await message.guild.channels.get(node[message.author.id].channel).name
message.channel.send(`:pencil2: Renamed **\`\`${oldName}\`\`** to **\`\`${args.join(" ").toString()}\`\`** alright?`)
message.guild.channels.get(node[message.author.id].channel).setName(args.join(" ").toString());
}
 }
});











client.login(process.env.AKA)
