# Deploy Notes — thenewrich.io.vn

## VPS
- IP: 103.97.126.67
- OS: Ubuntu 22.04 LTS
- SSH: `ssh -p 2018 root@103.97.126.67`
- App path: `/var/www/thenewrich`

## Biến môi trường cần có trên VPS (file `/var/www/thenewrich/.env`)
| Biến | Mô tả |
|------|-------|
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob token — lưu database JSON |
| `RESEND_API_KEY` | Resend API key — gửi email tự động |
| `PORT` | Port Node.js lắng nghe (mặc định 3000) |

## Chạy server
```bash
cd /var/www/thenewrich
npm install
pm2 start server.js --name thenewrich
pm2 save
```

## Update code từ GitHub
```bash
cd /var/www/thenewrich
git pull origin main
pm2 restart thenewrich
```

## Port
- Node.js: `3000` (hoặc `process.env.PORT`)
- Nginx reverse proxy: `80` → `3000`
- HTTPS: Cloudflare SSL (tự động)

## DNS
- Quản lý tại: Cloudflare
- A record `@` và `www` trỏ về `103.97.126.67`
- Proxy: OFF (DNS only)
