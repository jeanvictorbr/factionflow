// src/components/buttons/justica_delete_all_records_confirm.js
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    customId: 'justica_delete_all_records_confirm',
    async execute(interaction) {
        const targetUserId = interaction.customId.split('_').pop();
        const member = await interaction.guild.members.fetch(targetUserId).catch(() => null);

        const confirmButtons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`justica_delete_all_records_execute_${targetUserId}`)
                    .setLabel('Sim, tenho certeza!')
                    .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId('cancel_action') // Um botão genérico para cancelar
                    .setLabel('Cancelar')
                    .setStyle(ButtonStyle.Secondary)
            );

        await interaction.reply({
            content: `🔥 **ATENÇÃO!** Você tem certeza que deseja excluir **TODOS** os registros de punição de ${member}? Esta ação é irreversível.`,
            components: [confirmButtons],
            ephemeral: true
        });
    }
};