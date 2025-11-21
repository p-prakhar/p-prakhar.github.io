# Content Templates

This directory contains templates for adding new content to your portfolio website. Copy these files and customize them as needed.

## Available Templates

### `new-page.md`
Use this to create a new top-level page (like About, Projects, Blog).
- Copy to `pages/your-page.md`
- Customize title, permalink, and content
- Update navigation weight if needed

### `new-project.md`
Use this to add a new project to your portfolio.
- Copy to `_projects/your-project.md`
- Add project image to `assets/img/projects/`
- Customize tools, description, and links

### `new-post.md`
Use this to create a new blog post.
- Copy to `_posts/YYYY-MM-DD-your-post-title.md`
- Use proper date format in filename
- Add relevant tags and styling

## Directory Structure

Your site uses an organized structure:

```
_includes/
├── components/     # Reusable UI components
├── layouts/        # Layout-specific includes
├── content/        # Content-type specific includes
└── shared/         # Shared utilities

pages/              # Top-level pages
_posts/             # Blog posts
_projects/          # Project portfolio items
_data/              # Site data files
```

## Adding New Content Types

1. Create a new directory under `_includes/content/` for your content type
2. Add appropriate layout or use the base templates
3. Create templates in this directory
4. Update navigation if needed

## Color System

All colors use CSS custom properties defined in `_sass/_colors.scss`. Use these classes:
- `.text-gradient-primary` - Gradient text effect
- `.text-secondary-custom` - Secondary text color
- `.text-muted-custom` - Muted text color

Avoid hardcoded colors - use the design system!
