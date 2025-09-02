// src/components/modals/justica_set_log_channel_modal.js
const prisma = require('../../prisma/client');
const { ChannelType } = require('discord.js');
module.exports = {
    customId: 'justica_set_log_channel_modal',
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        const channelId = interaction.fields.getTextInputValue('log_channel_id');
        const guildId = interaction.guild.id;
        try {
            const channel = await interaction.guild.channels.fetch(channelId);
            if (!channel || channel.type !== ChannelType.GuildText) {
                return interaction.editReply({ content: '❌ O ID fornecido não é de um canal de texto válido.' });
            }
            await prisma.guildConfig.upsert({
                where: { guildId },
                update: { punishmentLogChannelId: channel.id },
                create: { guildId, punishmentLogChannelId: channel.id },
            });
            await interaction.editReply(`✅ Canal de logs de punição definido para ${channel} com sucesso!`);
        } catch (error) {
            await interaction.editReply('❌ Ocorreu um erro. Verifique se o ID está correto.');
        }
    }
};