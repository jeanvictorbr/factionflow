// src/components/buttons/view_module_justice.js
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const prisma = require('../../prisma/client');

module.exports = {
    customId: 'view_module_justice',
    async execute(interaction) {
        await interaction.deferUpdate();
        
        const config = await prisma.guildConfig.findUnique({ where: { guildId: interaction.guild.id } });
        const punishmentCount = await prisma.punishment.count({ where: { guildId: interaction.guild.id } });
        const blacklistCount = await prisma.blacklist.count({ where: { guildId: interaction.guild.id } });

        const logChannel = config?.justiceLogChannelId ? `✅ <#${config.justiceLogChannelId}>` : '`⚠️ Não Definido`';
        const advRolesStatus = (config?.adv1RoleId && config?.adv2RoleId && config?.adv3RoleId) ? '✅ Configurados' : '`⚠️ Incompleto`';

        const embed = new EmbedBuilder()
            .setColor('#c0392b')
            .setTitle('⚖️ Central de Conduta e Segurança')
            .setImage('https://i.imgur.com/eKYcAyL.gif')
            .setDescription('Interface de controle para o sistema de justiça e segurança da facção.')
            .addFields(
                { name: 'Registros Disciplinares', value: `\`\`\`${punishmentCount} infrações\`\`\``, inline: true },
                { name: 'Indivíduos na Blacklist', value: `\`\`\`${blacklistCount} banidos\`\`\``, inline: true },
                { name: '\u200B', value: '\u200B' }, // Espaçador
                { name: 'Canal de Logs', value: logChannel, inline: true },
                { name: 'Cargos de Advertência', value: advRolesStatus, inline: true }
            )
            .setFooter({ text: 'A disciplina é a fundação do poder.' });

        const row1 = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('justice_action_punish').setLabel('Aplicar Punição').setStyle(ButtonStyle.Danger).setEmoji('➕'),
            new ButtonBuilder().setCustomId('justice_action_lookup').setLabel('Consultar Histórico').setStyle(ButtonStyle.Primary).setEmoji('🔍'), // NOVO BOTÃO
            new ButtonBuilder().setCustomId('justice_manage_blacklist').setLabel('Gerenciar Blacklist').setStyle(ButtonStyle.Secondary).setEmoji('🚫')
        );
        const row2 = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('justice_set_log_channel').setLabel('Config. Canal').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('justice_set_adv_roles').setLabel('Config. Cargos de Adv').setStyle(ButtonStyle.Secondary),
            require('./rpainel_view_registros').getBackButton()
        );

        await interaction.editReply({ embeds: [embed], components: [row1, row2] });
    }
};