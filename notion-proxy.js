const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = 3001;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Proxy endpoint for Notion API
app.post('/api/notion/database/:databaseId/query', async (req, res) => {
    try {
        const { databaseId } = req.params;
        const { authorization, ...otherHeaders } = req.headers;
        
        console.log('\n🔄 NEW REQUEST TO NOTION API');
        console.log('📊 Database ID from URL:', databaseId);
        console.log('🔑 Authorization header:', authorization ? authorization.substring(0, 20) + '...' : 'MISSING');
        console.log('📋 Request body:', JSON.stringify(req.body, null, 2));
        
        // Validate inputs - accept any reasonable database ID length
        if (!databaseId || databaseId.length < 4) {
            console.error('❌ Invalid database ID length:', databaseId?.length);
            return res.status(400).json({ error: 'Invalid database ID format' });
        }
        
        if (!authorization || !authorization.startsWith('Bearer ntn_')) {
            console.error('❌ Invalid authorization format:', authorization);
            return res.status(400).json({ error: 'Invalid authorization token format' });
        }
        
        console.log('✅ Input validation passed');
        
        // Function to make the actual request
        const makeRequest = async (dbId, attempt = 1) => {
            console.log(`📤 Making request to Notion API (attempt ${attempt})...`);
            console.log(`🎯 Using Database ID: ${dbId}`);
            
            const response = await fetch(`https://api.notion.com/v1/databases/${dbId}/query`, {
                method: 'POST',
                headers: {
                    'Authorization': authorization,
                    'Content-Type': 'application/json',
                    'Notion-Version': '2022-06-28'
                },
                body: JSON.stringify(req.body)
            });
            
            const data = await response.json();
            console.log(`📥 Response status (attempt ${attempt}):`, response.status);
            
            return { response, data };
        };
        
        // Try the original format first
        let { response, data } = await makeRequest(databaseId, 1);
        
        // If 404 and the ID is 32 characters without dashes, try with dashes
        if (response.status === 404 && databaseId.length === 32 && !databaseId.includes('-')) {
            console.log('❌ First attempt failed with 404, trying with UUID format...');
            const dashedId = databaseId.replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, '$1-$2-$3-$4-$5');
            console.log(`🔧 Trying with dashes: ${dashedId}`);
            
            const result = await makeRequest(dashedId, 2);
            response = result.response;
            data = result.data;
        }
        // If 404 and the ID has dashes, try without dashes
        else if (response.status === 404 && databaseId.includes('-')) {
            console.log('❌ First attempt failed with 404, trying without dashes...');
            const noDashId = databaseId.replace(/-/g, '');
            console.log(`🔧 Trying without dashes: ${noDashId}`);
            
            const result = await makeRequest(noDashId, 2);
            response = result.response;
            data = result.data;
        }
        
        console.log('📥 Final response headers:', Object.fromEntries(response.headers.entries()));
        
        if (!response.ok) {
            console.error('❌ Notion API Error:', response.status, JSON.stringify(data, null, 2));
            return res.status(response.status).json(data);
        }
        
        console.log('✅ Success! Found', data.results?.length || 0, 'results');
        console.log('📋 First result sample:', data.results?.[0] ? 'Has data' : 'No results');
        
        res.json(data);
        
    } catch (error) {
        console.error('❌ Proxy Error:', error.message);
        console.error('❌ Full error:', error);
        res.status(500).json({ error: 'Proxy server error', details: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`
🚀 Notion CORS Proxy Server running on http://localhost:${PORT}

📋 Usage:
   Update your glossary config to use: http://localhost:${PORT}/api/notion/database/

⚠️  This is for development only. For production, implement server-side integration.
    `);
});

module.exports = app; 