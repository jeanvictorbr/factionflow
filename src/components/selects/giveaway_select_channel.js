const { ActionRowBuilder, RoleSelectMenuBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
module.exports = {
    customId: 'giveaway_select_channel',
    async execute(interaction) {
        const channelId = interaction.values[0];
        const roleMenu = new ActionRowBuilder().addComponents(new RoleSelectMenuBuilder().setCustomId(`giveaway_select_role_${channelId}`).setPlaceholder('Selecione um cargo requerido (opcional)...'));
        const noRoleButton = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId(`giveaway_select_role_${channelId}_none`).setLabel('Nenhum cargo requerido').setStyle(ButtonStyle.Secondary));
        await interaction.update({ content: `**(Passo 2/3)** Canal selecionado: <#${channelId}>.\nAgora, selecione um cargo como requisito (ou pule).`, components: [roleMenu, noRoleButton] });
    }
};