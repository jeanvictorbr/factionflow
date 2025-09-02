// src/commands/diagnostico-cargos.js
const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('diagnostico-cargos')
        .setDescription('Gera um relatório sobre a hierarquia e o status de todos os cargos do servidor.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        // Pega todos os cargos do servidor e o bot
        await interaction.guild.roles.fetch();
        const botMember = interaction.guild.members.me;
        const botHighestRole = botMember.roles.highest;

        // Ordena os cargos pela posição, do mais alto para o mais baixo
        const sortedRoles = interaction.guild.roles.cache.sort((a, b) => b.position - a.position);

        let reportDescription = `**Cargo mais alto do Bot:** ${botHighestRole} (Posição: ${botHighestRole.position})\n\n---\n`;

        sortedRoles.forEach(role => {
            if (role.name === '@everyone') return; // Ignora o @everyone

            let statusEmoji = '✅'; // Disponível
            let reason = '';

            if (role.managed) {
                statusEmoji = '🔧'; // Gerenciado
                reason = ' (Gerenciado por uma integração)';
            } else if (role.position >= botHighestRole.position) {
                statusEmoji = '🔒'; // Bloqueado
                reason = ' (Acima ou na mesma posição do bot)';
            }

            reportDescription += `${statusEmoji} ${role} (Posição: ${role.position})${reason}\n`;
        });

        const embed = new EmbedBuilder()
            .setTitle('🩺 Relatório de Diagnóstico de Cargos')
            .setColor('#f1c40f')
            .setDescription(reportDescription)
            .setFooter({ text: 'Este relatório mostra a visão do bot sobre a hierarquia.' })
            .addFields(
                { name: 'Legenda dos Ícones', value: '🔒: Bloqueado (acima do bot)\n🔧: Gerenciado (intocável)\n✅: Disponível' }
            );

        await interaction.editReply({ embeds: [embed] });
    }
};