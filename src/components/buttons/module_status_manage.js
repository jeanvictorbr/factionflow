// src/components/buttons/module_status_manage.js
const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const prisma = require('../../prisma/client');

module.exports = {
    customId: 'module_status_manage',
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        // 1. Busca os módulos diretamente do banco de dados
        const modules = await prisma.moduleStatus.findMany({ 
            where: { guildId: interaction.guild.id } 
        });

        if (modules.length === 0) {
            return interaction.editReply('Nenhum módulo encontrado para configurar. Use o comando /setup-modulos para inicializar.');
        }

        // 2. Cria o menu de seleção usando os dados do banco
        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('module_status_select_module')
            .setPlaceholder('Selecione um módulo para alterar o status')
            .addOptions(
                modules.map(m => ({ 
                    label: `${m.emoji} ${m.name}`, // Usa o nome e emoji do banco de dados
                    value: m.name // Usa o nome como valor
                }))
            );

        // 3. Responde com o menu
        await interaction.editReply({ 
            content: 'Selecione o módulo:', 
            components: [new ActionRowBuilder().addComponents(selectMenu)] 
        });
    }
};