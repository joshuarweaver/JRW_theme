# Deploy Notion Proxy to Cloudflare Workers 🚀

## Why Cloudflare Workers?
- **100% Free** (100,000 requests/day)
- **Lightning Fast** (edge computing worldwide)
- **Perfect for CORS proxies**
- **No server management needed**

## Quick Deployment (Browser Method)

### Option 1: Cloudflare Dashboard (Easiest)

1. **Go to Cloudflare Workers Dashboard**
   - Visit: https://dash.cloudflare.com/
   - Sign up for free if needed
   - Go to **Workers & Pages** → **Create application** → **Create Worker**

2. **Create the Worker**
   - Name it: `notion-proxy`
   - Click **Deploy**

3. **Add the Code**
   - Click **Edit Code**
   - **Delete all existing code**
   - **Copy & paste** the entire contents of `worker.js`
   - Click **Save and Deploy**

4. **Get Your Worker URL**
   - You'll get a URL like: `https://notion-proxy.your-username.workers.dev`
   - **This is your new proxy URL!**

### Option 2: Wrangler CLI (Advanced)

```bash
# Install Wrangler CLI
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy the worker
wrangler deploy
```

## Update Your Ghost Pro Site

### Step 1: Update Glossary Config

In your Ghost Pro admin, edit your **Marketing Glossary** page and update the JavaScript configuration:

```javascript
// Replace localhost:3001 with your Cloudflare Worker URL
window.GLOSSARY_CONFIG = {
    notionDatabaseId: '1fe41244bb3681f6b3bdf781bad81b8e',
    notionToken: 'your_notion_token_here',
    useLocalProxy: true,
    corsProxy: 'https://notion-proxy.your-username.workers.dev/api/notion/database/'
}
```

### Step 2: Test It

Your glossary should now work on Ghost Pro! The Worker will:
- ✅ Handle CORS issues
- ✅ Forward requests to Notion API
- ✅ Return data to your Ghost site

## Worker URL Format

Your worker will respond to:
```
POST https://notion-proxy.your-username.workers.dev/api/notion/database/{DATABASE_ID}/query
```

## Free Tier Limits

- **100,000 requests per day** (more than enough for most sites)
- **Global edge locations** (faster than any server)
- **No usage charges** until you exceed limits

## Troubleshooting

### Check Worker Logs
- Go to your Worker in Cloudflare Dashboard
- Click **Logs** tab to see real-time debugging

### Common Issues
1. **CORS errors**: Worker handles these automatically
2. **Database not found**: Check your database ID
3. **Token errors**: Verify your Notion integration token

## Security Notes

- Your Notion token is sent through the proxy (necessary for API access)
- Worker runs on Cloudflare's secure edge network
- No data is stored or logged permanently
- Consider rate limiting for public sites

---

🎉 **Your Notion API is now ready for Ghost Pro!** 