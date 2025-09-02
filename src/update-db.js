// src/update-db.js
const { PrismaClient } = require('@prisma/client');
const dotenv = require('dotenv');

dotenv.config(); // Adiciona esta linha para carregar o arquivo .env

const prisma = new PrismaClient();

async function addTargetProfitColumn() {
    try {
        const query = `ALTER TABLE "GuildConfig" ADD COLUMN "targetProfit" REAL;`;
        
        await prisma.$executeRawUnsafe(query);

        console.log('✅ Coluna targetProfit adicionada com sucesso na tabela GuildConfig.');
    } catch (error) {
        if (error.message.includes('duplicate column name')) {
            console.log('⚠️ A coluna targetProfit já existe. Nenhuma alteração foi feita.');
        } else {
            console.error('❌ Ocorreu um erro ao atualizar o banco de dados:', error);
        }
    } finally {
        await prisma.$disconnect();
    }
}

addTargetProfitColumn();