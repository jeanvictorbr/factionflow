// src/components/buttons/justica_manage_rules.js
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder } = require('discord.js');
const prisma = require('../../prisma/client');

module.exports = {
    customId: 'justica_manage_rules',
    async execute(interaction) {
        await interaction.deferUpdate();
        const rules = await prisma.rule.findMany({ where: { guildId: interaction.guild.id }, orderBy: { ruleCode: 'asc' } });

        const embed = new EmbedBuilder()
            .setColor('#1ABC9C')
            .setTitle('📜 Gerenciador do Código Penal')
            .setDescription('Selecione uma regra no menu abaixo para gerenciá-la (definir cargo, editar, etc.), ou adicione uma nova regra.');

        rules.forEach(rule => {
            embed.addFields({ 
                name: `[${rule.ruleCode}] ${rule.description}`, 
                value: `**Punição:** ${rule.defaultPunishmentType} ${rule.defaultDurationMinutes ? `(${rule.defaultDurationMinutes}m)` : ''}\n**Cargo Temp:** ${rule.temporaryRoleId ? `<@&${rule.temporaryRoleId}>` : '`Nenhum`'}` 
            });
        });

        const components = [];
        if (rules.length > 0) {
            const selectMenu = new ActionRowBuilder().addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('justica_select_rule_to_manage') // Novo ID
                    .setPlaceholder('Selecione uma regra para gerenciar...')
                    .addOptions(rules.map(rule => ({
                        label: `[${rule.ruleCode}] ${rule.description.substring(0, 80)}`,
                        value: rule.id // O valor é o ID da regra no banco
                    })))
            );
            components.push(selectMenu);
        }

        const buttons = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('justica_add_rule').setLabel('Adicionar Nova Regra').setStyle(ButtonStyle.Success),
            new ButtonBuilder().setCustomId('justica_config_panel').setLabel('Voltar').setStyle(ButtonStyle.Secondary)
        );
        components.push(buttons);

        await interaction.editReply({ embeds: [embed], components });
    }
};