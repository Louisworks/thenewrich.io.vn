# thenewrich MCP Server

Streamable HTTP MCP server cho thenewrich.io.vn.  
Chạy ở `http://127.0.0.1:3001/mcp` — nội bộ VPS, không expose ra ngoài.

## Tools

| Tool | Mô tả |
|------|-------|
| `get_daily_summary` | Báo cáo doanh thu hôm nay / hôm qua |
| `confirm_payment` | Xác nhận thanh toán thủ công cho đơn hàng |
| `update_price` | Cập nhật giá sản phẩm (1=Tự Học, 2=VIP+Mentor) |

## Cài đặt trên VPS

```bash
cd /var/www/thenewrich/mcp
npm install

# Cài systemd service
sudo cp thenewrich-mcp.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable thenewrich-mcp
sudo systemctl start thenewrich-mcp

# Kiểm tra
sudo systemctl status thenewrich-mcp
```

## Test nhanh

```bash
# Health check
curl http://127.0.0.1:3001/health

# get_daily_summary
curl -X POST http://127.0.0.1:3001/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"get_daily_summary","arguments":{"day":"today"}}}'

# update_price (đổi VIP thành 3.500.000đ)
curl -X POST http://127.0.0.1:3001/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"update_price","arguments":{"product_id":2,"price":3500000}}}'

# confirm_payment
curl -X POST http://127.0.0.1:3001/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"confirm_payment","arguments":{"order_code":"TNRxxxxxxxx"}}}'
```

## Yêu cầu

- Node.js 18+
- Main app chạy ở port 3002 (`/api/orders`, `/api/products`)
- Chỉ bind `127.0.0.1` — không cần mở firewall
