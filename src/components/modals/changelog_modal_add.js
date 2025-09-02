// src/components/modals/changelog_modal_add.js
const { EmbedBuilder } = require('discord.js');
const prisma = require('../../prisma/client');
const { updateChangelogEmbed } = require('../../utils/changelogEmbedUpdater');

module.exports = {
    customId: 'changelog_modal_add',
    async execute(interaction) {
        try {
            await interaction.deferReply({ ephemeral: true });
        
            const version = interaction.fields.getTextInputValue('cl_version');
            const title = interaction.fields.getTextInputValue('cl_title');
            const description = interaction.fields.getTextInputValue('cl_desc');
            
            // O campo 'type' foi completamente removido do objeto de dados.
            const data = { guildId: interaction.guild.id, version, title, description, authorId: interaction.user.id };

            await prisma.changelogEntry.create({ data });
            
            await updateChangelogEmbed(interaction.client, interaction.guild.id);
            
            await interaction.editReply({ content: '✅ Entrada salva e painéis atualizados!' });

        } catch (error) {
            console.error(`Erro no modal ${module.exports.customId}:`, error);
            if (interaction.deferred) {
                await interaction.editReply({ content: '❌ Ocorreu um erro ao processar o formulário.' }).catch(() => {});
            }
        }
    }
};