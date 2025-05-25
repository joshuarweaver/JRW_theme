/**
 * Marketing Glossary - Notion Configuration
 * 
 * This file contains the configuration for your Notion API integration.
 * Database ID is pre-configured, and the integration token can be set via Ghost admin.
 */

// Configuration object - DO NOT MODIFY THE IDs HERE
window.GLOSSARY_CONFIG = {
    // Your Notion Database ID (NEVER CHANGE THIS!)
    notionDatabaseId: '1fe41244bb3681f6b3bdf781bad81b8e',
    
    // Integration token will be loaded from Ghost custom settings
    notionToken: '', // This will be populated from Ghost admin settings
    
    // CORS Proxy Configuration
    useLocalProxy: true,
    
    // ✅ Same-origin API (no CORS issues!)
    corsProxy: '/api/notion/database/',
    
    // Property mapping for Notion database
    propertyMapping: {
        name: 'Term',        // The title/name field in your database
        definition: 'Definition',
        category: 'Category',
        tags: 'Tags'
    },
    
    // UI Configuration
    ui: {
        enableCaching: true,
        cacheDuration: 5 * 60 * 1000, // 5 minutes
        enableSearch: true,
        enableCategoryFilter: true,
        enableAlphabetFilter: true,
        enableModal: true,
        previewLength: 120
    },
    
    // Theme customization (optional)
    theme: {
        primary: '#2563eb',
        secondary: '#f1f5f9',
        accent: '#0ea5e9'
    }
};

/**
 * Clear saved configuration (use if things get mixed up)
 */
window.clearGlossaryConfig = function() {
    localStorage.removeItem('glossary_config');
    console.log('🧹 Cleared saved configuration. Refresh the page to reload defaults.');
};

/**
 * Load configuration from Ghost custom settings - MANUAL VERSION
 */
window.loadGlossarySettings = function() {
    console.log('🔧 Loading glossary configuration...');
    
    // Set the correct values explicitly
    const CORRECT_DATABASE_ID = '1fe41244bb3681f6b3bdf781bad81b8e';
    let tokenFromGhost = '';
    
    // Try to get token from Ghost custom settings first
    if (window.ghostCustomSettings && window.ghostCustomSettings.notion_integration_token) {
        tokenFromGhost = window.ghostCustomSettings.notion_integration_token;
        console.log('✅ Found token from Ghost custom settings');
    }
    
    // Fallback to localStorage (for backward compatibility)
    if (!tokenFromGhost) {
        tokenFromGhost = localStorage.getItem('notion_token') || '';
        if (tokenFromGhost) {
            console.log('✅ Found token from localStorage (fallback)');
        }
    }
    
    // Update the configuration
    if (window.GLOSSARY_CONFIG) {
        window.GLOSSARY_CONFIG.notionDatabaseId = CORRECT_DATABASE_ID;
        window.GLOSSARY_CONFIG.notionToken = tokenFromGhost;
        
        console.log('📋 Final Configuration:');
        console.log('- Database ID:', window.GLOSSARY_CONFIG.notionDatabaseId);
        console.log('- Token length:', window.GLOSSARY_CONFIG.notionToken.length);
        console.log('- Token starts with ntn_:', window.GLOSSARY_CONFIG.notionToken.startsWith('ntn_'));
        console.log('- CORS Proxy:', window.GLOSSARY_CONFIG.corsProxy);
        console.log('- Use Local Proxy:', window.GLOSSARY_CONFIG.useLocalProxy);
        
        return {
            success: true,
            databaseId: window.GLOSSARY_CONFIG.notionDatabaseId,
            hasToken: !!window.GLOSSARY_CONFIG.notionToken,
            corsProxy: window.GLOSSARY_CONFIG.corsProxy
        };
    }
    
    console.error('❌ GLOSSARY_CONFIG not found!');
    return { success: false, error: 'GLOSSARY_CONFIG not found' };
};

/**
 * Helper function to quickly set up configuration
 * Usage in browser console:
 * setupGlossaryConfig('your-integration-token', 'your-database-id');
 */
window.setupGlossaryConfig = function(token, databaseId) {
    if (!token || !databaseId) {
        console.error('❌ Both token and databaseId are required');
        return false;
    }
    
    // Store in localStorage for persistence
    localStorage.setItem('notion_token', token);
    localStorage.setItem('notion_database_id', databaseId);
    
    // Update current config
    if (window.GLOSSARY_CONFIG) {
        window.GLOSSARY_CONFIG.notionToken = token;
        window.GLOSSARY_CONFIG.notionDatabaseId = databaseId;
    }
    
    console.log('✅ Glossary configuration updated successfully!');
    console.log('🔄 Reloading page to apply changes...');
    
    // Reload the page to reinitialize
    setTimeout(() => {
        window.location.reload();
    }, 1000);
    
    return true;
};

/**
 * Validation helper
 */
window.validateGlossaryConfig = function() {
    const config = window.GLOSSARY_CONFIG;
    const issues = [];
    
    if (!config.notionDatabaseId || config.notionDatabaseId === 'REPLACE_WITH_YOUR_32_CHAR_DATABASE_ID') {
        issues.push('❌ Notion Database ID is missing or not configured');
        issues.push('💡 Replace REPLACE_WITH_YOUR_32_CHAR_DATABASE_ID in glossary-config.js');
        issues.push('💡 Find your database ID in the Notion URL: https://notion.so/workspace/DATABASE_ID?v=...');
    } else if (config.notionDatabaseId.length !== 32) {
        issues.push('⚠️ Database ID should be 32 characters long');
    }
    
    if (!config.notionToken) {
        issues.push('❌ Notion Integration Token is missing');
        issues.push('💡 Please configure it in Ghost Admin → Design → Change theme → Theme settings');
    } else if (!config.notionToken.startsWith('ntn_')) {
        issues.push('⚠️ Integration token should start with "ntn_"');
    }
    
    if (issues.length === 0) {
        console.log('✅ Configuration looks good!');
        return true;
    } else {
        console.log('Configuration issues:');
        issues.forEach(issue => console.log(issue));
        return false;
    }
};

// NOTE: Auto-validation removed - configuration is now loaded manually
// after Ghost custom settings are available 

// Auto-load settings when this script loads
if (typeof window !== 'undefined') {
    // Give Ghost settings time to load first
    setTimeout(() => {
        window.loadGlossarySettings();
    }, 100);
} 