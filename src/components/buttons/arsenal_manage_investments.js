// src/components/buttons/arsenal_manage_investments.js
const { ButtonInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
module.exports = {
    customId: 'arsenal_manage_investments',
    async execute(interaction) {
        const embed = new EmbedBuilder().setColor('#2ecc71').setTitle('💸 Gestão de Investimentos').setDescription('Adicione ou remova os registros de gastos da facção.');
        const buttons = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('arsenal_add_investment').setLabel('Adicionar').setStyle(ButtonStyle.Success).setEmoji('➕'),
            new ButtonBuilder().setCustomId('arsenal_list_investments').setLabel('Listar').setStyle(ButtonStyle.Secondary).setEmoji('📋'), // NOVO
            new ButtonBuilder().setCustomId('arsenal_remove_investment').setLabel('Apagar Específico').setStyle(ButtonStyle.Primary).setEmoji('➖'), // NOVO
            new ButtonBuilder().setCustomId('arsenal_reset_investments').setLabel('Resetar Tudo').setStyle(ButtonStyle.Danger).setEmoji('🗑️')
        );
         const backButton = new ActionRowBuilder().addComponents(
             new ButtonBuilder().setCustomId('arsenal_action_view_stats').setLabel('Voltar').setStyle(ButtonStyle.Secondary).setEmoji('⬅️')
         );
        await interaction.update({ embeds: [embed], components: [buttons, backButton] });
    }
};