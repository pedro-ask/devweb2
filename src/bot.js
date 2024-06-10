require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const TelegramBot = require('node-telegram-bot-api');

const token = process.env.Token;
const bot = new TelegramBot(token, { polling: true });
const prisma = new PrismaClient();

async function saveMessage(texto, createdAt) {
  try {
    const mensagem = await prisma.mensagem.create({
      data: {
        texto: texto,
        createdAt: createdAt,
      },
    });
    console.log('A mensagem foi salva no banco de dados:', mensagem);
  } catch (error) {
    console.error('Erro ao salvar a mensagem no banco de dados:', error);
  }
}

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;

  const date = new Date();

  if (date.getHours() >= 9 && date.getHours() <= 18) {
    bot.sendMessage(chatId, 'https://faesa.br');
  } else {
    console.log(msg.text);
    if (msg.text.includes('@')) {
      await saveMessage(msg.text, date);
      bot.sendMessage(chatId, 'Nós recebemos seu e-mail, aguarde e logo faremos contato.');
    } else {
      bot.sendMessage(chatId, 'Oi! Nosso funcionamento é das 09:00h às 18:00h. Informe seu e-mail para que possamos entrar em contato:');
    }
    
  }
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit();
});