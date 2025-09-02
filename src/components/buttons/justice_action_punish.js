// src/components/buttons/justice_action_punish.js
const { EmbedBuilder, ActionRowBuilder, UserSelectMenuBuilder } = require('discord.js');
module.exports = {
    customId: 'justice_action_punish',
    async execute(interaction) {
        const embed = new EmbedBuilder().setColor('#f1c40f').setTitle('⚖️ Aplicar Punição (Passo 1/4)').setDescription('Selecione no menu abaixo o membro que receberá a ação disciplinar.');
        const userSelect = new ActionRowBuilder().addComponents(new UserSelectMenuBuilder().setCustomId('justice_select_user').setPlaceholder('Selecione o membro a ser punido...'));
        await interaction.reply({ embeds: [embed], components: [userSelect], ephemeral: true });
    }
};