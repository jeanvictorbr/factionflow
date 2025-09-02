// src/components/buttons/view_module_operations.js
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const prisma = require('../../prisma/client');
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

module.exports = {
    customId: 'view_module_operations',
    async execute(interaction) {
        await interaction.deferUpdate();
        const logEmbed = new EmbedBuilder().setColor('#2c3e50').setTitle('[ ACESSANDO CENTRAL DE OPERAÇÕES... ]');
        await interaction.editReply({ embeds: [logEmbed.setDescription('`[ 📡 Puxando dados de operações... ]`')], components: [] });
        
        const scheduledOps = await prisma.operation.count({ where: { guildId: interaction.guild.id, status: 'AGENDADA' } });
        const ongoingOps = await prisma.operation.count({ where: { guildId: interaction.guild.id, status: 'EM ANDAMENTO' } });
        const completedOps = await prisma.operation.count({ where: { guildId: interaction.guild.id, status: 'CONCLUÍDA' } }); // NOVA BUSCA
        await sleep(1000);

        const finalEmbed = new EmbedBuilder()
            .setColor('#3498db')
            .setTitle('🎯 Central de Operações')
            .setImage('https://i.imgur.com/O6ixzSJ.gif') // Imagem adicionada para imersão
            .setDescription('`***Agende, edite e gerencie todas as missões e eventos da facção***`')
            .addFields(
                // CAMPOS ATUALIZADOS COM CORES
                { name: 'Agendadas', value: `\`\`\`diff\n- ${scheduledOps}\n\`\`\``, inline: true },
                { name: 'Em Andamento', value: `\`\`\`fix\n${ongoingOps}\n\`\`\``, inline: true },
                { name: 'Finalizadas', value: `\`\`\`diff\n+ ${completedOps}\n\`\`\``, inline: true }
            );

        const row1 = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('ops_action_schedule').setLabel('Agendar Operação').setStyle(ButtonStyle.Success).setEmoji('➕'),
            new ButtonBuilder().setCustomId('ops_action_edit').setLabel('Editar Operação').setStyle(ButtonStyle.Primary).setEmoji('✏️'),
            new ButtonBuilder().setCustomId('ops_config_channel').setLabel('Configurar Canal').setStyle(ButtonStyle.Secondary).setEmoji('📺')
            // O botão de configurar imagem foi removido
        );
        const row2 = new ActionRowBuilder().addComponents(
            require('./rpainel_view_registros').getBackButton()
        );

        await interaction.editReply({ embeds: [finalEmbed], components: [row1, row2] });
    }
};