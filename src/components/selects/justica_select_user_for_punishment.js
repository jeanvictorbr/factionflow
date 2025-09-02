// src/components/selects/justica_select_user_for_punishment.js
const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const prisma = require('../../prisma/client');

module.exports = {
    customId: 'justica_select_user_for_punishment',
    async execute(interaction) {
        const targetUserId = interaction.values[0]; // ID do usuário selecionado

        const rules = await prisma.rule.findMany({
            where: { guildId: interaction.guild.id },
            orderBy: { ruleCode: 'asc' },
            take: 25 // Limite de 25 opções por menu
        });

        if (rules.length === 0) {
            return interaction.reply({ content: '❌ Nenhuma regra foi configurada no Código Penal ainda.', ephemeral: true });
        }

        const selectMenu = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId(`justica_select_rule_for_${targetUserId}`) // Passa o ID do usuário no customId
                    .setPlaceholder('Selecione a regra que foi violada...')
                    .addOptions(rules.map(rule => ({
                        label: `[${rule.ruleCode}] ${rule.description.substring(0, 80)}`,
                        value: rule.id
                    })))
            );
        
        await interaction.reply({
            content: `Agora, selecione a regra que <@${targetUserId}> violou:`,
            components: [selectMenu],
            ephemeral: true
        });
    }
};