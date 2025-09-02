// src/components/buttons/registro_config_cargos.js
const { ButtonInteraction, EmbedBuilder, ActionRowBuilder, RoleSelectMenuBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const prisma = require('../../prisma/client');

module.exports = {
    customId: 'registro_config_cargos',
    async execute(interaction) {
        await interaction.deferUpdate();

        const config = await prisma.guildConfig.findUnique({ where: { guildId: interaction.guild.id } });
        
        const recruiterRole = config?.recrutadorRoleId ? `<@&${config.recrutadorRoleId}>` : '`[ ✖️ NÃO DEFINIDO ]`';
        const memberRole = config?.membroRoleId ? `<@&${config.membroRoleId}>` : '`[ ✖️ NÃO DEFINIDO ]`';

        const embed = new EmbedBuilder()
            .setColor('#f1c40f')
            .setTitle('[ 🎖️ CONFIGURAÇÃO DE CARGOS ]')
            .setDescription('Defina os cargos essenciais para o fluxo de registro dos Visionários.')
            .setThumbnail('https://media.discordapp.net/attachments/1310610658844475404/1401110522228637786/standard_7.gif?ex=688f155b&is=688dc3db&hm=d90a54a81a18f9e53438b05d9b2c2f0b42028c1c6e5dc6dbcfd4afaeca55ca9e&=')
            .addFields(
                { name: '🛡️ Cargo de Recrutador', value: `> ${recruiterRole}`, inline: false },
                { name: '✅ Cargo de Membro Registrado', value: `> ${memberRole}`, inline: false }
            )
            .setFooter({ text: 'As alterações são salvas automaticamente após a seleção.' });

        const recruiterRoleMenu = new ActionRowBuilder().addComponents(
            new RoleSelectMenuBuilder().setCustomId('registro_select_recrutador_role').setPlaceholder('SELECIONE O CARGO DE RECRUTADOR')
        );

        const memberRoleMenu = new ActionRowBuilder().addComponents(
            new RoleSelectMenuBuilder().setCustomId('registro_select_membro_role').setPlaceholder('SELECIONE O CARGO DE MEMBRO')
        );
        
        // BOTÃO "VOLTAR" CORRIGIDO: criado diretamente no arquivo
        const backButtonRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('view_module_registro') // Aponta para o painel do Módulo de Registro
                .setLabel('Voltar')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('⬅️')
        );

        await interaction.editReply({ embeds: [embed], components: [recruiterRoleMenu, memberRoleMenu, backButtonRow] });
    }
};