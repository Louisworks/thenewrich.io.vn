const { loadDB, saveDB } = require('./_db');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method === 'GET') return res.status(200).json({ status: 'webhook active' });
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const data = req.body || {};
    console.log('Sepay webhook:', JSON.stringify(data));

    const content = String(data.content || data.transferContent || data.description || '').toUpperCase();

    const db = await loadDB();
    const pending = db.orders.filter(o => o.status === 'pending');

    let matched = null;
    for (const order of pending) {
      if (content.includes(order.order_code.toUpperCase())) {
        matched = order;
        break;
      }
    }

    if (matched) {
      const idx = db.orders.findIndex(o => o.id === matched.id);
      db.orders[idx].status = 'success';
      db.orders[idx].paid_at = new Date().toISOString();

      const pidx = db.products.findIndex(p => p.id === matched.product_id);
      if (pidx >= 0 && db.products[pidx].quantity > 0) db.products[pidx].quantity--;

      await saveDB(db);
      return res.status(200).json({ success: true, order_code: matched.order_code });
    }

    return res.status(200).json({ success: true, message: 'no matching order' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};
