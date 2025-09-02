// src/components/buttons/op_admin_notify.js
const { ButtonInteraction, PermissionFlagsBits } = require('discord.js');
const prisma = require('../../prisma/client');

module.exports = {
    customId: 'op_admin_notify',
    async execute(interaction) {
        // 1. Verifica se quem clicou é um admin
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return interaction.reply({ content: '❌ Apenas a liderança pode enviar notificações.', ephemeral: true });
        }

        // 2. CORREÇÃO: Verifica se o BOT tem permissão para marcar @everyone usando a variável correta
        if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.MentionEveryone)) {
            return interaction.reply({ content: '❌ **Falha de Permissão:** Eu não tenho permissão para marcar `@everyone` neste servidor.', ephemeral: true });
        }
        
        await interaction.deferReply({ ephemeral: true });

        const operationId = interaction.customId.split('_')[3];
        const operation = await prisma.operation.findUnique({ where: { id: operationId } });

        if (!operation) {
            return interaction.editReply({ content: '❌ Operação não encontrada.' });
        }

        const notificationMessage = `**\`[📢 ATENÇÃO]:\`** @everyone, uma nova operação foi agendada: **${operation.title}**! Verifiquem o painel acima para participar.`;

        // Envia a mensagem no mesmo canal do painel
        await interaction.channel.send(notificationMessage);

        await interaction.editReply({ content: '✅ Notificação enviada com sucesso!' });
    }
};