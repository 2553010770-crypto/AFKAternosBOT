const mineflayer = require('mineflayer');
const express = require('express');

// --- PHẦN 1: CẤU HÌNH WEB SERVER (BẮT BUỘC CHO RENDER) ---
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Bot Minecraft đang chạy. Đừng tắt tab này!');
});

app.listen(port, () => {
  console.log(`Web server đang lắng nghe tại port: ${port}`);
});

// --- PHẦN 2: CẤU HÌNH BOT ---
const botOptions = {
  // Thay đổi 3 dòng dưới đây cho đúng server của bạn
  host: '36Survival-NOT2.aternos.me', // Ví dụ: mysever.aternos.me
  port: 54315,       // Xem số Port trên trang Aternos (Không phải lúc nào cũng là 25565)
  username: 'ChoCB', // Tên bot trong game
  
  // Cấu hình nâng cao
  version: false,     // Để false để bot tự động nhận diện phiên bản (1.21.1)
  auth: 'offline',    // Chế độ crack (Nhớ bật Cracked trong Aternos)
  checkTimeoutInterval: 60 * 1000 // Tăng thời gian chờ (Fix lỗi Forge load lâu)
};

let bot;

function createBot() {
  console.log('Đang kết nối đến server...');
  
  bot = mineflayer.createBot(botOptions);

  // Khi bot vào được server
  bot.on('login', () => {
    console.log(`>>> ${botOptions.username} đã kết nối thành công!`);
    bot.chat('Bot da ket noi! (Code by Mineflayer)');
  });

  // Khi bot xuất hiện trong thế giới (Spawn)
  bot.on('spawn', () => {
    console.log('Bot đã xuất hiện (Spawn). Bắt đầu quy trình chống AFK...');
    
    // --- KHU VỰC LOGIN (Nếu server có plugin AuthMe) ---
    // Bỏ comment 2 dòng dưới nếu server bắt đăng nhập:
    // bot.chat('/register 123456 123456');
    // bot.chat('/login 123456');
    // ---------------------------------------------------

    // Hành động chống AFK: Nhảy và quay đầu mỗi 5 phút
    setInterval(() => {
        if (bot.entity) {
            bot.setControlState('jump', true);
            bot.look(Math.random() * 180, 0); // Quay đầu ngẫu nhiên
            setTimeout(() => {
                bot.setControlState('jump', false);
            }, 1000); // Nhảy trong 1 giây rồi thôi
        }
    }, 300000); // 300000 ms = 5 phút
  });

  // Khi bot bị ngắt kết nối (hoặc server tắt)
  bot.on('end', (reason) => {
    console.log(`Bot bị ngắt kết nối. Lý do: ${reason}`);
    console.log('Sẽ tự động kết nối lại sau 30 giây...');
    
    // Đợi 30 giây rồi kết nối lại
    setTimeout(createBot, 30000);
  });

  // Xử lý lỗi (để không bị crash ứng dụng)
  bot.on('error', (err) => {
    console.log(`Lỗi xảy ra: ${err.message}`);
    if (err.message.includes('unsupported protocol')) {
        console.log('Lỗi phiên bản! Hãy kiểm tra lại version của server.');
    }
  });
  
  // Xử lý khi bị kick
  bot.on('kicked', (reason) => {
      console.log(`Bot bị Kick. Lý do: ${reason}`);
  });
}

// Bắt đầu chạy bot
createBot();
