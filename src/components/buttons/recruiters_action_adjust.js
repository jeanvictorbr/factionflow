// src/components/buttons/recruiters_action_adjust.js
const { ButtonInteraction, UserSelectMenuBuilder, ActionRowBuilder } = require('discord.js');
module.exports = {
    customId: 'recruiters_action_adjust',
    async execute(interaction) {
        const userSelect = new ActionRowBuilder().addComponents(
            new UserSelectMenuBuilder()
                .setCustomId('recruiters_select_adjust_user')
                .setPlaceholder('Selecione o recrutador para ajustar')
        );
        await interaction.reply({ content: 'Selecione o recrutador que você deseja remover o último registro de aprovação.', components: [userSelect], ephemeral: true });
    }
};