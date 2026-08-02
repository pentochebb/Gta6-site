require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 8080;
const KEYS_FILE = path.join(__dirname, 'keys.json');
const uri = process.env.MONGO_URI;

let db, keysCollection;

if (uri) {
    MongoClient.connect(uri)
        .then(client => {
            db = client.db('gta6');
            keysCollection = db.collection('keys');
            console.log('Connected to MongoDB database');
        })
        .catch(err => {
            console.error('Failed to connect to MongoDB, using local fallback:', err);
        });
} else {
    console.log('No MONGO_URI found in environment, falling back to keys.json local storage');
}

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

// Local fallback helpers
function readKeysLocal() {
    try {
        if (!fs.existsSync(KEYS_FILE)) {
            fs.writeFileSync(KEYS_FILE, JSON.stringify({}));
        }
        const data = fs.readFileSync(KEYS_FILE, 'utf8');
        return JSON.parse(data || '{}');
    } catch (e) {
        return {};
    }
}

function writeKeysLocal(keys) {
    fs.writeFileSync(KEYS_FILE, JSON.stringify(keys, null, 2));
}

// Helper to read keys from MongoDB or fallback to local JSON
async function getKeys() {
    if (keysCollection) {
        try {
            const keysArray = await keysCollection.find({}).toArray();
            const keysObj = {};
            keysArray.forEach(k => {
                const { _id, ...data } = k;
                keysObj[_id] = data;
            });
            return keysObj;
        } catch (e) {
            console.error('Error fetching keys from MongoDB, using local fallback:', e);
            return readKeysLocal();
        }
    } else {
        return readKeysLocal();
    }
}

// Generate a key (e.g. GTA6-XXXX-XXXX-XXXX-XXXX)
function generateKeyString() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const segment = () => {
        let str = '';
        for (let i = 0; i < 4; i++) {
            str += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return str;
    };
    return `GTA6-${segment()}-${segment()}-${segment()}-${segment()}`;
}

// API: Generate new key
app.post('/api/generate', async (req, res) => {
    const { user, durationDays } = req.body;
    const newKey = generateKeyString();

    // Compute expiry
    let expiresAt = null;
    if (durationDays && parseInt(durationDays) > 0) {
        const exp = new Date();
        exp.setDate(exp.getDate() + parseInt(durationDays));
        expiresAt = exp.toISOString();
    }

    const keyData = {
        activated: false,
        fingerprint: null,
        activatedAt: null,
        user: user || '',
        expiresAt
    };
    
    if (keysCollection) {
        try {
            await keysCollection.insertOne({ _id: newKey, ...keyData });
            return res.json({ success: true, key: newKey });
        } catch (e) {
            console.error('MongoDB generate error, falling back to local file:', e);
        }
    }
    
    // Fallback
    const keys = readKeysLocal();
    keys[newKey] = keyData;
    writeKeysLocal(keys);
    res.json({ success: true, key: newKey });
});

// API: Delete/Revoke a key
app.delete('/api/keys/:key', async (req, res) => {
    const keyToDelete = req.params.key;
    
    if (keysCollection) {
        try {
            const result = await keysCollection.deleteOne({ _id: keyToDelete });
            if (result.deletedCount > 0) {
                return res.json({ success: true, message: 'Key deleted successfully.' });
            } else {
                return res.json({ success: false, message: 'Key not found.' });
            }
        } catch (e) {
            console.error('MongoDB delete error, falling back to local file:', e);
        }
    }
    
    // Fallback
    const keys = readKeysLocal();
    if (keys[keyToDelete]) {
        delete keys[keyToDelete];
        writeKeysLocal(keys);
        res.json({ success: true, message: 'Key deleted successfully.' });
    } else {
        res.json({ success: false, message: 'Key not found.' });
    }
});

// API: List all keys for generator table
app.get('/api/keys', async (req, res) => {
    const keys = await getKeys();
    res.json(keys);
});

function findKeyRecord(keysObj, rawKey) {
    if (!keysObj || !rawKey) return null;
    const clean = rawKey.trim().toUpperCase().replace(/\s+/g, '');

    if (keysObj[clean]) return { keyStr: clean, data: keysObj[clean] };
    if (keysObj[rawKey]) return { keyStr: rawKey, data: keysObj[rawKey] };

    for (const k in keysObj) {
        if (k.trim().toUpperCase().replace(/\s+/g, '') === clean) {
            return { keyStr: k, data: keysObj[k] };
        }
    }

    return null;
}

// API: Verify key (Key requirement disabled)
app.post('/api/verify', async (req, res) => {
    return res.json({ valid: true, activated: true, message: 'No key required.' });
});

// API: Activate key (Key requirement disabled)
app.post('/api/activate', async (req, res) => {
    return res.json({ success: true, message: 'No key required.' });
});

// ==========================================================================
// IP-BASED USER SETTINGS STORAGE (Currency & PayPal Welcome Name)
// ==========================================================================
const SETTINGS_FILE = path.join(__dirname, 'user_settings.json');

function readSettingsLocal() {
    try {
        if (!fs.existsSync(SETTINGS_FILE)) {
            fs.writeFileSync(SETTINGS_FILE, JSON.stringify({}));
        }
        const data = fs.readFileSync(SETTINGS_FILE, 'utf8');
        return JSON.parse(data || '{}');
    } catch (e) {
        return {};
    }
}

function writeSettingsLocal(settings) {
    try {
        fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));
    } catch (e) {
        console.error('Error writing settings:', e);
    }
}

function getClientIp(req) {
    return req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
}

// GET /api/user-settings
app.get('/api/user-settings', (req, res) => {
    const ip = getClientIp(req);
    const settingsMap = readSettingsLocal();
    const userSettings = settingsMap[ip] || { currency: 'GBP', paypalName: 'Mark' };
    res.json({ success: true, ip, settings: userSettings });
});

// POST /api/user-settings
app.post('/api/user-settings', (req, res) => {
    const ip = getClientIp(req);
    const { currency, paypalName } = req.body;
    const settingsMap = readSettingsLocal();

    const current = settingsMap[ip] || {};
    settingsMap[ip] = {
        currency: currency || current.currency || 'GBP',
        paypalName: paypalName !== undefined ? paypalName : (current.paypalName || 'Mark'),
        updatedAt: new Date().toISOString()
    };

    writeSettingsLocal(settingsMap);
    res.json({ success: true, ip, settings: settingsMap[ip] });
});

// Start Server
app.listen(PORT, () => {
    console.log(`GTA 6 pre-order server running on http://localhost:${PORT}`);
});
