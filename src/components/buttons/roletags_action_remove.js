// src/components/buttons/roletags_action_remove.js
const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');
const prisma = require('../../prisma/client');
module.exports = {
    customId: 'roletags_action_remove',
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        const tags = await prisma.roleTag.findMany({ where: { guildId: interaction.guild.id } });
        if (tags.length === 0) return interaction.editReply({ content: 'Não há tags configuradas para remover.' });

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('roletags_select_remove')
            .setPlaceholder('Selecione a regra de tag para remover')
            .addOptions(tags.map(t => {
                const role = interaction.guild.roles.cache.get(t.roleId);
                return new StringSelectMenuOptionBuilder().setLabel(role ? role.name : `ID: ${t.roleId}`).setDescription(`TAG: ${t.tag}`).setValue(t.roleId);
            }));
        await interaction.editReply({ content: 'Selecione a regra de tag que deseja apagar permanentemente.', components: [new ActionRowBuilder().addComponents(selectMenu)] });
    }
};