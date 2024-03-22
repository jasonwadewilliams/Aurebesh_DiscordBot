require('dotenv').config();
const { REST, Routes, ApplicationCommandOptionType } = require('discord.js');

const commands = [
    {
        name: 'aurebesh',
        description: 'Translates a message to Aurebesh.',
        options: [
            {
                name: 'input',
                description: 'Test to be translated.',
                type: ApplicationCommandOptionType.String,
                required: true,
            },
        ]
    },
    {
        name: 'help',
        description: 'Display Aurebesh translation key.'
    },
];

const rest = new REST({ version: '10'}).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log('Registering slash commands...');

        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID,
            process.env.GUILD_ID),
            { body: commands }
        )
        
        console.log('Slash commands were registered successfully!');
    } catch (error) {
        console.log(`Error occured: ${error}`)
    }
})();