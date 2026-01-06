const mineflayer = require('mineflayer');
const express = require('express');
const app = express();

// --- CẤU HÌNH WEB SERVER (Để giữ Render sống) ---
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Bot Minecraft đang chạy 24/7!');
});

app.listen(port, () => {
  console.log(`Web server đang chạy trên port ${port}`);
});

// --- CẤU HÌNH BOT MINECRAFT ---
const botOptions = {
  host: '36Survival-NOT2.aternos.me', // Thay bằng địa chỉ IP server
  port: 54315,       // Thay bằng Port server (xem trên Aternos)
  username: 'ChoCaoBang', // Tên bot
  version: false,    // Tự động nhận diện version
  // password: 'pass_neu_co' // Bỏ comment nếu server bắt login (authme)
};

let bot;

function createBot() {
  bot = mineflayer.createBot(botOptions);

  bot.on('login', () => {
    console.log('Bot đã kết nối thành công!');
    bot.chat('Xin chao! Toi la bot treo server.');
  });

  bot.on('spawn', () => {
    // Chống AFK bằng cách nhảy hoặc xoay nhẹ mỗi 5 phút
    setInterval(() => {
        if(bot.entity) {
             bot.setControlState('jump', true);
             setTimeout(() => bot.setControlState('jump', false), 1000);
             bot.look(Math.random() * 180, 0); // Xoay ngẫu nhiên
        }
    }, 300000); // 5 phút
  });

  bot.on('end', (reason) => {
    console.log(`Bot bị ngắt kết nối: ${reason}. Đang kết nối lại sau 10s...`);
    setTimeout(createBot, 10000); // Tự động reconnect sau 10 giây
  });

  bot.on('error', (err) => {
    console.log(`Lỗi: ${err.message}`); 
    // Không cần làm gì, sự kiện 'end' sẽ kích hoạt reconnect
  });
}


createBot();


