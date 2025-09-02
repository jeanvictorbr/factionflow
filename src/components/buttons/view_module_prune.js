// src/components/buttons/view_module_prune.js
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const prisma = require('../../prisma/client');

module.exports = {
    customId: 'view_module_prune',
    async execute(interaction) {
        if (!interaction.guild) return;
        await interaction.deferUpdate();
        
        const config = await prisma.guildConfig.findUnique({ where: { guildId: interaction.guild.id } });
        const immunityRole = config?.pruneImmunityRoleId ? `✅ <@&${config.pruneImmunityRoleId}>` : '`⚠️ Não Definido`';
        const inviteLink = config?.pruneInviteLink ? `✅ Configurado` : '`⚠️ Usando Padrão`';

        const embed = new EmbedBuilder()
            .setColor('#7f8c8d')
            .setTitle('🧹 Módulo de Depuração de Membros')
            .setDescription('Ferramentas para identificar e remover membros inativos do servidor, mantendo a facção ágil e operacional.')
            .addFields(
                { name: '📡 Iniciar Varredura', value: 'Começa o processo de análise de inatividade por mensagens.' },
                { name: '🛡️ Configurar Cargo de Imunidade', value: `Membros com este cargo serão ignorados pela varredura.\n*Atual: ${immunityRole}*` },
                { name: '🔗 Editar Link de Convite', value: `Define o link enviado na DM para membros removidos.\n*Atual: ${inviteLink}*` }
            )
            .setFooter({ text: 'A execução da limpeza é uma ação irreversível.' });

        const row1 = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('prune_action_start_scan').setLabel('Iniciar Varredura').setStyle(ButtonStyle.Danger).setEmoji('📡'),
            new ButtonBuilder().setCustomId('prune_config_immunity_role').setLabel('Cargo de Imunidade').setStyle(ButtonStyle.Primary).setEmoji('🛡️'),
            new ButtonBuilder().setCustomId('prune_config_invite').setLabel('Link de Convite').setStyle(ButtonStyle.Primary).setEmoji('🔗'), // NOVO BOTÃO
            require('./rpainel_view_registros').getBackButton()
        );

        await interaction.editReply({ embeds: [embed], components: [row1] });
    }
};