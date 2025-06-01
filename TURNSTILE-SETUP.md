# Cloudflare Turnstile CAPTCHA Setup Guide (Ghost Pro Compatible)

This guide explains how to complete the Cloudflare Turnstile CAPTCHA integration for your Ghost theme on Ghost Pro.

## Ghost Custom Settings Setup

Since Ghost Pro doesn't support environment variables or custom middleware, we use Ghost's custom settings feature instead.

### 1. Add Custom Settings to Ghost Admin

1. Go to your Ghost Admin panel
2. Navigate to **Settings** → **Design** → **Site-wide**
3. Scroll down to **Site-wide head** or use the **Code injection** section
4. Add the following custom settings by adding this to your site-wide head:

```html
<script>
window.GHOST_CUSTOM_SETTINGS = {
    turnstile_site_key: '0x4AAAAAABfhI_PYfudwrG75'
};
</script>
```

**OR** if your theme supports custom settings, add this to your theme's `package.json`:

```json
{
  "config": {
    "custom": {
      "turnstile_site_key": {
        "type": "text",
        "default": "0x4AAAAAABfhI_PYfudwrG75"
      }
    }
  }
}
```

### 2. Cloudflare Turnstile Configuration

1. Go to the [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to "Turnstile" in the sidebar
3. Create a new site or use an existing one
4. Copy your Site Key and Secret Key
5. Update the site key in your Ghost settings

## Files Modified

The following files have been updated with Turnstile integration:

### Theme Files
- `content/themes/source/default.hbs` - Added Turnstile script and configuration
- `content/themes/source/partials/email-subscription.hbs` - Added CAPTCHA to email subscription form
- `content/themes/source/partials/components/membership.hbs` - Added CAPTCHA to membership forms
- `content/themes/source/home.hbs` - Added CAPTCHA to horizontal subscribe form
- `content/themes/source/post.hbs` - Added CAPTCHA to post page forms
- `content/themes/source/tag.hbs` - Added CAPTCHA to tag page form
- `content/themes/source/assets/css/screen.css` - Added Turnstile styling

### Dependencies
- `package.json` - Added node-fetch dependency (for local development only)

## Features Added

1. **Required Name Field**: All signup forms now include a required name field
2. **Turnstile CAPTCHA**: Each form includes a Cloudflare Turnstile widget
3. **Form Validation**: Submit buttons are disabled until CAPTCHA is completed
4. **Client-side Validation**: Forms validate CAPTCHA completion before submission
5. **Responsive Design**: CAPTCHA widgets are styled to match your theme
6. **Ghost Pro Compatible**: Uses Ghost custom settings instead of environment variables

## Installation Steps

### For Ghost Pro:

1. Upload your theme files to Ghost Pro
2. Go to **Settings** → **Design** → **Site-wide**
3. Add your Turnstile site key to the custom settings
4. Activate your theme
5. Test the forms to ensure CAPTCHA is working correctly

### For Self-hosted Ghost:

1. Install the theme in your Ghost installation
2. Add custom settings as described above
3. Restart Ghost
4. Test the forms

## Configuration

### Site Key Setup
The site key is configured in `default.hbs` and will use:
1. `{{@custom.turnstile_site_key}}` if set in Ghost custom settings
2. Fallback to the default test key: `0x4AAAAAABfhI_PYfudwrG75`

### Styling
The CAPTCHA widget styling can be customized in `screen.css`. The current styling:
- Centers the widget
- Adds appropriate margins
- Responsive design for mobile devices
- Matches your existing form styling

## Important Notes for Ghost Pro

### Server-side Validation Limitations
⚠️ **Important**: Ghost Pro doesn't support custom server-side validation middleware. This implementation provides:

1. **Client-side validation** - Prevents form submission without CAPTCHA
2. **Visual feedback** - Disables submit button until CAPTCHA is completed
3. **Basic security** - Makes it harder for bots to submit forms

### Enhanced Security Options
For stronger server-side validation, you would need:
1. **Self-hosted Ghost** with custom middleware
2. **External webhook** to validate tokens
3. **Cloudflare Workers** to intercept and validate requests
4. **Third-party service** integration

## Security Notes

- The current implementation provides client-side protection
- For maximum security, server-side validation is recommended
- Monitor your Ghost analytics for spam reduction
- Consider additional measures for high-traffic sites

## Troubleshooting

1. **CAPTCHA not loading**: 
   - Check that the Turnstile script is loaded
   - Verify your site key is correct
   - Check browser console for errors

2. **Site key not working**: 
   - Verify the key in Ghost custom settings
   - Check the domain configuration in Cloudflare

3. **Styling issues**: 
   - Check CSS conflicts with existing styles
   - Test responsive design on various devices

4. **Forms still submitting without CAPTCHA**:
   - Check JavaScript console for errors
   - Verify the form validation scripts are loading

## Testing

1. Test all forms across different pages
2. Verify CAPTCHA appears and functions correctly
3. Test form submission with and without completing CAPTCHA
4. Check responsive design on mobile devices
5. Monitor for any JavaScript errors

## Next Steps

1. Monitor signup form completion rates
2. Check Ghost analytics for spam reduction
3. Consider implementing server-side validation if needed
4. Test thoroughly across all devices and browsers
5. Monitor Cloudflare Turnstile analytics for insights 