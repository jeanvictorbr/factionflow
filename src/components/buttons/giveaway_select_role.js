const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
module.exports = {
    customId: 'giveaway_select_role',
    async execute(interaction) {
        const customIdParts = interaction.customId.split('_');
        const channelId = customIdParts[3];
        const roleId = interaction.isButton() ? 'none' : interaction.values[0];
        const modal = new ModalBuilder().setCustomId(`giveaway_create_final_${channelId}_${roleId}`).setTitle('Finalizar Criação de Sorteio');
        const durationInput = new TextInputBuilder().setCustomId('g_duration').setLabel('Duração (ex: 10m, 1h, 3d)').setStyle(TextInputStyle.Short).setRequired(true);
        const winnersInput = new TextInputBuilder().setCustomId('g_winners').setLabel('Número de Vencedores').setStyle(TextInputStyle.Short).setValue('1').setRequired(true);
        const prizeInput = new TextInputBuilder().setCustomId('g_prize').setLabel('Prêmio').setStyle(TextInputStyle.Paragraph).setRequired(true);
        modal.addComponents(new ActionRowBuilder().addComponents(durationInput), new ActionRowBuilder().addComponents(winnersInput), new ActionRowBuilder().addComponents(prizeInput));
        await interaction.showModal(modal);
    }
};