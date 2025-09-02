// src/components/selects/arsenal_select_log_channel.js
const { ChannelSelectMenuInteraction } = require('discord.js');
const prisma = require('../../prisma/client');

module.exports = {
    customId: 'arsenal_select_log_channel',
    async execute(interaction) {
        const channelId = interaction.values[0];

        // O comando 'upsert' cria a configuração se não existir, ou atualiza se já existir.
        await prisma.guildConfig.upsert({
            where: { guildId: interaction.guild.id },
            update: { salesLogChannelId: channelId },
            create: { guildId: interaction.guild.id, salesLogChannelId: channelId },
        });

        // Edita a mensagem de seleção para dar um feedback claro e limpa os componentes.
        await interaction.update({
            content: `✅ Canal de logs de vendas definido com sucesso para <#${channelId}>!`,
            components: [],
        });
    }
};