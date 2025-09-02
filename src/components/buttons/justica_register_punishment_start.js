// src/components/buttons/justica_register_punishment_start.js
const { ActionRowBuilder, UserSelectMenuBuilder } = require('discord.js');

module.exports = {
    customId: 'justica_register_punishment_start',
    async execute(interaction) {
        const selectMenu = new ActionRowBuilder()
            .addComponents(
                new UserSelectMenuBuilder()
                    .setCustomId('justica_select_user_for_punishment')
                    .setPlaceholder('Selecione o membro a ser punido...')
            );

        await interaction.reply({
            content: 'Selecione o membro que cometeu a infração:',
            components: [selectMenu],
            ephemeral: true
        });
    }
};