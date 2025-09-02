// src/components/buttons/justica_view_record_start.js
const { ActionRowBuilder, UserSelectMenuBuilder } = require('discord.js');

module.exports = {
    customId: 'justica_view_record_start',
    async execute(interaction) {
        const selectMenu = new ActionRowBuilder()
            .addComponents(
                new UserSelectMenuBuilder()
                    .setCustomId('justica_select_user_for_record')
                    .setPlaceholder('Selecione o membro para consultar a ficha...')
            );

        await interaction.reply({
            content: 'Por favor, selecione o membro cuja ficha criminal você deseja consultar:',
            components: [selectMenu],
            ephemeral: true
        });
    }
};