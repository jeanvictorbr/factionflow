// src/components/selects/changelog_select_edit.js
const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
const prisma = require('../../prisma/client');

module.exports = {
    customId: 'changelog_select_edit',
    async execute(interaction) {
        const entryId = interaction.values[0];
        const entry = await prisma.changelogEntry.findUnique({ where: { id: entryId } });
        if (!entry) {
            return interaction.update({ content: '❌ A entrada do changelog não foi encontrada.', components: [] });
        }

        const modal = new ModalBuilder()
            // O ID do modal precisa ser dinâmico para o handler saber que é uma edição
            .setCustomId(`changelog_modal_add_${entryId}`)
            .setTitle(`Editando: ${entry.version}`);

        const versionInput = new TextInputBuilder().setCustomId('cl_version').setLabel('Versão (ex: v3.1)').setStyle(TextInputStyle.Short).setValue(entry.version);
        const titleInput = new TextInputBuilder().setCustomId('cl_title').setLabel('Título da Atualização').setStyle(TextInputStyle.Short).setValue(entry.title);
        const typeInput = new TextInputBuilder().setCustomId('cl_type').setLabel('Tipo (NOVA_FUNCAO, CORRECAO, MELHORIA)').setStyle(TextInputStyle.Short).setValue(entry.type);
        const descInput = new TextInputBuilder().setCustomId('cl_desc').setLabel('Descrição Detalhada').setStyle(TextInputStyle.Paragraph).setValue(entry.description);
        const notifyInput = new TextInputBuilder().setCustomId('cl_notify').setLabel('Notificar @everyone? (Sim/Nao)').setStyle(TextInputStyle.Short).setRequired(false);
        
        modal.addComponents(
            new ActionRowBuilder().addComponents(versionInput),
            new ActionRowBuilder().addComponents(titleInput),
            new ActionRowBuilder().addComponents(typeInput),
            new ActionRowBuilder().addComponents(descInput),
            new ActionRowBuilder().addComponents(notifyInput)
        );
        
        await interaction.showModal(modal);
    }
};