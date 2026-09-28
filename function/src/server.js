import { app } from './app.js';
import config from './config.js';
import { initStores } from './db.js';

// Tạo file dữ liệu nếu chưa có, và dừng ngay nếu file JSON bị hỏng
await initStores();

app.listen(config.port, (err) => {
  if (err) {
    console.error(`Không thể khởi động server trên cổng ${config.port}:`, err.message);
    process.exit(1);
  }
  console.log(`Money Manager API đang chạy tại http://localhost:${config.port}`);
  console.log(`Dữ liệu lưu tại: ${config.dataDir}`);
});
