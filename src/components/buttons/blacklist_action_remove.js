// src/components/buttons/blacklist_action_remove.js
const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');
const prisma = require('../../prisma/client');

module.exports = {
    customId: 'blacklist_action_remove',
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        const blacklist = await prisma.blacklist.findMany({
            where: { guildId: interaction.guild.id },
            take: 25
        });

        if (blacklist.length === 0) {
            return interaction.editReply({ content: 'A blacklist está vazia. Não há ninguém para remover.' });
        }

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('blacklist_select_remove')
            .setPlaceholder('Selecione o indivíduo para remover da blacklist')
            .addOptions(
                blacklist.map(entry =>
                    new StringSelectMenuOptionBuilder()
                        .setLabel(`ID: ${entry.userId}`)
                        .setDescription(entry.reason.slice(0, 100))
                        .setValue(entry.userId)
                )
            );
        
        await interaction.editReply({
            content: 'Selecione no menu abaixo quem você deseja perdoar e remover da lista negra.',
            components: [new ActionRowBuilder().addComponents(selectMenu)]
        });
    }
};