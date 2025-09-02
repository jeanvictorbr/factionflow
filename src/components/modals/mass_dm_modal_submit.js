// src/components/modals/mass_dm_modal_submit.js
const { ModalSubmitInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const activeOperations = new Map();
const loadingChars = ['[ 📡.  ]', '[ 📡.. ]', '[ 📡... ]', '[ 📡.. ]'];

module.exports = {
    customId: 'mass_dm_modal_submit',
    async execute(interaction) {
        const messageToSend = interaction.fields.getTextInputValue('dm_message_content');

        activeOperations.set(interaction.id, { status: 'RUNNING', counter: 0 });

        await interaction.reply({ 
            content: 'Iniciando transmissão...',
            ephemeral: true,
            components: [
                new ActionRowBuilder().addComponents(
                    new ButtonBuilder().setCustomId(`mass_dm_action_pause_${interaction.id}`).setLabel('Pausar').setStyle(ButtonStyle.Secondary).setEmoji('⏸️'),
                    new ButtonBuilder().setCustomId(`mass_dm_action_cancel_${interaction.id}`).setLabel('Cancelar').setStyle(ButtonStyle.Danger).setEmoji('🛑')
                )
            ]
        });

        const members = await interaction.guild.members.fetch();
        const usersToSend = members.filter(m => !m.user.bot);
        let successCount = 0;
        let failCount = 0;

        // ===================================================================
        // NOVA FORMATAÇÃO FORÇADA PARA VERMELHO E MARKDOWN
        // ===================================================================
        const lines = messageToSend.split('\n');
        // Adiciona '- ' no início de cada linha para forçar a cor vermelha no bloco 'diff'
        const formattedMessage = lines.map(line => `- ${line}`).join('\n');
        const finalDescription = `\`\`\`diff\n${formattedMessage}\n\`\`\``;

        const dmEmbed = new EmbedBuilder()
            .setColor('#E74C3C') // Cor da borda da embed em vermelho
            .setTitle(`Uma Mensagem da Liderança`)
            .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL() })
            .setDescription(finalDescription) // Usa a mensagem formatada
            .setTimestamp();
        
        for (const [_, member] of usersToSend) {
            let operationState = activeOperations.get(interaction.id);
            while (operationState?.status === 'PAUSED') {
                await sleep(1500);
                operationState = activeOperations.get(interaction.id);
            }
            if (operationState?.status === 'CANCELLED') break;

            let statusEmoji = '';
            try {
                await member.send({ embeds: [dmEmbed] });
                successCount++;
                statusEmoji = '🟢';
            } catch (error) {
                failCount++;
                statusEmoji = '🔴';
            }
            
            // ===================================================================
            // LOG EM TEMPO REAL ATUALIZADO COM "RESTANTES"
            // ===================================================================
            const remainingCount = usersToSend.size - (successCount + failCount);
            const loadingChar = loadingChars[operationState.counter % loadingChars.length];
            operationState.counter++;

            const logContent = `**[ 📢 BROADCAST EM ANDAMENTO... ${loadingChar} ]**\n` +
                               "> `[ SUCESSO ]:` " + `**${successCount}**\n` +
                               "> `[ FALHA ]:` " + `**${failCount}**\n` +
                               "> `[ RESTANTES ]:` " + `**${remainingCount}**\n` +
                               "---\n" +
                               `\`[STATUS]: Transmitindo para ${member.user.tag}... ${statusEmoji}\``;

            await interaction.editReply({ content: logContent });
            await sleep(1000); 
        }

        const finalState = activeOperations.get(interaction.id);
        activeOperations.delete(interaction.id);

        if (finalState?.status === 'CANCELLED') {
            await interaction.editReply({ content: `**🛑 OPERAÇÃO CANCELADA PELO COMANDO.**\n- Envios bem-sucedidos: ${successCount}\n- Falhas: ${failCount}`, components: [] });
        } else {
            await interaction.editReply({ content: `**🚀 Envio em massa concluído!**\n- ✅ Sucessos: **${successCount}**\n- ❌ Falhas: **${failCount}**`, components: [] });
        }
    },
    activeOperations,
};