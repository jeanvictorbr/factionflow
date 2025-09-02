// src/commands/rpainel.js
const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');

// Constante para a imagem principal do painel
const HEADER_IMAGE_URL = 'https://i.imgur.com/gkahi6j.gif';

async function buildMainPanel(interaction) {
    const mainEmbed = new EmbedBuilder()
        .setColor('#2c3e50')
        .setTitle('[ PAINEL DE CONTROLE - FACTIONFLOW ]')
        .setImage(HEADER_IMAGE_URL)
        .setDescription(
            "Saudações, Comandante. Este é o seu centro de operações.\n\n" +
            "> Selecione uma ferramenta abaixo para iniciar a gestão."
        )
        .addFields(
            { name: '⚙️ Configurar Módulos', value: 'Acesse os painéis de `Registro`, `Hierarquia`, `Parcerias` e outras ferramentas.' },
            { name: '📈 Recrutadores', value: 'Acesse o placar e as ferramentas de gerenciamento dos recrutadores.' },
            { name: '📢 Enviar DM em Massa', value: 'Envie uma comunicação direta para todos os membros da facção.' },
            { name: '🗒️ Changelog', value: 'Veja as últimas atualizações e gerencie as notas de versão.' }
        )
        .setFooter({ text: 'Sistema de Gerenciamento FactionFlow • By zepiqueno' });

    const mainButtons = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder().setCustomId('rpainel_view_registros').setLabel('Configurar Módulos').setStyle(ButtonStyle.Primary).setEmoji('⚙️'),
            new ButtonBuilder().setCustomId('view_module_recruiters').setLabel('Recrutadores').setStyle(ButtonStyle.Secondary).setEmoji('📈'),
            new ButtonBuilder().setCustomId('rpainel_action_mass_dm').setLabel('Enviar DM em Massa').setStyle(ButtonStyle.Danger).setEmoji('📢'),
            // BOTÃO DO CHANGELOG AGORA APONTA PARA A AUTENTICAÇÃO
            new ButtonBuilder().setCustomId('changelog_auth').setLabel('SYSTEM').setStyle(ButtonStyle.Success).setEmoji('🔐')
        );
    
    return { embeds: [mainEmbed], components: [mainButtons], ephemeral: true };
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rpainel')
        .setDescription('Abre o painel de configuração do bot.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    buildPanel: buildMainPanel,

    getMainMenuButton: () => {
        return new ButtonBuilder()
            .setCustomId('rpainel_view_main')
            .setLabel('Voltar ao Início')
            .setStyle(ButtonStyle.Danger)
            .setEmoji('🏠');
    },
    
    async execute(interaction) {
        const panel = await buildMainPanel(interaction);
        await interaction.reply(panel);
    },
};