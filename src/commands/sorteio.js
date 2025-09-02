// src/commands/sorteiro.js
const { SlashCommandBuilder, ChannelType, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const prisma = require('../prisma/client');
const ms = require('ms');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sorteio')
        .setDescription('Gerencia o sistema de sorteios do servidor.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addSubcommand(subcommand =>
            subcommand
                .setName('criar')
                .setDescription('Cria um novo sorteio profissional.')
                .addStringOption(option => option.setName('prêmio').setDescription('Descrição do prêmio.').setRequired(true))
                .addStringOption(option => option.setName('duração').setDescription('Duração do sorteio (ex: 10m, 1h, 3d).').setRequired(true))
                .addIntegerOption(option => option.setName('vencedores').setDescription('Número de vencedores.').setRequired(true))
                .addChannelOption(option => option.setName('canal').setDescription('Canal onde o sorteio será postado.').addChannelTypes(ChannelType.GuildText).setRequired(true))
                .addRoleOption(option => option.setName('cargo_requerido').setDescription('Cargo necessário para ganhar (opcional).'))
                .addAttachmentOption(option => option.setName('imagem').setDescription('Imagem para a embed do sorteio (opcional).'))
        ),
        // Adicionaremos os subcomandos 'reroll' e 'encerrar' aqui no futuro.

    async execute(interaction) {
        if (interaction.options.getSubcommand() === 'criar') {
            await interaction.deferReply({ ephemeral: true });

            const prize = interaction.options.getString('prêmio');
            const durationStr = interaction.options.getString('duração');
            const winnerCount = interaction.options.getInteger('vencedores');
            const channel = interaction.options.getChannel('canal');
            const requiredRole = interaction.options.getRole('cargo_requerido');
            const image = interaction.options.getAttachment('imagem');

            const durationMs = ms(durationStr);
            if (!durationMs) {
                return interaction.editReply('❌ Duração inválida. Use um formato como `10m`, `1h` ou `3d`.');
            }
            if (winnerCount < 1) {
                return interaction.editReply('❌ O número de vencedores deve ser pelo menos 1.');
            }
            const endsAt = new Date(Date.now() + durationMs);

            const config = await prisma.guildConfig.findUnique({ where: { guildId: interaction.guild.id } });

            const giveawayEmbed = new EmbedBuilder()
                .setColor(config?.giveawayEmbedColor || '#5865F2')
                .setTitle(`🎉 SORTEIO: ${prize}`)
                .setDescription(`Clique no botão **Participar** para ter a chance de ganhar!\n\n**Termina em:** <t:${Math.floor(endsAt.getTime() / 1000)}:R>`)
                .addFields(
                    { name: 'Vencedores', value: `**${winnerCount}**`, inline: true },
                    { name: 'Participantes', value: '**0**', inline: true }
                )
                .setImage(image?.url || config?.giveawayDefaultImageUrl || null)
                .setThumbnail(config?.giveawayDefaultThumbnailUrl || null)
                .setFooter({ text: `Sorteio iniciado por ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
                .setTimestamp();
            
            if (requiredRole) {
                giveawayEmbed.addFields({ name: 'Requisito', value: `Apenas membros com o cargo ${requiredRole} podem ganhar.` });
            }

            const actionRow = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('giveaway_enter')
                    .setLabel('Participar')
                    .setStyle(ButtonStyle.Success)
                    .setEmoji('🎉'),
                // ===================================================================
                // CORREÇÃO APLICADA AQUI
                // O customId agora é estático, e o handler 'giveaway_view_entrants'
                // buscará o sorteio pelo ID da mensagem onde o botão está.
                // ===================================================================
                new ButtonBuilder()
                    .setCustomId('giveaway_view_entrants')
                    .setLabel('Listar Participantes')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('👥')
            );
            
            try {
                const message = await channel.send({ embeds: [giveawayEmbed], components: [actionRow] });

                await prisma.giveaway.create({
                    data: {
                        guildId: interaction.guild.id,
                        channelId: channel.id,
                        messageId: message.id,
                        prize,
                        winnerCount,
                        endsAt,
                        requiredRoleId: requiredRole?.id || null,
                    }
                });

                await interaction.editReply(`✅ Sorteio para **${prize}** criado com sucesso no canal ${channel}!`);
            } catch (error) {
                console.error("Erro ao criar sorteio:", error);
                await interaction.editReply('❌ Ocorreu um erro. Verifique se tenho permissões para enviar mensagens e embeds no canal selecionado.');
            }
        }
    }
};