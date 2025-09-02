// src/components/buttons/prune_action_execute.js
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
module.exports = {
    customId: 'prune_action_execute',
    async execute(interaction) {
        const days = interaction.customId.split('_')[3];
        
        const embed = new EmbedBuilder()
            .setColor('#e74c3c')
            .setTitle('🚨 CONFIRMAÇÃO FINAL 🚨')
            .setDescription(`Você está prestes a expulsar todos os membros inativos há mais de **${days} dias**.\n\n**ESTA AÇÃO É IRREVERSÍVEL.**\n\n- O bot enviará uma DM para cada membro antes de expulsá-lo.\n- Membros com o cargo de imunidade serão poupados.\n\nTem certeza que deseja continuar?`);

        const confirmButtons = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId(`prune_confirm_execute_${days}`).setLabel('SIM, EXECUTAR LIMPEZA').setStyle(ButtonStyle.Danger),
            new ButtonBuilder().setCustomId('cancel_action').setLabel('Cancelar').setStyle(ButtonStyle.Secondary)
        );
        await interaction.reply({ embeds: [embed], components: [confirmButtons], ephemeral: true });
    }
};