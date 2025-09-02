// src/components/buttons/roletags_action_set_all.js
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { updateMemberTag } = require('../../utils/tagUpdater');
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// O mapa de controle precisa ficar fora para ser acessado pelos outros botões
const activeSyncs = new Map();
const loadingChars = ['[ ⣾ ]', '[ ⣷ ]', '[ ⣯ ]', '[ ⣟ ]', '[ ⡿ ]', '[ ⢿ ]', '[ ⣻ ]', '[ ⣽ ]'];

module.exports = {
    customId: 'roletags_action_set_all',
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        // Feedback imediato antes da tarefa pesada
        const initialEmbed = new EmbedBuilder()
            .setColor('#3498db')
            .setTitle('🔄 Sincronização de Tags Iniciada...')
            .setDescription('`[ 👥 Carregando lista de todos os membros... Isso pode demorar um pouco. ]`');
        await interaction.editReply({ embeds: [initialEmbed] });
        
        activeSyncs.set(interaction.id, { status: 'RUNNING', counter: 0 });

        const members = await interaction.guild.members.fetch();
        let processed = 0, changed = 0, failed = 0;
        const successLogs = [];
        const failureLogs = [];

        // Inicia o loop de varredura
        for (const member of members.values()) {
            let state = activeSyncs.get(interaction.id);
            // Verifica se a operação foi pausada
            while(state?.status === 'PAUSED') {
                await sleep(2000); // Espera 2 segundos e verifica de novo
                state = activeSyncs.get(interaction.id);
            }
            // Verifica se a operação foi cancelada
            if (state?.status === 'CANCELLED') break;

            const result = await updateMemberTag(member);
            processed++;

            if (result.changed) {
                changed++;
                successLogs.push(`> ${member.user.tag}: \`${result.oldNickname}\` → \`${result.newNickname}\``);
            }
            if (!result.success && result.reason) {
                failed++;
                failureLogs.push(`> ${member.user.tag}: \`${result.reason}\``);
            }
            
            // Atualiza o log em tempo real
            if (processed % 5 === 0 || processed === members.size) { // Atualiza a cada 5 membros ou no final
                const loadingChar = loadingChars[state.counter % loadingChars.length];
                state.counter++;

                const logEmbed = new EmbedBuilder()
                    .setTitle(`🔄 Sincronização em Andamento... ${loadingChar}`)
                    .setColor('#3498db')
                    .addFields(
                        { name: 'Progresso', value: `\`${processed}/${members.size}\` membros`, inline: true },
                        { name: 'Tags Alteradas', value: `\`${changed}\``, inline: true },
                        { name: 'Falhas', value: `\`${failed}\``, inline: true },
                        { name: 'Status Atual', value: `\`\`\`Verificando: ${member.user.tag}\`\`\`` }
                    );
                
                const buttons = new ActionRowBuilder().addComponents(
                    new ButtonBuilder().setCustomId(`sync_tags_pause_${interaction.id}`).setLabel('Pausar').setStyle(ButtonStyle.Secondary).setEmoji('⏸️'),
                    new ButtonBuilder().setCustomId(`sync_tags_cancel_${interaction.id}`).setLabel('Cancelar').setStyle(ButtonStyle.Danger).setEmoji('🛑')
                );
                await interaction.editReply({ embeds: [logEmbed], components: [buttons] });
            }

            await sleep(150); // Pausa pequena para não sobrecarregar a API
        }
        
        // Limpa a operação e mostra o relatório final
        const finalState = activeSyncs.get(interaction.id);
        activeSyncs.delete(interaction.id);

        const finalEmbed = new EmbedBuilder()
            .setTitle('✅ Sincronização Concluída!')
            .setColor('#2ecc71')
            .addFields(
                { name: 'Membros Verificados', value: `\`${processed}\``, inline: true },
                { name: 'Tags Alteradas', value: `\`${changed}\``, inline: true },
                { name: 'Falhas de Permissão', value: `\`${failed}\``, inline: true }
            );

        if (successLogs.length > 0) {
            finalEmbed.addFields({ name: '📝 Alterações Realizadas (Prévia)', value: successLogs.slice(-10).join('\n') }); // Mostra as últimas 10
        }
        if (failureLogs.length > 0) {
            finalEmbed.setColor('#e74c3c');
            finalEmbed.setTitle('⚠️ Sincronização Concluída com Falhas');
            finalEmbed.addFields({ name: '❌ Falhas na Sincronização (Causa Provável: Hierarquia de Cargos)', value: failureLogs.join('\n') });
        }
        if (finalState?.status === 'CANCELLED') {
            finalEmbed.setTitle('🛑 Sincronização Cancelada').setColor('#e74c3c');
        }
        
        await interaction.editReply({ embeds: [finalEmbed], components: [] });
    },
    // Exporta o mapa para que os botões de controle possam acessá-lo
    activeSyncs
};