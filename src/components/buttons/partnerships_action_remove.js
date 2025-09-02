// src/components/buttons/partnerships_action_remove.js
const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');
const prisma = require('../../prisma/client');

module.exports = {
    customId: 'partnerships_action_remove',
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        const partners = await prisma.partnership.findMany({ where: { guildId: interaction.guild.id }, take: 25 });

        if (partners.length === 0) {
            return interaction.editReply({ content: 'Não há parceiros registrados para remover.' });
        }

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('partnerships_select_remove')
            .setPlaceholder('Selecione o parceiro para remover')
            .addOptions(
                partners.map(p => 
                    new StringSelectMenuOptionBuilder()
                        .setLabel(p.name)
                        .setDescription(`ID: ${p.id}`)
                        .setValue(p.id)
                )
            );
        
        await interaction.editReply({
            content: 'Selecione no menu abaixo a parceria que deseja encerrar e remover da lista.',
            components: [new ActionRowBuilder().addComponents(selectMenu)]
        });
    }
};