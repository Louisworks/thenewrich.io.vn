const { loadDB, saveDB, nextId } = require('./_db');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const db = await loadDB();
  const id = req.query && req.query.id;

  if (req.method === 'GET') return res.status(200).json(db.products);

  if (req.method === 'POST') {
    const { name, price, description, quantity } = req.body || {};
    if (!name || !price) return res.status(400).json({ error: 'Thiếu tên hoặc giá' });
    const p = { id: nextId(db,'products'), name, price: parseInt(price), description: description||'', quantity: quantity??999, created_at: new Date().toISOString() };
    db.products.push(p);
    await saveDB(db);
    return res.status(201).json(p);
  }

  if (req.method === 'PUT') {
    const { id: pid, name, price, description, quantity } = req.body || {};
    const idx = db.products.findIndex(p => p.id === parseInt(pid));
    if (idx < 0) return res.status(404).json({ error: 'not found' });
    db.products[idx] = { ...db.products[idx], name, price: parseInt(price), description: description||'', quantity: parseInt(quantity) };
    await saveDB(db);
    return res.status(200).json({ success: true });
  }

  if (req.method === 'DELETE' && id) {
    db.products = db.products.filter(p => String(p.id) !== String(id));
    await saveDB(db);
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
