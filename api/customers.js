const { loadDB, saveDB, nextId } = require('./_db');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const db = await loadDB();

  if (req.method === 'GET') return res.status(200).json([...db.customers].reverse());

  if (req.method === 'POST') {
    const { name, phone, zalo, email } = req.body || {};
    const c = { id: nextId(db,'customers'), name:name||'', phone:phone||'', zalo:zalo||'', email:email||'', registered_at: new Date().toISOString() };
    db.customers.push(c);
    await saveDB(db);
    return res.status(201).json(c);
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
