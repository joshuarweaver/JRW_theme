# Marketing Glossary - Notion Integration Setup Guide

This guide will help you set up a dynamic marketing glossary page that pulls data from your Notion database.

## Features

✅ **Dynamic Content**: Automatically fetches terms from your Notion database  
✅ **Search & Filter**: Real-time search with category and alphabetical filtering  
✅ **Beautiful UI**: Modern, responsive design with modal popups  
✅ **SEO Friendly**: Clean URLs and structured content  
✅ **No Server Changes**: Pure client-side integration  

## Prerequisites

1. A Notion account with a marketing glossary database
2. Notion API integration set up
3. Ghost admin access to create pages

## Step 1: Set Up Your Notion Database

### Required Properties
Your Notion database should have these properties (names are flexible):

| Property Name | Type | Description | Required |
|---------------|------|-------------|----------|
| `Name` or `Term` or `Title` | Title | The marketing term | ✅ |
| `Definition` or `Description` | Rich Text | Term definition | ✅ |
| `Category` | Select | Term category (SEO, Content, etc.) | ⚠️ Optional |
| `Tags` | Multi-select | Related tags | ⚠️ Optional |

### Example Database Structure
```
Name: "Search Engine Optimization"
Definition: "The practice of increasing the quantity and quality of traffic to your website through organic search engine results."
Category: "SEO"
Tags: ["SEO", "Digital Marketing", "Traffic"]
```

## Step 2: Create a Notion Integration

1. Go to [https://www.notion.so/my-integrations](https://www.notion.so/my-integrations)
2. Click **"+ New integration"**
3. Fill in the details:
   - **Name**: "Ghost Marketing Glossary"
   - **Associated workspace**: Choose your workspace
   - **Capabilities**: Select "Read content"
4. Click **"Submit"**
5. Copy the **Internal Integration Token** (starts with `ntn_`)

## Step 3: Share Your Database with the Integration

1. Open your Notion database
2. Click the **"Share"** button (top right)
3. Click **"Invite"**
4. Search for your integration name ("Ghost Marketing Glossary")
5. Select it and click **"Invite"**

## Step 4: Get Your Database ID

Your database ID is in the URL when viewing your database:
```
https://notion.so/yourworkspace/DATABASE_ID?v=...
```

Copy the `DATABASE_ID` part (it's a 32-character string).

## Step 5: Configure Ghost Admin Settings

1. Go to Ghost Admin → **Design** → **Change theme**
2. Click **"Theme settings"** 
3. Find the **"Integrations"** section
4. In the **"Notion Integration Token"** field, paste your token (starts with `ntn_`)
5. Click **"Save"**

## Step 6: Update Database ID (Required!)

You need to configure your database ID in the configuration file:

1. Edit `content/themes/source/assets/js/glossary-config.js`
2. Replace `REPLACE_WITH_YOUR_32_CHAR_DATABASE_ID` with your actual database ID from Step 4
3. Example: `notionDatabaseId: '1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p'`

**Important**: The template now uses a CORS proxy to bypass browser restrictions. This works for development/testing but consider a server-side solution for production.

## Step 7: Create the Ghost Page

1. Go to your Ghost Admin → **Pages**
2. Click **"New page"**
3. Set the page settings:
   - **Title**: "Marketing Glossary"
   - **URL**: `/marketing-glossary/`
   - **Page template**: Select `marketing-glossary`
4. Add some introductory content if desired
5. **Publish** the page

## Step 8: Test Your Setup

1. Visit your marketing glossary page (`/marketing-glossary/`)
2. You should see a loading spinner, then your terms appear
3. Test the search and filtering functionality
4. Click on terms to see the modal popup

## Troubleshooting

### Common Issues

**"Notion configuration is missing"**
- Check that you've set the integration token in Ghost Admin
- Verify the database ID is correct (32 characters, no spaces)

**"HTTP error! status: 401"**
- Integration token is incorrect or expired
- Make sure the token starts with `ntn_`
- Check that you pasted the token correctly in Ghost Admin

**"HTTP error! status: 403"**
- Database hasn't been shared with the integration
- Check Step 3 above

**"No terms found"**
- Database is empty
- Property names don't match (check property mapping in config)

### Quick Console Setup (Alternative)

If you need to quickly test without editing the config file:

1. Visit your marketing glossary page
2. Open browser developer tools (F12)
3. Go to the **Console** tab
4. Run: `setupGlossaryConfig('ntn_YOUR_TOKEN', 'YOUR_32_CHAR_DATABASE_ID')`

**Example**: `setupGlossaryConfig('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', '1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p')`

## Customization Options

### Styling
The template includes CSS custom properties for easy theming:

```css
.marketing-glossary-page {
    --glossary-primary: #2563eb;    /* Primary color */
    --glossary-secondary: #f1f5f9;  /* Background color */
    --glossary-accent: #0ea5e9;     /* Accent color */
    --glossary-text: #334155;       /* Text color */
    --glossary-border: #e2e8f0;     /* Border color */
}
```

### Property Mapping
If your Notion properties have different names, update the property mapping in `glossary-config.js`:

```javascript
propertyMapping: {
    name: 'YourTermProperty',           
    definition: 'YourDefinitionProperty', 
    category: 'YourCategoryProperty',
    tags: 'YourTagsProperty'
}
```

## Security Considerations

⚠️ **Important**: For production sites:

1. **Notion tokens are exposed client-side** - this is inherent to this approach
2. **Use read-only database permissions** 
3. **Consider server-side integration** for better security
4. **Regularly rotate your integration tokens**

## File Structure

After setup, your theme should have these files:

```
content/themes/source/
├── page-marketing-glossary.hbs     # Main template
├── assets/js/glossary-config.js    # Configuration
├── package.json                    # Updated with custom settings
└── MARKETING-GLOSSARY-SETUP.md     # This guide
```

## Support

If you encounter issues:

1. Check the browser console for error messages
2. Verify your Notion database structure
3. Test the Notion API directly using tools like Postman
4. Ensure your Ghost theme is properly configured

---

🎉 **Congratulations!** Your dynamic marketing glossary is now live and connected to Notion! 