require('dotenv').config();
const { Client, IntentsBitField, AttachmentBuilder }  = require('discord.js');
const nodeHtmlToImage = require('node-html-to-image');
const font2base64 = require('node-font2base64');
const puppeteerCore = require('puppeteer-core');


const myIntents = new IntentsBitField();
myIntents.add(  IntentsBitField.Flags.Guilds,
                IntentsBitField.Flags.GuildMembers,
                IntentsBitField.Flags.GuildMessages,
                IntentsBitField.Flags.MessageContent);

const client = new Client({ intents: myIntents });
var AUREBESH_TRANSLATION_KEY = 'https://ootinicast.com/aurebesh/Aurebesh.png'
const _aurebesh = font2base64.encodeToDataUrlSync('./font/Aurebesh.otf');
const _aurebesh_b = font2base64.encodeToDataUrlSync('./font/AurebeshBold.otf');
const _aurebesh_bi = font2base64.encodeToDataUrlSync('./font/AurebeshBoldItalic.otf');
const _aurebesh_i = font2base64.encodeToDataUrlSync('./font/AurebeshCondensedItalic.otf');
const _aurebesh_c = font2base64.encodeToDataUrlSync('./font/AurebeshCondensed.otf');





client.on('ready', onBotReady)
client.login(process.env.TOKEN)
client.on('interactionCreate', (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'aurebesh') {
        handle_interaction(interaction)
    }

    if (interaction.commandName === 'help') {
        interaction.reply({ content: AUREBESH_TRANSLATION_KEY, ephemeral: true})
    }
});






/********** EVENT FUNCTIONS **********/
function onBotReady() {
    console.log('Bot Ready')
}

async function handle_interaction(interaction) {
    interaction.deferReply()
    var text = interaction.options.get('input').value
    result = await prep_text(text)
    mentions = result[1]
    text = result[0]
    console.log(text)

    const html = get_html(text)
    // Use custom chromium-browser path for raspberry pi bug.
    // https://github.com/puppeteer/puppeteer/issues/10698
    if ('CUSTOM_CHROME_PATH' in process.env) {
        nodeHtmlToImage({ 
            html: html,
            puppeteer: puppeteerCore,
            puppeteerArgs: {
                executablePath: process.env.CUSTOM_CHROME_PATH,
            }
        }).then((image) => {post_image(image, interaction, mentions)});
    } else {
        nodeHtmlToImage({ 
            html: html,
        }).then((image) => {post_image(image, interaction, mentions)});
    }
}

async function post_image(image, interact, mentions) {
    console.log('Image created successfully!')
    const attachment = new AttachmentBuilder(image, { name: 'aurebesh.png',
                            description: 'Aurebesh translation' });
    try {
        if (mentions) {
            interact.editReply({files: [attachment] })
                .then( interact.followUp(mentions))
        } else {
            interact.editReply({files: [attachment] })
        }
    } catch {
        console.log("Error trying to reply to interaction")
    }
}

async function prep_text(text) {
    mention_ids = text.match(/<@(.*?)>/g);
    
    if (mention_ids) {
        console.log(mention_ids)
        user_ids = []
        for (var id of mention_ids) {
            id = id.replace(/</g, "").replace(/>/g, "").replace(/@/g, "")
            user_ids.push(id)
        }
        for (const user_id of user_ids) {
            text = await get_username(user_id, text)
        }
        // convert from list to a space separated string
        mention_ids = mention_ids.join(" ")
    }

    text = text.toLowerCase();
    text = text.replace(/th/g, String.fromCharCode(197));
    text = text.replace(/ch/g, String.fromCharCode(231));
    text = text.replace(/eo/g, String.fromCharCode(235));
    text = text.replace(/ng/g, String.fromCharCode(241));
    text = text.replace(/sh/g, String.fromCharCode(223));
    text = text.replace(/oo/g, String.fromCharCode(248));

    text = text.replace(/\*\*\*(.*?)\*\*\*/g, replace_bi);
    text = text.replace(/\*\*(.*?)\*\*/g, replace_b);
    text = text.replace(/\*(.*?)\*/g, replace_i);

    return [text, mention_ids]
}

async function get_username(user_id, text) {
    try {
        let user = await client.users.fetch(user_id)
        var name = String(user.displayName).toLowerCase()
        text = text.replace(user_id, name)
        text = text.replace(/<@(.*?)>/g, replace_mention)
    } catch {
        console.log("failed to fetch " + user_id)
    }
    return text
}

function replace_mention(text) {
    text = text.replace(/</g, "").replace(/>/g, "").replace(/@/g, "")
    var str = "<span style='color: rgb(29, 171, 245)'>" + text + "</span>"
    return str
}

function replace_i(text) {
    text = text.replace(/\*/g,"")
    var str = "<i>" + text + "</i>";
    return str;
}
function replace_b(text) {
    text = text.replace(/\*\*/g,"")
    var str = "<b>" + text + "</b>";
    return str;
}
function replace_bi(text) {
    text = text.replace(/\*\*\*/g,"")
    var str = "<b><i>" + text + "</i></b>";
    return str;
}

function get_html(_text) {
    return `
    <html>
        <head>
            <style>
                @font-face {
                    font-family: 'aurebesh';
                    src: url("${_aurebesh}") format('woff2');
                }
                @font-face {
                    font-family: 'aurebesh_bold';
                    src: url("${_aurebesh_b}") format('woff2');
                }
                @font-face {
                    font-family: 'aurebesh_bold_italic';
                    src: url("${_aurebesh_bi}") format('woff2');
                }
                @font-face {
                    font-family: 'aurebesh_italic';
                    src: url("${_aurebesh_i}") format('woff2');
                }
                @font-face {
                    font-family: 'aurebesh_condensed';
                    src: url("${_aurebesh_c}") format('woff2');
                }
                body {
                    background-color: rgb(49, 51, 56);
                    font-family: aurebesh;
                    color: rgb(200, 200, 200);
                    padding: 6px 10px;
                    position: relative;
                    display: inline-block;
                    border-radius: 8px;
                    text-align: left;
                    max-width: 350px;
                }
                b {
                    color: rgb(220, 220, 220);
                }
                i {
                    font-family: aurebesh_italic;
                }
                p {
                    color: rgb(29, 171, 245);
                    font-family: aurebesh_condensed;
                }
            </style>
        </head>
        <body>${_text}</body>
    <html>
    `
}
