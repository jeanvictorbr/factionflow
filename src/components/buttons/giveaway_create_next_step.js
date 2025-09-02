const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    customId: 'giveaway_create_next_step',
    async execute(interaction) {
        const channelSelect = interaction.message.components[0].components[0];
        const roleSelect = interaction.message.components[1].components[0];
        const channelId = channelSelect.values?.[0];
        const roleId = roleSelect.values?.[0] || 'none';

        if (!channelId) {
            return interaction.reply({ content: '❌ Você precisa selecionar um canal para postar o sorteio!', ephemeral: true, components: [] });
        }

        const modal = new ModalBuilder()
            .setCustomId(`giveaway_create_final_${channelId}_${roleId}`)
            .setTitle('Finalizar Criação de Sorteio');
        
        const durationInput = new TextInputBuilder().setCustomId('g_duration').setLabel('Duração (ex: 10m, 1h, 3d)').setStyle(TextInputStyle.Short).setRequired(true);
        const winnersInput = new TextInputBuilder().setCustomId('g_winners').setLabel('Número de Vencedores').setStyle(TextInputStyle.Short).setRequired(true);
        const prizeInput = new TextInputBuilder().setCustomId('g_prize').setLabel('Prêmio').setStyle(TextInputStyle.Paragraph).setRequired(true);

        modal.addComponents(
            new ActionRowBuilder().addComponents(durationInput),
            new ActionRowBuilder().addComponents(winnersInput),
            new ActionRowBuilder().addComponents(prizeInput)
        );
        
        await interaction.showModal(modal);
    }
};