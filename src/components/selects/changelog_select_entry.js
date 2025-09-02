// src/components/selects/changelog_select_entry.js
const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
const prisma = require('../../prisma/client');

module.exports = {
    customId: 'changelog_select_entry', // Ou o ID do seu menu de seleção
    async execute(interaction) {
        try {
            const entryId = interaction.values[0]; // Pega o ID da entrada selecionada
            const entry = await prisma.changelogEntry.findUnique({ where: { id: entryId } });

            if (!entry) {
                return interaction.reply({ content: '❌ Esta entrada não foi encontrada no banco de dados. Pode ter sido excluída.', ephemeral: true });
            }

            // Usando um ID dinâmico para o modal para passar o ID da entrada
            const modal = new ModalBuilder()
                .setCustomId(`changelog_modal_add_${entry.id}`)
                .setTitle(`Editando: ${entry.version}`);
            
            // Pré-preenchendo os campos com os dados existentes
            const versionInput = new TextInputBuilder().setCustomId('cl_version').setLabel('Versão').setStyle(TextInputStyle.Short).setValue(entry.version).setRequired(true);
            const titleInput = new TextInputBuilder().setCustomId('cl_title').setLabel('Título da Atualização').setStyle(TextInputStyle.Short).setValue(entry.title).setRequired(true);
            const descInput = new TextInputBuilder().setCustomId('cl_desc').setLabel('Descrição Detalhada').setStyle(TextInputStyle.Paragraph).setValue(entry.description).setRequired(true);
            const notifyInput = new TextInputBuilder().setCustomId('cl_notify').setLabel('Notificar @everyone? (Sim/Nao)').setStyle(TextInputStyle.Short).setRequired(false);

            // O campo 'TIPO' FOI REMOVIDO DAQUI
            
            modal.addComponents(
                new ActionRowBuilder().addComponents(versionInput),
                new ActionRowBuilder().addComponents(titleInput),
                new ActionRowBuilder().addComponents(descInput),
                new ActionRowBuilder().addComponents(notifyInput)
            );
            
            await interaction.showModal(modal);

        } catch (error) {
            console.error(`Erro ao criar modal de edição de changelog:`, error);
        }
    }
};