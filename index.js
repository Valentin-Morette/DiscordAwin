const { Client, GatewayIntentBits } = require('discord.js');
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const Magasins = [
  ['!fnac', 12665],
  ['!cdiscount', 6948],
  ['!eneba', 20385],
];

client.on('ready', () => {
  console.log('Ready!');
});

async function createAffiliateLink(advertiserId, link = '') {
  try {
    const response = await axios.post(
      `https://api.awin.com/publishers/678049/linkbuilder/generate`,
      {
        advertiserId: advertiserId,
        destinationUrl: link,
        shorten: true,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer 26dcfb53-96c4-4337-9b9b-db10d7bd2d29',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

// Le bot écoute les messages sur le serveur
client.on('messageCreate', async (message) => {
  const command = message.content.split(' ')[0];
  const store = Magasins.find(([storeName]) => storeName === command);
  if (store) {
    const [, storeId] = store;
    const link = message.content.split(' ')[1];
    let url = await createAffiliateLink(storeId, link);
    message.channel.send(url.shortUrl);
  }
});

client.login(process.env.TOKEN);
