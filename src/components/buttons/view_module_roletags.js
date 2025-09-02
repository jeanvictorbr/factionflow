// src/components/buttons/view_module_roletags.js
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const prisma = require('../../prisma/client');

module.exports = {
    customId: 'view_module_roletags',
    async execute(interaction) {
        // ===============================================
        // VERIFICAÇÃO DE SEGURANÇA ADICIONADA
        // ===============================================
        if (!interaction.guild) {
            console.error("A interação 'view_module_roletags' foi recebida sem o contexto do servidor.");
            return; // Aborta a execução para evitar o crash
        }

        await interaction.deferUpdate();
        
        const tags = await prisma.roleTag.findMany({ 
            where: { guildId: interaction.guild.id },
        });

        const sortedTags = tags.sort((a, b) => {
            const roleA = interaction.guild.roles.cache.get(a.roleId);
            const roleB = interaction.guild.roles.cache.get(b.roleId);
            if (!roleA || !roleB) return 0;
            return roleB.position - roleA.position;
        });

        let tagListString = sortedTags
            .map(t => {
                const role = interaction.guild.roles.cache.get(t.roleId);
                return role ? `> ${role} → \`${t.tag}\`` : `> Cargo Deletado (\`${t.roleId}\`)`;
            })
            .join('\n');

        if (tags.length === 0) {
            tagListString = '> Nenhuma regra de tag configurada.';
        }

        const embed = new EmbedBuilder()
            .setColor('#95a5a6')
            .setTitle('✍️ Dashboard de Tags Dinâmicas')
            .setDescription('Gerencie as tags que serão aplicadas automaticamente aos apelidos dos membros. A prioridade é definida pela **posição do cargo** na hierarquia do servidor.')
            .setImage('https://i.imgur.com/X3WS4en.gif')
            .addFields({ name: 'Regras de Tag Ativas (Ordenadas por Prioridade)', value: tagListString });

        const row1 = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('roletags_action_manage').setLabel('Criar / Editar Tag').setStyle(ButtonStyle.Success).setEmoji('➕'),
            new ButtonBuilder().setCustomId('roletags_action_remove').setLabel('Remover Tag').setStyle(ButtonStyle.Danger).setEmoji('➖'),
            new ButtonBuilder().setCustomId('roletags_action_set_all').setLabel('Sincronizar Todos').setStyle(ButtonStyle.Primary).setEmoji('🔄')
        );
        const row2 = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('rpainel_view_registros')
                .setLabel('Voltar para Módulos')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('⬅️')
        );

        await interaction.editReply({ embeds: [embed], components: [row1, row2] });
    }
};