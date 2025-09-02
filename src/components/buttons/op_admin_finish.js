// src/components/buttons/op_admin_finish.js
const { PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    customId: 'op_admin_finish',
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return interaction.reply({ content: 'Apenas a liderança pode finalizar uma operação.', ephemeral: true });
        }

        const operationId = interaction.customId.split('_')[3];

        const embed = new EmbedBuilder()
            .setColor('#f1c40f')
            .setTitle('🏁 Registrar Resultado da Operação')
            .setDescription('Qual foi o resultado desta operação? Esta ação irá marcá-la como **CONCLUÍDA**.');

        const outcomeButtons = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId(`op_set_outcome_vencemos_${operationId}`).setLabel('Vencemos').setStyle(ButtonStyle.Success).setEmoji('🏆'),
            new ButtonBuilder().setCustomId(`op_set_outcome_perdemos_${operationId}`).setLabel('Perdemos').setStyle(ButtonStyle.Danger).setEmoji('💔'),
            new ButtonBuilder().setCustomId(`op_set_outcome_sem-resultado_${operationId}`).setLabel('Finalizar sem Resultado').setStyle(ButtonStyle.Secondary)
        );

        await interaction.reply({ embeds: [embed], components: [outcomeButtons], ephemeral: true });
    }
};