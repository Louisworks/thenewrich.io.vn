require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.all('/api/webhook',   require('./api/webhook'));
app.all('/api/orders',    require('./api/orders'));
app.all('/api/products',  require('./api/products'));
app.all('/api/customers', require('./api/customers'));

// Page routes
app.get('/checkout', (req, res) => res.sendFile(path.join(__dirname, 'checkout.html')));
app.get('/admin',    (req, res) => res.sendFile(path.join(__dirname, 'admin.html')));

// Static files
app.use(express.static(__dirname));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('thenewrich running on port ' + PORT));
