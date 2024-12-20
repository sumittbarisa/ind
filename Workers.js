
const axios = require('axios');

const TELEGRAM_BOT_TOKEN = '6920732968:AAEyiNg_r2rrvtkZKb9Rt5Gcdb-H76uRekA';
const INSTAGRAM_VIDEO_URL_REGEX = /^https?:\/\/(?:www\.)?instagram\.com(?:\/p\/[a-zA-Z0-9-_]+)?\/$/;

async function handleRequest(req) {
  const { method, body } = req;
  if (method === 'POST') {
    // Handle incoming message from Telegram bot
    const message = body.message;
    const chatId = body.chat_id;

    // Check if the message is a valid Instagram video URL
    if (INSTAGRAM_VIDEO_URL_REGEX.test(message.text)) {
      // Download the video from Instagram using the Instagram API
      const videoResponse = await axios.get(message.text, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
        },
      });

      const videoBuffer = videoResponse.data;

      // Send the video to the Telegram chat
      await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendVideo`, {
        chat_id: chatId,
        video: videoBuffer,
      });

      return new Response('Video sent!', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } else {
      // Handle invalid URL
      return new Response('Invalid URL', {
        status: 400,
      });
    }
  } else {
    // Handle other requests
    return new Response('Method not allowed', {
      status: 405,
    });
  }
}

addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request));
});
