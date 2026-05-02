const Valkey = require('iovalkey');

// Connect to ValKey directly via the iovalkey driver
const valkey = new Valkey(process.env.VALKEY_URL || 'redis://127.0.0.1:6379');

valkey.on('connect', () => {
    console.log('Connected to ValKey Data Store!');
});

valkey.on('error', (err) => {
    console.error('ValKey Connection Error:', err);
});

module.exports = valkey;
