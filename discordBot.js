require('dotenv').config();
const { Client, IntentsBitField, AttachmentBuilder }  = require('discord.js');
const nodeHtmlToImage = require('node-html-to-image');
const font2base64 = require('node-font2base64');


const myIntents = new IntentsBitField();
myIntents.add(  IntentsBitField.Flags.Guilds,
                IntentsBitField.Flags.GuildMembers,
                IntentsBitField.Flags.GuildMessages,
                IntentsBitField.Flags.MessageContent);

const client = new Client({ intents: myIntents });
var AUREBESH_TRANSLATION_KEY = 'https://ootinicast.com/aurebesh/Aurebesh.png'
const _data = font2base64.encodeToDataUrlSync('./font/Aurebesh.otf')



client.on('ready', onBotReady)
client.login(process.env.TOKEN)
client.on('interactionCreate', (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'aurebesh') {

        var _text = interaction.options.get('input').value;
        console.log(_text);
        interaction.deferReply();
        _text = prep_text(_text);
        const html = `
        <html>
            <head>
                <style>
                    @font-face {
                        font-family: 'aurebesh';
                        src: url("${_data}") format('woff2');
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
                </style>
            </head>
            <body>${_text}</body>
        <html>
        `
        nodeHtmlToImage({ 
            html: html
        }).then((image) => {
            console.log('Image created successfully!')
            const attachment = new AttachmentBuilder(image, { name: 'aurebesh2.png',
                                    description: 'Aurebesh translation' });
            interaction.editReply({ files: [attachment] });
            }
        );
    }

    if (interaction.commandName === 'help') {
        interaction.reply(AUREBESH_TRANSLATION_KEY)
    }
});

/********** EVENT FUNCTIONS **********/
function onBotReady() {
    console.log('Bot Ready')
}

function prep_text(text) {
    text = text.toLowerCase();
    text = text.replace(/th/g, String.fromCharCode(197));
    text = text.replace(/ch/g, String.fromCharCode(231));
    text = text.replace(/eo/g, String.fromCharCode(235));
    text = text.replace(/ng/g, String.fromCharCode(241));
    text = text.replace(/sh/g, String.fromCharCode(223));
    text = text.replace(/oo/g, String.fromCharCode(248));
    return text;
}
