# Hero Section Migration

This documents the new Hero section that has been migrated from the digital theme to the source theme.

## Files Added/Modified

### New Files:
- `partials/components/hero.hbs` - The main hero component template

### Modified Files:
- `assets/css/screen.css` - Added hero styles (section 7.5)
- `partials/components/header-content.hbs` - Added Hero layout option
- `home.hbs` - Updated to use Hero layout

## Features

The hero section includes:
- **Author Profile Image**: Automatically displays the first author's profile image
- **Hero Title**: Customizable title (defaults to marketing expert text)
- **Hero Description**: Customizable description (defaults to Josh's bio)
- **Email Subscription Form**: Newsletter signup functionality
- **Responsive Design**: Fully responsive with mobile optimizations
- **Modern Styling**: Glass-morphism background with gradient

## Customization

You can customize the hero section through Ghost's custom settings:

### Custom Settings (Optional):
- `hero_title` - Override the default title
- `hero_description` - Override the default description

### Default Content:
- **Title**: "Marketing Expert Shaping Purpose-Propelled Campaigns for Major Brands"
- **Description**: "Josh is a multidisciplinary force in branding and marketing, equal parts strategist, storyteller, and systems thinker. They lead purpose-driven campaigns that move hearts, minds, and society."

## Usage

The hero section is automatically enabled on the home page. To use it on other pages:

```handlebars
{{> "components/header" headerStyle="Hero"}}
```

## Styling

The hero section uses a modern design with:
- **Left-aligned layout** (not centered like the classic header)
- **Gradient background** with backdrop blur effect
- **Responsive typography** using clamp() functions
- **Smooth hover effects** on the author image
- **Dark mode support** through CSS custom properties

## Responsive Breakpoints

- **Desktop**: Full layout with 66% content width
- **Tablet (1199px)**: 75% content width
- **Mobile (767px)**: Full width with smaller images and text
- **Small Mobile (400px)**: Optimized for very small screens

## Browser Support

The hero section uses modern CSS features:
- CSS Custom Properties (IE11+)
- Clamp() functions (modern browsers)
- Backdrop-filter (modern browsers with fallback)
- CSS Grid and Flexbox (IE11+ with prefixes)

## Notes

- The author image is sourced from the first Ghost author
- The subscription form uses the existing Ghost email subscription system
- All text is internationalization-ready using Ghost's `{{t}}` helper
- The hero section gracefully degrades if no author image is available 