// src/components/modals/ops_modal_schedule.js
const { ModalSubmitInteraction } = require('discord.js');
const prisma = require('../../prisma/client');
const { updateOperationEmbed } = require('../../utils/operationEmbedUpdater');

module.exports = {
    customId: 'ops_modal_schedule',
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        try {
            const operationId = interaction.customId.split('_')[3];
            const title = interaction.fields.getTextInputValue('op_title');
            const description = interaction.fields.getTextInputValue('op_desc');
            const datetimeStr = interaction.fields.getTextInputValue('op_datetime');
            const maxParticipantsStr = interaction.fields.getTextInputValue('op_max');
            
            const maxParticipants = parseInt(maxParticipantsStr);
            const scheduledAt = new Date(datetimeStr);
            if (isNaN(scheduledAt.getTime()) || isNaN(maxParticipants) || maxParticipants <= 0) {
                return interaction.editReply('❌ Data/Hora ou número de participantes inválido.');
            }

            const config = await prisma.guildConfig.findUnique({ where: { guildId: interaction.guild.id } });
            if (!config?.operationsChannelId) {
                return interaction.editReply('❌ **Falha:** O canal de operações não foi configurado!');
            }

            if (operationId) { // MODO DE EDIÇÃO
                const operation = await prisma.operation.update({ where: { id: operationId }, data: { title, description, scheduledAt, maxParticipants } });
                await updateOperationEmbed(interaction.client, operation.id);
                await interaction.editReply('✅ Operação editada com sucesso!');
            } else { // MODO DE CRIAÇÃO
                const channel = await interaction.guild.channels.fetch(config.operationsChannelId);
                const message = await channel.send({ content: '`[ ⏳ CRIANDO PAINEL DA OPERAÇÃO... ]`' });
                const newOperation = await prisma.operation.create({
                    data: {
                        guildId: interaction.guild.id, title, description, scheduledAt, maxParticipants,
                        authorId: interaction.user.id, channelId: channel.id, messageId: message.id, status: 'AGENDADA',
                    }
                });
                await updateOperationEmbed(interaction.client, newOperation.id);
                await interaction.editReply('✅ Operação agendada e painel publicado com sucesso!');
            }
        } catch (error) {
            console.error("Erro ao agendar/editar operação:", error);
            await interaction.editReply('❌ Ocorreu um erro crítico ao processar a solicitação.');
        }
    }
};