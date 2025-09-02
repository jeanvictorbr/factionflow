// src/components/buttons/sentinel_toggle_status.js
const { ButtonInteraction, MessageFlags } = require('discord.js');
const prisma = require('../../prisma/client');
const viewSentinelModule = require('./view_module_sentinel');

module.exports = {
    customId: 'sentinel_toggle_status',
    async execute(interaction) {
        // Remover a linha deferUpdate() daqui para evitar o erro de dupla resposta.
        
        const guildId = interaction.guild.id;
        const config = await prisma.guildConfig.findUnique({ where: { guildId } });

        await prisma.guildConfig.update({
            where: { guildId },
            data: { reportEnabled: !config.reportEnabled },
        });

        // Chamar a função de visualização do módulo para renderizar o estado atualizado.
        await viewSentinelModule.execute(interaction);
    },
};