const { put, list } = require('@vercel/blob');

const BLOB_KEY = 'tnr-db.json';

const SEED = {
  products: [
    { id: 1, name: 'Khoá học Xây Kênh Nhân Hiệu — Tự Học', price: 1990000, description: 'Hệ thống 60 ngày thực chiến, 60+ bài giảng, 100+ templates, truy cập trọn đời', quantity: 999, created_at: new Date().toISOString() },
    { id: 2, name: 'Khoá học Xây Kênh Nhân Hiệu — VIP Mentor', price: 3990000, description: 'Trọn bộ + 4 buổi feedback 1-1, mentor review kênh cá nhân, nhóm VIP, workshop live', quantity: 50, created_at: new Date().toISOString() },
    { id: 3, name: '[TEST] Thanh toán thử nghiệm', price: 2000, description: 'Dùng để test hệ thống', quantity: 9999, created_at: new Date().toISOString() },
  ],
  customers: [],
  orders: [],
  _nextId: { products: 4, customers: 1, orders: 1 }
};

async function loadDB() {
  try {
    const { blobs } = await list({ prefix: BLOB_KEY });
    if (blobs.length > 0) {
      const res = await fetch(blobs[0].url, {
        headers: { Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}` }
      });
      if (res.ok) return await res.json();
    }
  } catch (e) {
    console.error('loadDB error:', e.message);
  }
  return JSON.parse(JSON.stringify(SEED));
}

async function saveDB(db) {
  await put(BLOB_KEY, JSON.stringify(db), {
    access: 'private',
    contentType: 'application/json',
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}

function nextId(db, table) {
  if (!db._nextId) db._nextId = { products: 4, customers: 1, orders: 1 };
  const id = db._nextId[table] || 1;
  db._nextId[table] = id + 1;
  return id;
}

module.exports = { loadDB, saveDB, nextId };
