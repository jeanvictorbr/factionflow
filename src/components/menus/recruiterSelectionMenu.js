// /src/components/menus/recruiterSelectionMenu.js

const { StringSelectMenuBuilder, ActionRowBuilder } = require('discord.js');

// Supondo que você tenha uma forma de buscar seus recrutadores
// Ex: const Recruiter = require('../../models/Recruiter');
// Vou simular a busca para o exemplo.

/**
 * Cria e retorna um menu de seleção de recrutadores.
 * @param {import('discord.js').Interaction} interaction A interação para buscar membros da guilda.
 * @returns {Promise<ActionRowBuilder<StringSelectMenuBuilder>>}
 */
async function createRecruiterSelectionMenu(interaction) {
    // 1. Busque a lista de recrutadores (do seu banco de dados ou outra fonte)
    // Exemplo: const recruitersData = await Recruiter.find({ active: true });
    // Para este exemplo, vou simular dados:
    const recruitersData = [
        { discordId: 'ID_DO_RECRUTADOR_1' },
        { discordId: 'ID_DO_RECRUTADOR_2' },
        { discordId: 'ID_DO_RECRUTADOR_3' }
    ];

    const menuOptions = [];

    for (const recruiter of recruitersData) {
        try {
            // 2. Busque o objeto 'member' para pegar o apelido (nickname)
            const member = await interaction.guild.members.fetch(recruiter.discordId);
            
            // 3. Formate o nome como "username (@apelido)" ou apenas "username" se não houver apelido
            const displayName = member.nickname 
                ? `${member.user.username} (@${member.nickname})` 
                : member.user.username;

            menuOptions.push({
                label: displayName, // <-- AQUI: "nome (@apelido)"
                description: `Selecionar ${member.user.username} como recrutador.`, // <-- SEM contagem de tickets
                value: member.id, // O valor é o ID do recrutador, para ser usado depois
            });
        } catch (error) {
            console.error(`Não foi possível encontrar o membro com ID ${recruiter.discordId}`, error);
            // Pular este recrutador se ele não estiver no servidor
        }
    }
    
    // Certifique-se de que há opções para mostrar
    if (menuOptions.length === 0) {
      // Retorna null ou lança um erro se nenhum recrutador for encontrado
      // para que o chamador possa lidar com isso.
      return null; 
    }

    const selectMenu = new StringSelectMenuBuilder()
        .setCustomId('registro_selecionar_recrutador')
        .setPlaceholder('Clique para escolher seu recrutador')
        .addOptions(menuOptions);

    return new ActionRowBuilder().addComponents(selectMenu);
}

// Exporte a função para que outros arquivos possam usá-la
module.exports = {
    createRecruiterSelectionMenu,
};