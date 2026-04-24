const { loadDB, saveDB, nextId } = require('./_db');
const { sendWelcomeSequence, sendOrderConfirmation } = require('./_email');

function genCode() {
  return 'TNR' + Date.now().toString(36).toUpperCase().slice(-4) + Math.random().toString(36).slice(2,5).toUpperCase();
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const db = await loadDB();
  const id = req.query && req.query.id;

  if (req.method === 'GET' && id) {
    const order = db.orders.find(o => String(o.id) === String(id) || o.order_code === id);
    return order ? res.status(200).json(order) : res.status(404).json({ error: 'not found' });
  }

  if (req.method === 'GET') {
    return res.status(200).json([...db.orders].reverse());
  }

  if (req.method === 'POST') {
    const { customer_name, customer_phone, customer_email, product_id } = req.body || {};
    if (!customer_name || !product_id) return res.status(400).json({ error: 'Thiếu thông tin' });

    const product = db.products.find(p => p.id === parseInt(product_id));
    if (!product) return res.status(404).json({ error: 'Sản phẩm không tồn tại' });

    let customer = db.customers.find(c => c.phone === customer_phone);
    if (!customer) {
      customer = { id: nextId(db,'customers'), name: customer_name, phone: customer_phone||'', zalo: customer_phone||'', email: customer_email||'', registered_at: new Date().toISOString() };
      db.customers.push(customer);
    } else if (customer_email && !customer.email) {
      customer.email = customer_email;
    }

    const order = {
      id: nextId(db,'orders'),
      order_code: genCode(),
      customer_id: customer.id,
      customer_name, customer_phone: customer_phone||'', customer_email: customer_email||customer.email||'',
      product_id: product.id, product_name: product.name,
      amount: product.price,
      status: 'pending',
      created_at: new Date().toISOString(),
      paid_at: null
    };
    db.orders.push(order);
    await saveDB(db);

    // Gửi email sequence (không block response nếu lỗi)
    if (customer.email) {
      sendWelcomeSequence({ email: customer.email, name: customer.name }).catch(e => console.error('email seq error:', e.message));
    }

    return res.status(201).json({ id: order.id, order_code: order.order_code, amount: order.amount, product_name: order.product_name });
  }

  if (req.method === 'PATCH' && id) {
    const { status } = req.body || {};
    const idx = db.orders.findIndex(o => String(o.id) === String(id));
    if (idx < 0) return res.status(404).json({ error: 'not found' });
    db.orders[idx].status = status;
    if (status === 'success') {
      db.orders[idx].paid_at = new Date().toISOString();
      const pidx = db.products.findIndex(p => p.id === db.orders[idx].product_id);
      if (pidx >= 0 && db.products[pidx].quantity > 0) db.products[pidx].quantity--;

      // Gửi email xác nhận đơn hàng
      const o = db.orders[idx];
      if (o.customer_email) {
        sendOrderConfirmation({ email: o.customer_email, name: o.customer_name, productName: o.product_name, amount: o.amount, orderCode: o.order_code })
          .catch(e => console.error('email confirm error:', e.message));
      }
    }
    await saveDB(db);
    return res.status(200).json({ success: true });
  }

  if (req.method === 'DELETE' && id) {
    db.orders = db.orders.filter(o => String(o.id) !== String(id));
    await saveDB(db);
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
