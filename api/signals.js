const { loadDB, saveDB } = require('./_db');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const db = await loadDB();

  const newOrders = db.orders.filter(o => o.alerted === false);
  const newCustomers = db.customers.filter(c => c.alerted === false);

  if (newOrders.length > 0 || newCustomers.length > 0) {
    db.orders = db.orders.map(o => o.alerted === false ? { ...o, alerted: true } : o);
    db.customers = db.customers.map(c => c.alerted === false ? { ...c, alerted: true } : c);
    await saveDB(db);
  }

  if (req.query && req.query.format === 'text') {
    if (newOrders.length === 0 && newCustomers.length === 0) {
      res.setHeader('Content-Type', 'text/plain');
      return res.status(200).send('HEARTBEAT_OK');
    }

    const fmt = n => new Intl.NumberFormat('vi-VN').format(n) + '₫';
    const newCustomerPhones = new Set(newCustomers.map(c => c.phone).filter(Boolean));

    const leadOrders = newOrders.filter(o => newCustomerPhones.has(o.customer_phone));
    const regularOrders = newOrders.filter(o => !newCustomerPhones.has(o.customer_phone));
    const formOnlyCustomers = newCustomers.filter(c => !newOrders.find(o => o.customer_phone === c.phone));

    const lines = ['📊 BÁO CÁO BUSINESS'];

    if (leadOrders.length > 0) {
      lines.push('');
      lines.push(`🆕 LEAD + ĐƠN MỚI (${leadOrders.length}):`);
      for (const o of leadOrders) {
        lines.push(`• ${o.customer_name} | ${o.product_name} | ${fmt(o.amount)} | #${o.order_code}`);
      }
    }

    if (regularOrders.length > 0) {
      lines.push('');
      lines.push(`🛒 Đơn hàng mới (${regularOrders.length}):`);
      for (const o of regularOrders) {
        lines.push(`• ${o.customer_name} | ${o.product_name} | ${fmt(o.amount)} | #${o.order_code}`);
      }
    }

    if (formOnlyCustomers.length > 0) {
      lines.push('');
      lines.push(`📋 Khách mới điền form (${formOnlyCustomers.length}):`);
      for (const c of formOnlyCustomers) {
        lines.push(`• ${c.name}${c.phone ? ' | ' + c.phone : ''}`);
      }
    }

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    return res.status(200).send(lines.join('\n'));
  }

  return res.status(200).json({ new_orders: newOrders, new_customers: newCustomers });
};
