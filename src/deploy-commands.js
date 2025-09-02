// src/deploy-commands.js
const { REST, Routes } = require('discord.js');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();

// Verifica se as variáveis essenciais estão presentes no .env
if (!process.env.DISCORD_TOKEN || !process.env.CLIENT_ID || !process.env.GUILD_ID) {
    console.error("ERRO: As variáveis DISCORD_TOKEN, CLIENT_ID e GUILD_ID precisam estar definidas no arquivo .env");
    process.exit(1); // Encerra o script se algo estiver faltando
}

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    if (command.data) {
        commands.push(command.data.toJSON());
    }
}

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        console.log(`Iniciando a atualização de ${commands.length} comandos (/) para a GUILD: ${process.env.GUILD_ID}.`);

        // AQUI ESTÁ A MUDANÇA
        // Em vez de 'applicationCommands', usamos 'applicationGuildCommands'
        // que exige o ID do cliente e o ID do servidor.
        const data = await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commands },
        );

        console.log(`Sucesso! ${data.length} comandos (/) foram recarregados na guild.`);
    } catch (error) {
        console.error(error);
    }
})();