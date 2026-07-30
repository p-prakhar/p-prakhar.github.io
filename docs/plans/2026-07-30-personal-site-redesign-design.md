# Personal Site Redesign — Design Specification

**Date:** 2026-07-30  
**Status:** Implemented and locally verified; awaiting owner push  
**Repository:** `p-prakhar/p-prakhar.github.io`  
**Deployment branch:** `jekyll`

## Summary

Replace the current animation-heavy portfolio with a custom, content-first Jekyll site. The redesign keeps GitHub Pages and the existing content model where useful, but removes Three.js and theme-level visual weight.

The result should feel like a small personal publication:

- warm editorial light mode;
- warm-ink dark mode;
- responsive, phone-first navigation and reading;
- one Writing library for long-form tech, travel, life, and essay posts;
- a lightweight Now timeline for shorter updates;
- a complete, public-safe Work/CV page;
- small music-and-stars details that add personality without becoming ambient spectacle;
- helper commands that remove Markdown filename and front-matter bookkeeping.

## Goals

1. Make writing the primary purpose of the site.
2. Make the site fast, readable, and comfortable from 320px phones through large desktops.
3. Preserve a distinct personal identity without a heavy animation system.
4. Make all resume categories accessible from the Work page while protecting private and internal information.
5. Make posts, updates, and music favorites easy to maintain.
6. Preserve stable article URLs and the current GitHub Pages deployment model.
7. Ensure all redesign commits are authored and committed as `Prakhar Pandey <3.14prakhar@gmail.com>`.

## Non-goals

- No CMS, database, authentication, or server-side application.
- No migration to Astro, Eleventy, React, or another generator.
- No Three.js scenes, particle fields, parallax, scroll-jacking, animated loaders, or continuous decorative loops.
- No corporate Jira/change IDs, internal links, customer/setup details, unpublished metrics, or corporate contact identity.
- No automatic or background audio.
- No push from the agent.

## Approved Direction

### Foundation

Use a custom Jekyll redesign in the existing repository. Preserve content and deployment compatibility while replacing the presentation layer.

### Visual character

- **Light:** warm paper background, charcoal text, muted terracotta accents.
- **Dark:** near-black warm brown, parchment text, softened terracotta accents.
- **Headline treatment:** editorial serif with a contrasting italic terracotta treatment on the word `notice.` in the Home headline.
- **UI text:** restrained system sans-serif for navigation, dates, tags, controls, and metadata.
- **Fonts:** local/system stacks only; no remote font request.
- **Personality:** music and stars, expressed through a wink, an interactive star-note divider, a daily favorite, and a tiny playable footer piano.

Representative design tokens:

```scss
--paper: #f4efe5;
--paper-text: #29251f;
--paper-muted: #6f665c;
--paper-accent: #a4432d;

--ink: #191612;
--ink-text: #eee5d8;
--ink-muted: #b9ada0;
--ink-accent: #df8f71;
```

Final values may be adjusted slightly during contrast testing while retaining the approved palette.

The Home page is typography-led and has no large hero portrait or decorative scene. The current configured portrait path does not resolve to a repository asset, so About remains typography-led unless the user later supplies a valid portrait; its absence must not leave a gap.

## Information Architecture

Primary navigation:

1. Writing
2. Now
3. Work
4. About

The site name links to Home. Contact and social links live in the footer.

### Home

Home is a concise entry point rather than a complete résumé:

- short identity line;
- headline: “I build storage systems and write down what I *notice.*”;
- brief introduction;
- latest three articles;
- newest Now excerpt;
- small selected-work preview;
- UTC-daily music favorite;
- contact links.

Writing is the primary action.

### Writing

One reverse-chronological article library:

- categories: `tech`, `travel`, `life`, and `essay`;
- free-form tags;
- category filters as progressive enhancement;
- title, date, summary, category, tags, and estimated reading time;
- no card maze on phones; use simple editorial rows.

Existing article URLs under `/blog/<title>` remain valid. `/writing/` is the main index, and the old `/blog/` index leads readers to it.

### Now

A reverse-chronological collection of shorter updates that do not need a full article:

- date;
- short title;
- Markdown body;
- optional location;
- optional reading item;
- optional tags.

Music is not stored per update. A separate favorites list supplies the daily music item.

The newest published update automatically supplies the Home excerpt.

### Work

One complete, printable professional page:

- profile;
- experience;
- open-source work;
- one unified Projects section;
- skills;
- education;
- honors and awards;
- leadership and community work;
- coursework.

Projects are ordered strongest-first using `prakhar.tex` / `prakhar.pdf` as the source. They are not split into “selected” and “personal” sections.

The page includes a print stylesheet and “Print / save as PDF” action. The current resume PDF is not published because it contains a phone number and can become stale.

“Complete” means that every approved resume category and public-safe claim is represented. It does not mean reproducing private contact details or internal wording literally.

### About

A personal introduction that complements rather than repeats Work:

- interests and values;
- music;
- travel;
- systems work and learning;
- links to Now, Writing, and contact.

### 404

A small, useful error page with links to Writing, Now, Work, and Home. It may use the approved star/music motif but must remain lightweight.

## Content Models

### Long-form post

Location:

```text
_posts/YYYY-MM-DD-slug.md
```

Front matter:

```yaml
---
title: "Post title"
description: "One-sentence summary for lists and metadata."
category: tech
tags:
  - c++
  - performance
published: false
---
```

Rules:

- `category` must be one of `tech`, `travel`, `life`, or `essay`;
- `description` is required;
- filename date is the publication date;
- reading time is derived at render time;
- `published: false` is the safe default.

### Now update

Location:

```text
_updates/YYYY-MM-DD-slug.md
```

Front matter:

```yaml
---
title: "Short update title"
date: 2026-07-30
location:
reading:
tags: []
published: false
---
```

The body is short Markdown. Optional fields disappear cleanly when absent.

The implementation must prove that the GitHub-compatible Jekyll version excludes unpublished collection documents. If it does not, unpublished updates move to a dedicated non-rendered draft directory and the helper copies them into `_updates` on publish.

### Projects

Keep the `_projects` collection and normalize its front matter:

```yaml
---
name: "Project name"
order: 10
tools:
  - C++
description: "Public-safe description."
external_url:
repository_url:
image:
---
```

Lower `order` values render first. A missing image never leaves an empty visual placeholder.

### Structured professional content

Use small YAML data files rather than duplicated page copy. Expected groups:

```text
_data/profile.yml
_data/experience.yml
_data/education.yml
_data/skills.yml
_data/honors.yml
_data/leadership.yml
```

Projects remain collection documents because they benefit from individual Markdown bodies and optional links.

### Music favorites

Location:

```text
_data/music.yml
```

Shape:

```yaml
- title: "Track title"
  artist: "Artist"
  url: "https://..."
```

Behavior:

- Jekyll renders the complete list as safe JSON.
- A deterministic hash of the current UTC date chooses one index.
- Every visitor sees the same item for that UTC date.
- The first list item is the no-JavaScript fallback.
- An empty list hides the module.
- Links are optional and use safe external-link attributes.

The initial favorites must come from the user; production content must not invent songs.

## Responsive UX

### Mobile header

Use two calm rows:

1. name/home link and labeled appearance control;
2. four evenly spaced destinations: Writing, Now, Work, About.

This avoids a hidden hamburger and keeps every destination visible. Controls have at least 44px touch targets.

The header does not consume reading space as a permanently fixed element.

### Reading

- Article prose targets an 18px-equivalent mobile size and generous line height.
- Desktop line length stays near 65–72 characters.
- Page gutters use `clamp()` and safe-area insets.
- Images are responsive, retain intrinsic dimensions, and include captions where useful.
- No hover is required to reach content or navigation.
- Article metadata stacks cleanly on narrow screens.

### Lists and long pages

- Writing uses rows rather than multi-column cards on phones.
- Now dates stack above content when a date column becomes cramped.
- Work uses wrapped jump links, not hidden accordions, so all professional content remains searchable and printable.

## Theme Behavior

- Initial theme follows `prefers-color-scheme`.
- A labeled appearance button allows explicit light/dark selection.
- A manual choice persists locally.
- The early theme bootstrap avoids a light/dark flash.
- Storage access is wrapped safely; if unavailable, the system preference remains in effect.
- Both palettes meet contrast requirements for text, controls, links, and focus states.

## Motion and Personal Cues

Motion is brief, local, and optional.

Approved interactions:

1. **Logo wink:** `Prakhar :)` changes to `Prakhar ;)` on hover or keyboard focus.
2. **Theme icon:** sun/moon turns over while the palette changes immediately.
3. **Article rows:** a small directional arrow nudges; surrounding layout does not move.
4. **Page arrival:** only the introductory lines may settle upward by at most 6px, once.
5. **Star-note divider:** eight stars connect into a simple musical note.
6. **Footer piano:** visible keys depress and play a short synthesized note only after a deliberate click, tap, or keyboard activation.

The expanding hand-drawn underline concept is explicitly rejected.

### Star-note divider

- Exactly eight visible stars.
- No minor/background points.
- No automatic connection.
- On hover, keyboard focus, or deliberate tap, eight separate edges connect one by one.
- Each segment completes before the next begins.
- Expected total reveal is approximately 1.55 seconds.
- On pointer exit or a second tap, the connection can reset.
- The reserved divider never changes dimensions.
- The ornament is not placed between every small block; use it sparingly at major editorial boundaries.

Literal hover-only behavior is not acceptable because touchscreens have no hover. Tap and keyboard focus are equivalent user-initiated triggers.

### Motion accessibility

`prefers-reduced-motion: reduce` removes nonessential transitions. Content, labels, and interaction meaning remain available.

## Footer Piano

- Small, footer-only keyboard.
- No imported audio files and no autoplay.
- Use Web Audio oscillators only after a user gesture.
- Keep gain low, duration short, and note count small.
- Keyboard buttons have meaningful labels.
- If Web Audio is missing or blocked, visual key feedback still works without an error.
- Audio contexts are created lazily and reused.

## Technical Architecture

### Jekyll layer

Expected layouts:

```text
_layouts/default.html
_layouts/home.html
_layouts/page.html
_layouts/post.html
_layouts/update.html
```

Expected includes:

```text
_includes/header.html
_includes/footer.html
_includes/theme-toggle.html
_includes/article-row.html
_includes/star-note.html
_includes/daily-music.html
_includes/footer-piano.html
_includes/seo.html
```

Exact names may be consolidated if an include would otherwise be trivial.

### Styles

One primary SCSS entry point, split only where it improves maintenance:

```text
assets/css/site.scss
_sass/_tokens.scss
_sass/_base.scss
_sass/_layout.scss
_sass/_components.scss
_sass/_content.scss
_sass/_print.scss
```

No Bootstrap dependency is needed for the redesigned pages.

### JavaScript

One deferred, dependency-free entry point:

```text
assets/js/site.js
```

Responsibilities:

- theme persistence;
- category filtering;
- UTC-daily music selection;
- tap state for the star-note ornament;
- footer piano Web Audio.

The script should be organized as small initializers that return early when their target element is absent.

The production workflow already builds with Jekyll safe mode. The redesign therefore uses only the GitHub Pages plugin set, Liquid, includes, and static assets—no custom Jekyll plugin.

Authoring-only paths such as `docs/`, helper tests/fixtures, and the root `site` executable must be added to `_config.yml` exclusions so they are never copied into the public `_site` artifact.

### Progressive enhancement

Without JavaScript:

- all navigation works;
- every published article remains visible;
- category controls do not hide content;
- the first favorite is visible;
- theme follows the system preference;
- the star-note remains as eight static points;
- piano keys remain decorative controls without sound.

## Public Content Policy

### Source hierarchy

1. The sibling resume sources `../resume/prakhar.tex` and `../resume/prakhar.pdf` for public dates, categories, and professional claims.
2. Existing site posts/projects for already-published personal material.
3. Personal Nutanix notes and Glean only for discovery and corroboration.

Notes or Glean must not be copied directly into a public page.

### Nutanix material

Public summaries may describe:

- C++ storage systems;
- NVMe/SPDK and dense-storage scaling;
- reliability and performance work;
- allocator and Linux internals work;
- open-source contributions;
- profiling and internal-tooling themes;
- mentoring, interviewing, and technical leadership;
- hackathon work already represented in public/resume material.

Exclude:

- Jira/change IDs;
- customer, cluster, or setup names;
- internal links or source paths;
- colleague names;
- unreleased projects;
- unpublished metrics;
- claims supported only by internal search.

Each accomplishment should state the broad challenge, Prakhar's contribution, and a defensible outcome.

### Contact and identity

Public:

- `3.14prakhar@gmail.com`;
- GitHub `p-prakhar`;
- LinkedIn profile.

Not public:

- personal phone number;
- corporate email;
- corporate GitHub identity as the primary profile.

Prefer upstream open-source links over corporate-fork profile links where possible.

## Authoring Helper

Provide one executable Ruby helper named `./site`. Ruby is already required by Jekyll, so this adds no runtime family.

Commands:

```text
./site new post
./site new update
./site preview
./site publish <path>
./site check
./site music add
./site music remove
```

### Required behavior

- Interactive prompts are concise and validate required values.
- Post categories are validated against the four approved categories.
- Slugs are normalized predictably.
- Existing paths are never overwritten.
- New posts and updates default to unpublished.
- Publish sets the final date/filename and changes publication state.
- Preview includes unpublished content and enables live reload.
- Check runs a strict production build.
- Music add/remove preserves valid YAML and never removes an entry without confirmation.
- Failures print a concrete message and return a nonzero exit status.

The repository README includes a short create → preview → publish → commit guide and direct-edit examples for users who do not want the helper.

## SEO, Feeds, and Metadata

- Unique title and description per page.
- Canonical URL.
- Open Graph and social-card metadata.
- RSS feed for long-form Writing.
- Sitemap.
- Semantic article dates and headings.
- Existing `_config.yml` author/social information is normalized to the personal identity.
- No metadata references the corporate account.

Prefer GitHub Pages-supported plugins already compatible with the repository. Do not add a plugin when a small include is sufficient.

Feed, sitemap, and SEO plugins must be explicitly enabled in `_config.yml` only after confirming they are present in the `github-pages` bundle and still pass the workflow's `--safe` build.

## Accessibility

- Semantic header, navigation, main, article, aside, and footer landmarks.
- A skip link.
- Visible keyboard focus in both themes.
- No hover-only access to information.
- Labeled theme and piano controls.
- Active Writing filters expose state with `aria-pressed`.
- Decorative SVG is hidden from assistive technology; meaningful SVG has an accessible name.
- Heading order does not skip levels.
- Touch targets are at least 44px where practical.
- Reduced-motion behavior is tested.
- Print output remains legible without color.

## Performance

Targets for a typical text page, excluding article photography:

- no Three.js, Bootstrap JS, jQuery, or icon-font request;
- no remote web-font request;
- dependency-free site JavaScript;
- combined custom CSS and JavaScript kept small enough to remain comfortably below the weight of the removed 3D dependencies;
- responsive/lazy-loaded noncritical images;
- no layout shift from theme controls, icons, or ornaments;
- Lighthouse performance, accessibility, best-practices, and SEO targets of 95+ where local tooling permits reliable measurement.

## Migration

1. Inventory current routes, posts, projects, data, images, and active includes.
2. Review the existing modification to `_layouts/portfolio-3d.html` before replacement.
3. Leave untracked `ai_studio_code.html` untouched unless it becomes an explicitly approved source.
4. Add the new design system and layouts without deleting legacy files.
5. Migrate Home, Writing, Now, Work, About, and 404.
6. Normalize existing posts and projects while preserving article permalinks and original prose unless an edit is required for correctness.
7. Add public-safe professional data from the resume and corroborated sources.
8. Add helper commands and documentation.
9. Confirm no rendered page references the old theme.
10. Remove obsolete active dependencies and files only after a strict production build succeeds.

Placeholder timeline text, including current lorem-ipsum entries, is replaced rather than migrated as public content.

## Failure Handling

- Empty collections render a short, intentional empty state rather than broken markup.
- Missing optional project images do not reserve blank space.
- Broken or absent favorite links render plain title/artist text.
- Invalid theme storage is ignored.
- Web Audio failures are caught and do not affect navigation.
- JavaScript initializer failures are isolated so one enhancement cannot disable the rest.
- The helper validates before writing and uses temporary files for YAML rewrites where practical.
- Strict front-matter failures stop `./site check`.

## Verification

### Automated

- `bundle exec jekyll build --strict_front_matter`
- helper command tests using Ruby's standard test tooling;
- production build with JavaScript and CSS asset paths resolved;
- checks that existing post URLs are still generated;
- checks that unpublished posts and updates are absent from production output.

### Manual/browser

- widths: 320, 375, 768, 1024, and 1440px;
- light, dark, and system-preference behavior;
- keyboard-only navigation;
- reduced-motion mode;
- JavaScript disabled;
- empty music and missing optional fields;
- daily music remains stable across page navigation and changes with the UTC date;
- constellation connects segment-by-segment on hover/focus/tap;
- piano is silent until activated;
- print preview for Work;
- no horizontal overflow;
- external links and old article URLs.

## Git and Delivery

The agent is explicitly authorized to create logical commits, but not to push.

Every redesign commit must use, without modifying global or repository Git configuration:

```text
Author:    Prakhar Pandey <3.14prakhar@gmail.com>
Committer: Prakhar Pandey <3.14prakhar@gmail.com>
```

Use per-command Git configuration or author/committer environment variables. Verify both fields after every commit.

Proposed commit sequence:

1. `redesign site with responsive editorial foundation`
   - layout, palette, theme, responsive navigation, motion primitives, and legacy presentation removal.
2. `add writing, now, and public work content`
   - collections, structured data, content migration, unified projects, and public-safe résumé material.
3. `add content publishing helpers and documentation`
   - `./site`, music management, tests, README workflow, and final build fixes.

Before handoff, verify:

- current branch is `jekyll`;
- remote repository is the personal site;
- all new commits have the personal author and committer email;
- working tree contains no accidental debug artifacts or unrelated files;
- `ai_studio_code.html` remains untouched unless separately approved.

The agent must not push. The user will perform the push only after the authentication identity is confirmed as `p-prakhar`, not `prakhar-pandey-nutanix`.

## Acceptance Criteria

The redesign is complete when:

1. Home, Writing, Now, Work, About, 404, and article pages use the new responsive visual system.
2. Both approved themes work and persist correctly.
3. Existing article URLs still build.
4. Writing filters and all progressive fallbacks work.
5. Now updates are easy to create and the latest one appears on Home.
6. Work contains every approved résumé category, one strongest-first Projects section, no phone number, and no internal-only information.
7. The daily favorite is selected from the editable list by UTC date.
8. The footer piano plays only after deliberate activation.
9. The eight-star note connects one edge at a time only on hover, focus, or tap.
10. The site builds strictly, works from 320px upward, supports keyboard and reduced motion, and has no active Three.js/Bootstrap presentation dependency.
11. The helper workflow and README are usable.
12. Logical commits exist with verified personal author and committer metadata.
13. Nothing has been pushed.

## Remaining Content Input

The only known content input not available in the repository is the initial current-favorites music list. The implementation can build and test the feature with fixtures, but production `_data/music.yml` should contain only songs supplied or approved by the user.
