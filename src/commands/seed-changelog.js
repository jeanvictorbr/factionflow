// src/commands/seed-changelog.js
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const prisma = require('../prisma/client');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('seed-changelog')
        .setDescription('[DEV] Popula o BD com um histórico completo de atualizações do bot.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        // ===================================================================
        // CONFIGURE ESTES VALORES
        // ===================================================================
        const GUILD_ID = '1131257777495486609';         // Coloque o ID do seu servidor aqui
        const AUTHOR_ID = '1403168980910342154';       // Coloque o ID de um autor/desenvolvedor aqui
        const BOT_OWNER_ID = '1070658145740926987'; // Coloque o SEU ID de usuário para ter permissão
        // ===================================================================

        if (interaction.user.id !== BOT_OWNER_ID) {
            return interaction.reply({ content: '❌ Você não tem permissão para usar este comando.', ephemeral: true });
        }

        await interaction.deferReply({ ephemeral: true });

        try {
            await prisma.changelogEntry.deleteMany({ where: { guildId: GUILD_ID } });

            const changelogData = [
                // AGOSTO 2025
                { version: 'v3.3', title: '🧹 Módulo de Depuração de Inativos', description: 'Adicionada nova ferramenta de staff para identificar e remover membros inativos de forma segura, com notificação prévia por DM e logs completos.', createdAt: new Date('2025-08-09T18:00:00Z') },
                { version: 'v3.2', title: '✨ Renovação Visual do Painel de Admin', description: 'A interface do `/rpainel` foi completamente redesenhada com um novo layout mais moderno, intuitivo e com melhor organização dos módulos.', createdAt: new Date('2025-08-07T15:00:00Z') },
                { version: 'v3.1.1', title: '🐛 Correção no Módulo de Sorteios', description: 'Resolvido um problema visual onde a lista de últimos participantes piscava e sumia. A embed agora atualiza de forma consistente.', createdAt: new Date('2025-08-04T11:00:00Z') },
                { version: 'v3.1', title: '🔧 Otimização de Performance', description: 'A performance geral do bot foi melhorada em 25% através da otimização de consultas ao banco de dados e gerenciamento de cache.', createdAt: new Date('2025-08-01T16:00:00Z') },
                
                // JULHO 2025
                { version: 'v3.0', title: '🎁 Lançamento do Módulo de Sorteios', description: 'Novo sistema de sorteios totalmente gerenciado por um painel interativo, com contagem de participantes em tempo real e requisitos de cargo.', createdAt: new Date('2025-07-28T20:00:00Z') },
                { version: 'v2.5', title: '🤝 Sistema de Alianças entre Facções', description: 'Facções agora podem formar alianças oficiais com outras facções, compartilhando informações e benefícios através do comando `/alianca`.', createdAt: new Date('2025-07-25T14:00:00Z') },
                { version: 'v2.4', title: '🎯 Módulo de Operações Táticas', description: 'Sistema para agendar e organizar operações de facção de forma profissional, com painel de status e lista de participantes.', createdAt: new Date('2025-07-22T10:00:00Z') },
                { version: 'v2.3.1', title: '🐛 Correção em Disputas de Território', description: 'Ajustado o sistema de pontuação para resolver empates em disputas de território, garantindo um vencedor claro.', createdAt: new Date('2025-07-19T13:00:00Z') },
                { version: 'v2.3', title: '🗺️ Lançamento do Mapa Interativo de Territórios', description: 'Facções agora podem conquistar e visualizar territórios em um mapa dinâmico do servidor usando o novo comando `/mapa`.', createdAt: new Date('2025-07-17T18:30:00Z') },
                { version: 'v2.2', title: '⚔️ Sistema de Declaração de Guerra', description: 'Facções agora podem declarar guerra oficialmente a outras. O bot irá monitorar o status e os conflitos, registrando os resultados.', createdAt: new Date('2025-07-15T12:00:00Z') },
                
                // JUNHO 2025
                { version: 'v2.1', title: '✨ Melhoria no Módulo de Justiça', description: 'Adicionado sistema de cargos temporários automáticos e um fluxo interativo para revogar e excluir punições.', createdAt: new Date('2025-06-30T19:00:00Z') },
                { version: 'v2.0', title: '⚖️ Lançamento do Módulo de Justiça', description: 'Implementado um sistema de conduta baseado em um "Código Penal" configurável, com registro completo de punições.', createdAt: new Date('2025-06-27T16:00:00Z') },
                { version: 'v1.4', title: '🤝 Módulo de Gerenciamento de Parcerias', description: 'Adicionada uma ferramenta para gerenciar parcerias, permitindo visualizar todas as alianças e status em um painel de lista.', createdAt: new Date('2025-06-24T11:00:00Z') },
                { version: 'v1.3.1', title: '🐛 Correção na Calculadora de Finanças', description: 'Corrigido um erro de cálculo no módulo de finanças que afetava itens com desconto de parceria.', createdAt: new Date('2025-06-20T09:00:00Z') },
                { version: 'v1.3', title: '💰 Módulo Financeiro Simplificado', description: 'Lançado o sistema inicial de finanças para facções, incluindo registro de vendas e calculadora de itens.', createdAt: new Date('2025-06-18T18:00:00Z') },
                { version: 'v1.2', title: '⚙️ Introdução do Painel de Admin /rpainel', description: 'Criado o painel de controle central para administradores gerenciarem todos os módulos do bot a partir de um único local.', createdAt: new Date('2025-06-15T21:00:00Z') },
                { version: 'v1.1.1', title: '🐛 Correção no Registro Automático', description: 'Resolvido um bug que impedia a alteração de apelido para novos membros com caracteres especiais no nome.', createdAt: new Date('2025-06-12T15:00:00Z') },
                { version: 'v1.1', title: '✅ Sistema de Registro Automatizado', description: 'Implementado um sistema de registro completo. O bot agora altera automaticamente o apelido do membro ao ser aprovado.', createdAt: new Date('2025-06-10T13:00:00Z') },
                
                // MAIO 2025
                { version: 'v1.0', title: '👥 Gerenciamento Básico de Facções', description: 'Implementados os comandos essenciais: `/faccao criar`, `/convidar`, `/expulsar`, `/sair` e `/faccao perfil`.', createdAt: new Date('2025-05-25T20:00:00Z') },
                { version: 'v0.2', title: '📦 Configuração do Banco de Dados com Prisma', description: 'Definido o schema inicial para Facções, Membros e Configurações. Conexão com o banco de dados estabelecida.', createdAt: new Date('2025-05-15T11:00:00Z') },
                { version: 'v0.1', title: '🎉 Início do Projeto FactionFlow', description: 'Estrutura inicial do projeto criada, com a configuração base do discord.js e do handler de comandos. O bot está online!', createdAt: new Date('2025-05-10T12:00:00Z') },
            ];

            const dataToCreate = changelogData.map(entry => ({ ...entry, guildId: GUILD_ID, authorId: AUTHOR_ID }));

            await prisma.changelogEntry.createMany({ data: dataToCreate });

            await interaction.editReply({ content: `✅ Banco de dados populado com sucesso com ${dataToCreate.length} registros de changelog!` });

        } catch (error) {
            console.error('Falha ao executar o comando /seed-changelog:', error);
            await interaction.editReply({ content: '❌ Ocorreu um erro ao tentar popular o banco de dados.' });
        }
    },
};