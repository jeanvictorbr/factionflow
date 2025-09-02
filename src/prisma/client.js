// src/prisma/client.js
const { PrismaClient } = require('@prisma/client');

// Instanciamos o cliente UMA VEZ e o exportamos.
const prisma = new PrismaClient();

module.exports = prisma;