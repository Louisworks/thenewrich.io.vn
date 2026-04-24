import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { z } from 'zod';
import http from 'http';

const API = 'http://localhost:3002/api';

async function apiFetch(path, opts = {}) {
  const res = await fetch(`${API}${path}`, opts);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${path} → ${res.status}: ${text}`);
  }
  return res.json();
}

const server = new McpServer({ name: 'thenewrich', version: '1.0.0' });

// ── get_daily_summary ────────────────────────────────────────────────────────
server.registerTool(
  'get_daily_summary',
  {
    description: 'Lấy báo cáo doanh thu + danh sách đơn hàng hôm nay hoặc hôm qua.',
    inputSchema: z.object({
      day: z.enum(['today', 'yesterday']).default('today').describe("'today' hoặc 'yesterday'"),
    }),
  },
  async ({ day }) => {
    const orders = await apiFetch('/orders');

    const tz = 'Asia/Ho_Chi_Minh';
    const now = new Date(new Date().toLocaleString('en-US', { timeZone: tz }));
    const target = new Date(now);
    if (day === 'yesterday') target.setDate(target.getDate() - 1);
    const dateStr = target.toISOString().slice(0, 10); // YYYY-MM-DD

    const dayOrders = orders.filter(o => {
      const d = new Date(o.created_at).toLocaleString('en-US', { timeZone: tz });
      return new Date(d).toISOString().slice(0, 10) === dateStr;
    });

    const paid = dayOrders.filter(o => o.status === 'success');
    const pending = dayOrders.filter(o => o.status === 'pending');
    const revenue = paid.reduce((s, o) => s + (o.amount || 0), 0);
    const fmt = n => new Intl.NumberFormat('vi-VN').format(n) + '₫';

    const label = day === 'today' ? 'Hôm nay' : 'Hôm qua';
    const lines = [
      `📊 ${label} (${dateStr})`,
      `💰 Doanh thu: ${fmt(revenue)}`,
      `✅ Đơn thành công: ${paid.length}`,
      `⏳ Chờ thanh toán: ${pending.length}`,
      '',
      '--- Chi tiết đơn thành công ---',
      ...paid.map(o => `• ${o.order_code} — ${o.customer_name} — ${fmt(o.amount)}`),
    ];

    return { content: [{ type: 'text', text: lines.join('\n') }] };
  }
);

// ── confirm_payment ──────────────────────────────────────────────────────────
server.registerTool(
  'confirm_payment',
  {
    description: 'Xác nhận thanh toán thủ công cho một đơn hàng (đổi status → success).',
    inputSchema: z.object({
      order_code: z.string().describe("Mã đơn hàng, ví dụ TNR20250424001"),
    }),
  },
  async ({ order_code }) => {
    const orders = await apiFetch('/orders');
    const order = orders.find(o => o.order_code === order_code);
    if (!order) throw new Error(`Không tìm thấy đơn ${order_code}`);
    if (order.status === 'success') {
      return { content: [{ type: 'text', text: `✅ Đơn ${order_code} đã được xác nhận trước đó.` }] };
    }

    await apiFetch(`/orders?id=${order.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'success' }),
    });

    return {
      content: [{
        type: 'text',
        text: `✅ Đã xác nhận thanh toán cho đơn ${order_code} — ${order.customer_name} — ${new Intl.NumberFormat('vi-VN').format(order.amount)}₫`,
      }],
    };
  }
);

// ── update_price ─────────────────────────────────────────────────────────────
server.registerTool(
  'update_price',
  {
    description: 'Cập nhật giá sản phẩm. product_id: 1 = Tự Học, 2 = VIP + Mentor.',
    inputSchema: z.object({
      product_id: z.number().int().min(1).max(2).describe('1 = Tự Học, 2 = VIP + Mentor'),
      price: z.number().int().positive().describe('Giá mới (VND), ví dụ 2990000'),
    }),
  },
  async ({ product_id, price }) => {
    await apiFetch(`/products?id=${product_id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ price }),
    });

    const name = product_id === 1 ? 'Tự Học' : 'VIP + Mentor';
    return {
      content: [{
        type: 'text',
        text: `✅ Đã cập nhật giá "${name}" → ${new Intl.NumberFormat('vi-VN').format(price)}₫. Website tự động hiển thị giá mới.`,
      }],
    };
  }
);

// ── HTTP server ──────────────────────────────────────────────────────────────
const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });

const httpServer = http.createServer(async (req, res) => {
  if (req.method === 'POST' && req.url === '/mcp') {
    await transport.handleRequest(req, res);
  } else if (req.method === 'GET' && req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', server: 'thenewrich-mcp' }));
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

await server.connect(transport);

httpServer.listen(3001, '127.0.0.1', () => {
  console.log('thenewrich MCP server running on http://127.0.0.1:3001/mcp');
});
