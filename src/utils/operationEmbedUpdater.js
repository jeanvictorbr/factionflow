// src/utils/operationEmbedUpdater.js
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const prisma = require('../prisma/client');

// --- ÁREA DE CONFIGURAÇÃO DE IMAGEM ---
// Troque as URLs abaixo pelas imagens padrão que você quer usar.
const DEFAULT_OPERATION_IMAGE = 'https://i.imgur.com/O6ixzSJ.gif';
const DEFAULT_OPERATION_THUMBNAIL = 'https://i.imgur.com/MKOcZU9.gif'; // Opcional, pode deixar em branco ''

const loadingChars = ['[ ⣾ ]', '[ ⣷ ]', '[ ⣯ ]', '[ ⣟ ]', '[ ⡿ ]', '[ ⢿ ]', '[ ⣻ ]', '[ ⣽ ]'];
let counter = 0;

async function updateOperationEmbed(client, operationId) {
    try {
        const operation = await prisma.operation.findUnique({
            where: { id: operationId },
            include: { participants: true },
        });

        if (!operation) {
            console.error(`[Updater] Operação com ID ${operationId} não encontrada.`);
            return;
        }

        const channel = await client.channels.fetch(operation.channelId).catch(() => null);
        if (!channel) return;
        const message = await channel.messages.fetch(operation.messageId).catch(() => null);
        if (!message) return;

        // Monta a lista de participantes e reservas com formatação
        const confirmed = operation.participants.filter(p => p.status === 'CONFIRMADO');
        const reserves = operation.participants.filter(p => p.status === 'RESERVA');
        const confirmedString = confirmed.length > 0 ? confirmed.map(p => `🟢 <@${p.userId}>`).join('\n') : '> Nenhuma inscrição confirmada.';
        const reservesString = reserves.length > 0 ? reserves.map(p => `🟡 <@${p.userId}>`).join('\n') : '> Nenhuma reserva.';
        
        // Define a cor e o texto do status, com emoji animado e resultado da operação
        const statusMap = {
            'AGENDADA': { text: '🟢 AGENDADA', color: '#2ecc71' },
            'EM ANDAMENTO': { text: `🟡 EM ANDAMENTO ${loadingChars[counter % loadingChars.length]}`, color: '#f1c40f' },
            'CONCLUÍDA': { text: `⚫ CONCLUÍDA - ${operation.outcome || 'Finalizada'}`, color: '#95a5a6' },
            'CANCELADA': { text: '🔴 CANCELADA', color: '#e74c3c' },
        };
        counter++;
        const currentStatus = statusMap[operation.status] || { text: 'STATUS DESCONHECIDO', color: '#ffffff' };

        const embed = new EmbedBuilder()
            .setColor(currentStatus.color)
            .setTitle(`[ ${currentStatus.text} ] ${operation.title}`)
            .setDescription(`**BRIEFING DA MISSÃO:**\n> ${operation.description.replace(/\n/g, '\n> ')}`)
            .addFields(
                { name: 'Horário da Operação', value: `<t:${Math.floor(new Date(operation.scheduledAt).getTime() / 1000)}:F> (<t:${Math.floor(new Date(operation.scheduledAt).getTime() / 1000)}:R>)` },
                { name: `OPERATIVOS CONFIRMADOS (\`${confirmed.length}\`/\`${operation.maxParticipants}\`)`, value: confirmedString, inline: true },
                { name: 'LISTA DE ESPERA (RESERVAS)', value: reservesString, inline: true },
                { name: 'Líder da Operação', value: `<@${operation.authorId}>` }
            )
            .setImage(DEFAULT_OPERATION_IMAGE)
            .setFooter({ text: `ID da Operação: ${operation.id}` });
        
        if (DEFAULT_OPERATION_THUMBNAIL) {
            embed.setThumbnail(DEFAULT_OPERATION_THUMBNAIL);
        }

        // Define quais botões devem aparecer com base no status da operação
        const memberButtons = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId(`op_participate_${operation.id}`).setLabel('Participar / Entrar na Reserva').setStyle(ButtonStyle.Success).setEmoji('✅'),
            new ButtonBuilder().setCustomId(`op_leave_${operation.id}`).setLabel('Cancelar Inscrição').setStyle(ButtonStyle.Secondary).setEmoji('❌')
        );
        
        const adminButtons = new ActionRowBuilder().addComponents(
             new ButtonBuilder().setCustomId(`op_admin_finish_${operation.id}`).setLabel('Finalizar').setStyle(ButtonStyle.Primary).setEmoji('✔️'),
             new ButtonBuilder().setCustomId(`op_admin_cancel_${operation.id}`).setLabel('Cancelar').setStyle(ButtonStyle.Danger).setEmoji('✖️'),
             new ButtonBuilder().setCustomId(`op_admin_notify_${operation.id}`).setLabel('Notificar').setStyle(ButtonStyle.Secondary).setEmoji('🔔')
        );

        const components = (operation.status === 'CONCLUÍDA' || operation.status === 'CANCELADA') 
            ? [] 
            : [memberButtons, adminButtons];
            
        await message.edit({ content: '', embeds: [embed], components: components });

    } catch (error) {
        console.error(`[Updater] Falha ao atualizar a embed da operação ${operationId}:`, error);
    }
}

module.exports = { updateOperationEmbed };