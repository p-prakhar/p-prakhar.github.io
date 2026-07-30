# Personal Site Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current Three.js-heavy portfolio with a fast, responsive Jekyll publication for Writing, Now updates, public-safe professional work, and restrained music/star interactions.

**Architecture:** Keep GitHub Pages and the existing Jekyll repository. Replace the active shell with semantic Liquid layouts, focused SCSS partials, and one dependency-free JavaScript entry point; preserve posts and project documents while adding structured public data and an `_updates` collection. Add a Ruby CLI for content creation, preview, publication, validation, and music-list maintenance.

**Tech Stack:** Jekyll 3.10 through `github-pages` 232, Liquid, SCSS, dependency-free browser JavaScript, Web Audio, Ruby/Minitest, Node's built-in test runner, GitHub Actions.

**Implementation status (2026-07-30):** Tasks 1–3 are implemented and locally
verified. The responsive sweep covers 320, 375, 768, 1024, and 1440 px in both
themes; the repository has not been pushed.

## Global Constraints

- Work on branch `jekyll`; do not push.
- Commit as `Prakhar Pandey <3.14prakhar@gmail.com>` by per-command environment variables only; do not modify global or repository Git configuration.
- Preserve `/blog/:title` article permalinks.
- Keep `ai_studio_code.html` untouched and untracked.
- Do not publish phone numbers, corporate email addresses, Jira/change IDs, customer/setup names, internal URLs, colleague names, unreleased details, or claims supported only by internal sources.
- Keep one strongest-first Projects section based on `../resume/prakhar.tex` and `../resume/prakhar.pdf`.
- Use warm paper light mode and warm-ink dark mode; no remote fonts.
- No Three.js, Bootstrap, jQuery, icon font, parallax, loader, particle field, scroll-jacking, autoplay audio, or continuously looping decorative animation in active pages.
- The eight-star note connects one edge at a time only after hover, focus, or tap.
- Every enhancement must fail safely; navigation and published content work without JavaScript.
- Use `PATH="/opt/homebrew/Cellar/ruby/3.4.7/bin:$PATH"` for local Ruby commands. The system Ruby 2.6 cannot use the locked bundle.
- Add no custom Jekyll plugin because deployment uses `--safe`.

---

## Planned File Map

### Site shell and behavior

- Create `_layouts/default.html`: semantic document shell and progressive-enhancement entry point.
- Create `_layouts/home.html`: Home composition from posts, updates, work data, and daily music.
- Create `_layouts/page.html`: standard editorial page wrapper.
- Modify `_layouts/post.html`: article header, metadata, body, tags, and adjacent writing.
- Create `_layouts/update.html`: individual Now entry.
- Create `_includes/head.html`: metadata, SEO/feed tags, early theme bootstrap, stylesheet.
- Create `_includes/header.html`: two-row responsive header and fixed navigation set.
- Create `_includes/theme-toggle.html`: labeled appearance button.
- Create `_includes/footer.html`: contact links and footer piano.
- Create `_includes/footer-piano.html`: accessible opt-in Web Audio controls.
- Create `_includes/star-note.html`: eight-point sequential constellation.
- Create `_includes/article-row.html`: reusable Writing/Home row.
- Create `_includes/daily-music.html`: no-JS fallback plus JSON data payload.
- Create `_includes/project-row.html`: strongest-first Work project row.
- Replace `assets/css/style.scss`: only the new editorial partial imports.
- Create `_sass/_tokens.scss`, `_base.scss`, `_layout.scss`, `_components.scss`, `_content.scss`, `_print.scss`.
- Replace `assets/js/theme.js` with `assets/js/site.js`; remove the old file after all references are gone.

### Pages and content

- Modify `pages/index.md`.
- Create `pages/writing.html`.
- Modify `pages/blog.html` as a canonical compatibility index.
- Create `pages/now.html`.
- Create `pages/work.html`.
- Modify `pages/about.md`.
- Modify `pages/404.html`.
- Modify `pages/projects.html` as a compatibility route to Work.
- Modify `pages/tags.html`.
- Remove `pages/search.json` after confirming no active reference.
- Create `_updates/2026-07-30-rebuilding-this-corner.md`.
- Create `_data/profile.yml`, `experience.yml`, `open_source.yml`, `education.yml`, `skills.yml`, `honors.yml`, `leadership.yml`, `music.yml`.
- Normalize all `_projects/*.md`; create `_projects/bachelors-thesis.md` and `_projects/mini-c-compiler.md`.
- Normalize the two existing `_posts/*.md` front matters without rewriting their bodies.

### Authoring and validation

- Create `site`: executable POSIX launcher that selects the compatible Ruby without changing shell or Git configuration.
- Create `lib/site_cli.rb`: Ruby command dispatcher.
- Create `lib/site_tools.rb`: tested content/YAML operations.
- Create `test/test_helper.rb`, `design_contract_test.rb`, `content_contract_test.rb`, `site_tools_test.rb`.
- Create `test/site_js.test.js`.
- Modify `_templates/new-post.md`; create `_templates/new-update.md`.
- Modify `README.md`.
- Modify `_config.yml` and `.github/workflows/jekyll.yml`.
- Keep both plan documents under `docs/`, excluded from `_site`.

### Legacy removal after successful migration

- Delete `_layouts/portfolio-3d.html` and `_layouts/portfolio-3d-page.html`.
- Delete old `_includes/layouts/`, `_includes/content/`, `_includes/shared/`, and `_includes/components/` files once `rg` confirms no references.
- Delete old SCSS partials not imported by the new entry point.
- Preserve source posts, drafts, project bodies, licenses, and `ai_studio_code.html`.

---

### Task 1: Responsive Editorial Foundation

**Files:**
- Create: `test/test_helper.rb`
- Create: `test/design_contract_test.rb`
- Create: `test/site_js.test.js`
- Create: `_layouts/default.html`
- Create: `_layouts/home.html`
- Create: `_layouts/page.html`
- Modify: `_layouts/post.html`
- Create: `_layouts/update.html`
- Create: `_includes/head.html`
- Create: `_includes/header.html`
- Create: `_includes/theme-toggle.html`
- Create: `_includes/footer.html`
- Create: `_includes/footer-piano.html`
- Create: `_includes/star-note.html`
- Create: `_includes/article-row.html`
- Create: `_includes/daily-music.html`
- Create: `_includes/project-row.html`
- Replace: `assets/css/style.scss`
- Create: `_sass/_tokens.scss`
- Create: `_sass/_base.scss`
- Create: `_sass/_layout.scss`
- Create: `_sass/_components.scss`
- Create: `_sass/_content.scss`
- Create: `_sass/_print.scss`
- Create: `assets/js/site.js`
- Modify: `_config.yml`

**Interfaces:**
- Produces Liquid hooks: `[data-theme-toggle]`, `[data-writing-filter]`, `[data-music-pick]`, `[data-star-note]`, `[data-piano-key]`.
- Produces JavaScript exports for tests: `utcDayKey(date)`, `hashString(value)`, `dailyIndex(items, date)`, `normalizeTheme(value)`, `noteFrequency(midi)`.
- Produces collections `site.projects` and `site.updates`; defaults set the layouts `post`, `page`, `update`.
- Later tasks consume `{% include article-row.html item=... %}`, `{% include daily-music.html %}`, and `{% include project-row.html project=... %}`.

- [ ] **Step 1: Install the locked bundle with the compatible local Ruby**

Run:

```bash
PATH="/opt/homebrew/Cellar/ruby/3.4.7/bin:$PATH" bundle install
```

Expected: Bundler 2.7.2 installs `github-pages` 232 and exposes `jekyll`. Do not update system RubyGems and do not rewrite dependency versions.

- [ ] **Step 2: Record the baseline failure**

Run:

```bash
PATH="/opt/homebrew/Cellar/ruby/3.4.7/bin:$PATH" bundle exec jekyll build --strict_front_matter --trace
```

Expected before migration: the build may pass, but the generated pages still contain active Three.js/Bootstrap/CDN references. Save the command output for comparison; `_site` is ignored.

- [ ] **Step 3: Create the shared Ruby test support**

Create `test/test_helper.rb`:

```ruby
# frozen_string_literal: true

require "date"
require "minitest/autorun"
require "yaml"

ROOT = File.expand_path("..", __dir__)

module SiteTestSupport
  def root_path(*parts)
    File.join(ROOT, *parts)
  end

  def read_site_file(*parts)
    File.read(root_path(*parts))
  end

  def site_config
    YAML.safe_load(
      read_site_file("_config.yml"),
      permitted_classes: [Date, Time],
      aliases: true
    )
  end

  def front_matter(path)
    source = File.read(path)
    match = source.match(/\A---\s*\n(.*?)\n---\s*\n/m)
    raise "Missing front matter: #{path}" unless match

    YAML.safe_load(match[1], permitted_classes: [Date, Time], aliases: true) || {}
  end
end
```

- [ ] **Step 4: Write failing foundation contracts**

Create `test/design_contract_test.rb`:

```ruby
# frozen_string_literal: true

require_relative "test_helper"

class DesignContractTest < Minitest::Test
  include SiteTestSupport

  HEAVY_REFERENCES = /
    three(?:\.min)?\.js |
    bootstrap |
    jquery |
    fontawesome |
    font-awesome |
    animate\.css |
    wow\.js |
    fonts\.googleapis
  /ix

  def test_config_declares_personal_identity_and_collections
    config = site_config

    assert_equal "Prakhar Pandey", config.dig("author", "name")
    assert_equal "3.14prakhar@gmail.com", config.dig("author", "email")
    assert_equal "p-prakhar", config.dig("author", "github")
    assert_equal true, config.dig("collections", "projects", "output")
    assert_equal true, config.dig("collections", "updates", "output")
    assert_includes config.fetch("plugins"), "jekyll-feed"
    assert_includes config.fetch("plugins"), "jekyll-seo-tag"
    assert_includes config.fetch("plugins"), "jekyll-sitemap"
  end

  def test_authoring_paths_are_not_published
    excludes = site_config.fetch("exclude")

    %w[docs/ test/ lib/ site].each { |path| assert_includes excludes, path }
  end

  def test_default_shell_is_semantic_and_dependency_free
    shell = [
      read_site_file("_layouts", "default.html"),
      read_site_file("_includes", "head.html"),
      read_site_file("_includes", "header.html"),
      read_site_file("_includes", "footer.html")
    ].join("\n")

    assert_match(/<header\b/, shell)
    assert_match(/<nav\b/, shell)
    assert_match(/<main\b/, shell)
    assert_match(/<footer\b/, shell)
    assert_match(/data-theme-toggle/, shell)
    refute_match HEAVY_REFERENCES, shell
  end

  def test_mobile_navigation_has_four_visible_destinations
    header = read_site_file("_includes", "header.html")

    {
      "Writing" => "/writing/",
      "Now" => "/now/",
      "Work" => "/work/",
      "About" => "/about/"
    }.each do |label, path|
      assert_match(/href=["'][^"']*#{Regexp.escape(path)}["'][^>]*>\s*#{label}\s*</m, header)
    end

    refute_match(/navbar-toggler|hamburger|data-toggle=["']collapse/, header)
  end

  def test_styles_define_both_approved_palettes_and_reduced_motion
    styles = %w[
      _tokens.scss _base.scss _layout.scss _components.scss _content.scss _print.scss
    ].map { |name| read_site_file("_sass", name) }.join("\n")

    %w[#f4efe5 #29251f #a4432d #191612 #eee5d8 #df8f71].each do |token|
      assert_includes styles.downcase, token
    end
    assert_match(/prefers-reduced-motion:\s*reduce/, styles)
    refute_match(/@import\s+url/, styles)
  end
end
```

Create `test/site_js.test.js`:

```javascript
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const {
  utcDayKey,
  hashString,
  dailyIndex,
  normalizeTheme,
  noteFrequency,
} = require("../assets/js/site.js");

test("UTC day key ignores local timezone presentation", () => {
  assert.equal(utcDayKey(new Date("2026-07-30T23:59:59Z")), "2026-07-30");
  assert.equal(utcDayKey(new Date("2026-07-31T00:00:00Z")), "2026-07-31");
});

test("daily music selection is stable and bounded", () => {
  const tracks = ["a", "b", "c", "d"];
  const date = new Date("2026-07-30T12:00:00Z");
  const first = dailyIndex(tracks, date);

  assert.equal(first, dailyIndex(tracks, date));
  assert.ok(first >= 0 && first < tracks.length);
  assert.equal(dailyIndex([], date), -1);
});

test("hash is deterministic", () => {
  assert.equal(hashString("2026-07-30"), hashString("2026-07-30"));
  assert.notEqual(hashString("2026-07-30"), hashString("2026-07-31"));
});

test("theme accepts only light and dark", () => {
  assert.equal(normalizeTheme("light"), "light");
  assert.equal(normalizeTheme("dark"), "dark");
  assert.equal(normalizeTheme("sepia"), null);
  assert.equal(normalizeTheme(null), null);
});

test("MIDI note 69 is concert A", () => {
  assert.equal(noteFrequency(69), 440);
});
```

- [ ] **Step 5: Run the contracts and verify they fail for missing new files**

Run:

```bash
PATH="/opt/homebrew/Cellar/ruby/3.4.7/bin:$PATH" ruby -Itest test/design_contract_test.rb
node --test test/site_js.test.js
```

Expected: Ruby fails reading the new layouts/includes; Node fails because `assets/js/site.js` or its exports do not exist.

- [ ] **Step 6: Replace `_config.yml` with the safe-mode-compatible site contract**

Retain `url`, `baseurl`, repository, and personal author links. Set:

```yaml
title: "Prakhar :)"
description: "Systems engineer writing about C++, Linux, distributed storage, travel, and life."
url: "https://p-prakhar.github.io"
baseurl: ""
repository: "p-prakhar/p-prakhar.github.io"
lang: en
timezone: UTC

author:
  name: Prakhar Pandey
  email: 3.14prakhar@gmail.com
  github: p-prakhar
  linkedin: p-prakhar

permalink: /blog/:title

plugins:
  - jekyll-feed
  - jekyll-seo-tag
  - jekyll-sitemap

collections:
  projects:
    output: true
    permalink: /projects/:name/
  updates:
    output: true
    permalink: /now/:name/

defaults:
  - scope:
      path: ""
      type: posts
    values:
      layout: post
  - scope:
      path: ""
      type: projects
    values:
      layout: page
  - scope:
      path: ""
      type: updates
    values:
      layout: update

exclude:
  - README.md
  - CONTRIBUTING.md
  - LICENSE
  - docs/
  - test/
  - lib/
  - site
  - vendor/
  - .bundle/
  - "*.log"
```

Do not add `../resume`, notes, `.superpowers`, or any private source path to Jekyll data.

- [ ] **Step 7: Build the semantic Liquid shell**

Implement `_layouts/default.html` with:

```html
<!doctype html>
<html lang="{{ site.lang | default: 'en' }}" data-theme="light">
  {% include head.html %}
  <body class="page-shell page-shell--{{ page.section | default: 'default' }}">
    <a class="skip-link" href="#main-content">Skip to content</a>
    {% include header.html %}
    <main id="main-content" class="site-main" tabindex="-1">
      {{ content }}
    </main>
    {% include footer.html %}
    <script src="{{ '/assets/js/site.js' | relative_url }}" defer></script>
  </body>
</html>
```

Implement `_includes/head.html` so the inline bootstrap:

1. reads only `light` or `dark` from `localStorage["prakhar-theme"]`;
2. falls back to `matchMedia("(prefers-color-scheme: dark)")`;
3. catches storage errors;
4. sets `document.documentElement.dataset.theme` before CSS;
5. emits `{% seo %}`, `{% feed_meta %}`, canonical override when `page.canonical_url` exists, and `/assets/css/style.css`.

Implement `_includes/header.html` as:

```html
<header class="site-header">
  <div class="header-primary shell-width">
    <a class="site-brand" href="{{ '/' | relative_url }}" aria-label="Prakhar Pandey — home">
      <span>Prakhar</span>
      <span class="brand-face" aria-hidden="true">
        <span class="brand-smile">:)</span><span class="brand-wink">;)</span>
      </span>
    </a>
    {% include theme-toggle.html %}
  </div>
  <nav class="site-nav shell-width" aria-label="Primary">
    <a href="{{ '/writing/' | relative_url }}">Writing</a>
    <a href="{{ '/now/' | relative_url }}">Now</a>
    <a href="{{ '/work/' | relative_url }}">Work</a>
    <a href="{{ '/about/' | relative_url }}">About</a>
  </nav>
</header>
```

Use `aria-current="page"` via `page.section` comparisons in the actual include. The theme include is a real `<button type="button" data-theme-toggle aria-label="Switch to dark mode">` with visible text and sun/moon spans.

Create `page`, `home`, `post`, and `update` layouts chained through `layout: default`. The page title falls back from `page.title` to `page.name` for project documents. `post.html` computes word count with Liquid, renders date/category/tags, and never references Disqus or Bootstrap classes.

- [ ] **Step 8: Implement the approved reusable components**

`_includes/star-note.html` must contain one `<button data-star-note>` and an inline SVG with exactly eight circles and eight separate `path` edges. Give each edge `pathLength="1"` and classes `star-note__edge--1` through `--8`; no minor stars.

`_includes/footer-piano.html` must render seven white and five black `<button data-piano-key data-midi="...">` controls covering MIDI notes 60–71 with accurate `aria-label` values.

`_includes/footer.html` must contain personal email/GitHub/LinkedIn text links, include the piano, and have no icon font.

`_includes/article-row.html` consumes `include.item` and renders its URL, title, date, description, category, calculated reading time, and a decorative arrow.

`_includes/project-row.html` consumes `include.project`; links externally only when a URL exists and renders no image wrapper when `project.image` is absent.

`_includes/daily-music.html` renders:

- the first track as the server fallback;
- all tracks in `<script type="application/json" data-music-data>{{ site.data.music | jsonify }}</script>`;
- no wrapper when the data list is empty.

- [ ] **Step 9: Implement the editorial SCSS**

Replace `assets/css/style.scss` with Jekyll front matter and only:

```scss
---
---
@import "tokens";
@import "base";
@import "layout";
@import "components";
@import "content";
@import "print";
```

Implement the partials with these non-negotiable selectors:

- `_tokens.scss`: approved colors, serif/sans/mono stacks, `--measure: 70ch`, `--shell: 70rem`, spacing, radius, and focus-ring tokens for light and `[data-theme="dark"]`.
- `_base.scss`: reset, body, links, headings, prose, images, skip link, `:focus-visible`.
- `_layout.scss`: `.shell-width`, two-row `.site-header`, four-column `.site-nav`, `.site-main`, article measure, Home/Work wide grids, mobile breakpoints at 48rem and safe-area padding.
- `_components.scss`: theme toggle, brand `:)`/`;)` crossfade, article rows, tag/filter controls, sequential star-note edges with 190ms stagger and about 1.55s total, piano keys, daily music, jump links, and one page-introduction settle of no more than 6px.
- `_content.scss`: Markdown headings, lists, code, blockquotes, tables, project/work timeline, Now entries.
- `_print.scss`: hide header/footer/interactive controls, force black-on-white, expand links sensibly, and print Work without clipped sections.

At `@media (prefers-reduced-motion: reduce)`, remove transitions/animations and reveal the star-note edges immediately only while the control is focused/activated.

- [ ] **Step 10: Implement dependency-free JavaScript**

Create `assets/js/site.js` with pure exports first:

```javascript
"use strict";

function utcDayKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function hashString(value) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function dailyIndex(items, date = new Date()) {
  if (!Array.isArray(items) || items.length === 0) return -1;
  return hashString(utcDayKey(date)) % items.length;
}

function normalizeTheme(value) {
  return value === "light" || value === "dark" ? value : null;
}

function noteFrequency(midi) {
  return Math.round(440 * (2 ** ((Number(midi) - 69) / 12)) * 100) / 100;
}
```

Add isolated initializers:

- `initThemeToggle()` updates `data-theme`, button label/state, and safely persists the manual choice.
- `initWritingFilters()` toggles `[data-article-category]` rows and `aria-pressed`; “all” restores every row.
- `initDailyMusic()` parses the JSON payload, computes `dailyIndex`, and replaces fallback title/artist/link without layout shift.
- `initStarNotes()` toggles `.is-connected` only on click/tap; CSS handles hover/focus.
- `initPiano()` lazily creates/reuses `AudioContext`, plays a sine/triangle blend at low gain for at most 350ms, and catches rejection.
- `initPrintControls()` removes `hidden` from `[data-print]`, binds it to `window.print()`, and hides no content when JavaScript is absent.

Run initializers after `DOMContentLoaded`; guard every query and initializer. Export the five pure functions under `module.exports` only when CommonJS exists.

- [ ] **Step 11: Run foundation tests and strict build**

Run:

```bash
PATH="/opt/homebrew/Cellar/ruby/3.4.7/bin:$PATH" ruby -Itest test/design_contract_test.rb
node --test test/site_js.test.js
PATH="/opt/homebrew/Cellar/ruby/3.4.7/bin:$PATH" bundle exec jekyll build --strict_front_matter --safe --trace
```

Expected: all tests pass and Jekyll generates `_site` without a Liquid, Sass, or safe-mode error.

- [ ] **Step 12: Review and commit the foundation with the personal identity**

Run `git status --short`, `git diff`, and `git log -5 --oneline` in parallel before staging. Confirm `ai_studio_code.html` is not staged.

Stage only Task 1 files and commit:

```bash
git add _config.yml \
  _layouts/default.html _layouts/home.html _layouts/page.html \
  _layouts/post.html _layouts/update.html \
  _includes/head.html _includes/header.html \
  _includes/theme-toggle.html _includes/footer.html _includes/footer-piano.html \
  _includes/star-note.html _includes/article-row.html _includes/daily-music.html \
  _includes/project-row.html assets/css/style.scss assets/js/site.js \
  _sass/_tokens.scss _sass/_base.scss _sass/_layout.scss \
  _sass/_components.scss _sass/_content.scss _sass/_print.scss \
  test/test_helper.rb test/design_contract_test.rb test/site_js.test.js

GIT_AUTHOR_NAME="Prakhar Pandey" \
GIT_AUTHOR_EMAIL="3.14prakhar@gmail.com" \
GIT_COMMITTER_NAME="Prakhar Pandey" \
GIT_COMMITTER_EMAIL="3.14prakhar@gmail.com" \
git commit -m "$(cat <<'EOF'
Redesign site with responsive editorial foundation

Replace the animation-heavy shell with a lightweight, accessible system that keeps personality in deliberate music and star interactions.
EOF
)"
```

Verify:

```bash
git log -1 --format='author=%an <%ae>%ncommitter=%cn <%ce>%nsubject=%s'
git status --short
```

Expected: both identities are `Prakhar Pandey <3.14prakhar@gmail.com>`; no push occurs.

---

### Task 2: Writing, Now, Work, and Public Content

**Files:**
- Create: `test/content_contract_test.rb`
- Modify/Create: all page and data files listed in the file map
- Modify: `_posts/2024-03-05-placement-coordinator.md`
- Modify: `_posts/2024-11-03-placement-logistics.md`
- Modify/Create: `_projects/*.md`
- Create: `_updates/2026-07-30-rebuilding-this-corner.md`

**Interfaces:**
- Data shapes:
  - `site.data.experience[]`: `company`, `role`, `period`, `location`, `summary`, `highlights[]`.
  - `site.data.open_source[]`: `name`, `url`, `summary`, `links[]`.
  - `site.data.skills[]`: `group`, `items[]`.
  - `site.data.music[]`: `title`, `artist`, optional `url`.
- Every project has integer `order`, `name`, `description`, and `tools[]`.
- Every post has one approved `category`, array `tags`, and nonempty `description`.

- [ ] **Step 1: Write failing public-content contracts**

Create `test/content_contract_test.rb`:

```ruby
# frozen_string_literal: true

require_relative "test_helper"

class ContentContractTest < Minitest::Test
  include SiteTestSupport

  APPROVED_CATEGORIES = %w[tech travel life essay].freeze
  PUBLIC_SOURCES = %w[
    pages _posts _projects _updates _data
  ].freeze
  FORBIDDEN = [
    /\+91[-\s]?7587246531/,
    /@nutanix\.com/i,
    /prakhar-pandey-nutanix/i,
    /\b(?:ENG|FEAT|DIAL|ONCALL)-\d+\b/,
    /Lorem ipsum/i
  ].freeze

  def public_files(directory)
    Dir[root_path(directory, "**", "*.{md,html,yml,yaml}")].sort
  end

  def test_public_sources_contain_no_private_or_placeholder_text
    files = PUBLIC_SOURCES.flat_map { |directory| public_files(directory) }
    corpus = files.map { |path| File.read(path) }.join("\n")

    FORBIDDEN.each { |pattern| refute_match pattern, corpus }
  end

  def test_posts_use_approved_categories_and_descriptions
    Dir[root_path("_posts", "*.md")].each do |path|
      data = front_matter(path)
      assert_includes APPROVED_CATEGORIES, data["category"], path
      refute_empty data.fetch("description"), path
      assert_kind_of Array, data.fetch("tags"), path
    end
  end

  def test_projects_have_unique_integer_order
    projects = Dir[root_path("_projects", "*.md")].map do |path|
      [path, front_matter(path)]
    end
    orders = projects.map { |_path, data| Integer(data.fetch("order")) }

    assert_equal orders.uniq.sort, orders.sort
    projects.each do |path, data|
      refute_empty data.fetch("name"), path
      refute_empty data.fetch("description"), path
      assert_kind_of Array, data.fetch("tools"), path
    end
  end

  def test_work_data_covers_every_resume_category
    %w[
      profile.yml experience.yml open_source.yml education.yml
      skills.yml honors.yml leadership.yml
    ].each do |name|
      data = YAML.safe_load(read_site_file("_data", name), aliases: true)
      refute_nil data, name
      refute_empty data, name
    end
  end

  def test_music_entries_have_only_supported_fields
    entries = YAML.safe_load(read_site_file("_data", "music.yml"), aliases: true) || []

    entries.each do |entry|
      assert_equal [], entry.keys - %w[title artist url]
      refute_empty entry.fetch("title")
      refute_empty entry.fetch("artist")
    end
  end

  def test_primary_pages_use_new_layouts_and_routes
    expected = {
      "index.md" => ["/", "home"],
      "writing.html" => ["/writing/", "page"],
      "now.html" => ["/now/", "page"],
      "work.html" => ["/work/", "page"],
      "about.md" => ["/about/", "page"],
      "404.html" => ["/404.html", "page"]
    }

    expected.each do |name, (permalink, layout)|
      data = front_matter(root_path("pages", name))
      assert_equal permalink, data["permalink"], name
      assert_equal layout, data["layout"], name
    end
  end
end
```

- [ ] **Step 2: Run the content contract and verify current content fails**

Run:

```bash
PATH="/opt/homebrew/Cellar/ruby/3.4.7/bin:$PATH" ruby -Itest test/content_contract_test.rb
```

Expected: failures for missing pages/data/order/category and current lorem-ipsum/corporate-fork text.

- [ ] **Step 3: Add public-safe structured professional data**

Create `_data/profile.yml`:

```yaml
headline: "Systems engineer working close to storage, Linux, and performance."
summary: >-
  I work on Nutanix's Stargate userspace storage engine, primarily in C++17
  across NVMe/SPDK, reliability, memory allocation, performance analysis, and
  Linux internals. I enjoy turning profiler traces and production evidence into
  simpler, faster systems.
location: "Bengaluru, India"
```

Create `_data/experience.yml` with two entries:

1. **Member of Technical Staff, Nutanix — Jul 2024 to present**
   - summary: core-data-path storage-engine work in C++17;
   - highlights:
     - helped scale dense NVMe nodes by improving checksum and device-discovery paths;
     - strengthened SPDK device setup and recovery, with fixes contributed upstream;
     - reduced storage-service startup overhead and investigated allocator/toolchain behavior on modern Linux;
     - root-caused reliability and capacity incidents from logs, heap evidence, and source;
     - handled storage on-call work and contributed mentoring, interviews, and onboarding material.
2. **Software Engineering Intern, Nutanix — May to Jul 2023**
   - summary: post-mortem tooling and logging performance;
   - highlights:
     - added POSIX pax archive support to minicoredumper for large cores and upstreamed the work;
     - reduced a costly verbose-logging path and built a repeatable measurement harness;
     - upgraded in-tree logging/profiling dependencies and fixed symbol handling.

Create `_data/open_source.yml`:

```yaml
- name: "diamon/minicoredumper"
  url: "https://github.com/diamon/minicoredumper"
  summary: >-
    Added POSIX pax sparse-map and extended-header support so minicoredumper can
    emit core archives beyond the legacy ustar size limit.
  links:
    - label: "Pull request #10"
      url: "https://github.com/diamon/minicoredumper/pull/10"

- name: "spdk/spdk"
  url: "https://github.com/spdk/spdk"
  summary: >-
    Contributed two setup-script reliability fixes covering block-device sync
    timing and stale PCI identity cache entries.
  links:
    - label: "Change 28045"
      url: "https://review.spdk.io/c/spdk/spdk/+/28045"
    - label: "Change 28044"
      url: "https://review.spdk.io/c/spdk/spdk/+/28044"
```

Create education, skills, honors, and leadership YAML from the resume with these exact public sections:

- Education: IIT Guwahati B.Tech CSE (2020–2024, CGPA 8.63/10), Vidhyanjali Academy (2020, 97.4%), DPS Risali (2018, CGPA 10/10).
- Skills: Languages; Systems/Performance; Linux Internals; Storage/Distributed Systems; Debugging; Tooling.
- Honors: Nutanix Hackathon category wins (2025, 2026) and 2025 Most Impactful Project; Inter-IIT Tech Meet 11 gold; JEE Advanced AIR 438; JEE Main 99.88 percentile; KVPY AIR 196; CBSE merit.
- Leadership: Overall Placement Coordinator; Head of Nexus; CSEA mentor; engineering mentoring/interviewing/onboarding summarized without names or internal links.
- Coursework: store the resume's course list under the Education or Skills data and render it on Work.

Delete `_data/timeline.yml` after the new Work data is active so its lorem-ipsum entries cannot be published. Remove `_data/programming-skills.yml` and `_data/tools.yml` only after confirming the new Skills data replaces every active reference.

- [ ] **Step 4: Normalize one strongest-first project collection**

Create:

1. `_projects/bachelors-thesis.md`, order 10.
2. `_projects/xv6.md`, order 20.
3. `_projects/mini-c-compiler.md`, order 30.
4. `_projects/minishell.md`, order 40.
5. `_projects/ppdex.md`, order 50.
6. `_projects/clustering_visualizer.md`, order 60.
7. `_projects/land_cover_mapping.md`, order 70.
8. `_projects/label_noise.md`, order 80.
9. `_projects/paradime.md`, order 90.
10. `_projects/ccd_website.md`, order 100.
11. `_projects/movrev.md`, order 110.
12. `_projects/minicoredumper.md`, order 120, retained as a detailed open-source case study.

For each file:

- convert `tools` to a YAML array;
- add `order`;
- remove missing `image` paths;
- add or retain personal/upstream URLs only;
- replace the corporate minicoredumper fork URL with upstream PR #10;
- correct spelling/grammar without changing the technical claim;
- preserve useful Markdown bodies.

The thesis description must cover lazy random walks on monotone subsets of the hypercube, the prior `O(n^3)` bound, and the simulation/literature work without claiming an unproven result.

- [ ] **Step 5: Normalize existing Writing content**

Change both post front matters to:

```yaml
layout: post
category: life
tags:
  - campus
  - placements
```

Retain each existing title, description, date-derived filename, and full body. Remove obsolete `style` and `color` fields.

Create `pages/writing.html` with `layout: page`, `section: writing`, `permalink: /writing/`, category filter buttons, and rows for `site.posts`.

Change `pages/blog.html` to the same reusable Writing index with `canonical_url: /writing/` and `permalink: /blog/`; do not use a JavaScript-only redirect.

Update `pages/tags.html` to use the new page layout and grouped tag links.

- [ ] **Step 6: Add Now and daily music**

Create `_updates/2026-07-30-rebuilding-this-corner.md`:

```markdown
---
title: "Rebuilding this corner of the internet"
date: 2026-07-30
location: "Bengaluru"
tags:
  - life
  - website
published: true
---

I am turning this site into somewhere I will actually write: systems notes,
travel stories, life updates, and the things I am learning along the way.
```

Create `pages/now.html` with a current-entry section followed by the complete reverse-chronological `site.updates` timeline.

Create `_data/music.yml` only from tracks supplied or approved by the user. If no list is supplied before this step, use `[]`; the component must hide and no sample artist/title may ship.

- [ ] **Step 7: Build Work, Home, About, and compatibility pages**

`pages/work.html`:

- `layout: page`, `section: work`, `permalink: /work/`;
- top jump links for Experience, Open Source, Projects, Skills, Education, Honors, Leadership, Coursework;
- loops over every structured data file;
- sorts `site.projects` by `order`;
- includes a print button with `data-print hidden`; `initPrintControls()` reveals it and calls `window.print()` only after JavaScript binds it;
- contains no phone number, corporate email, internal IDs, or missing-image placeholders.

`_layouts/home.html`:

- approved headline with `<em>notice.</em>`;
- latest three posts via `article-row.html`;
- newest published update;
- concise selected-work preview;
- `daily-music.html`;
- one `star-note.html` at a major section boundary;
- no hero image.

`pages/about.md`:

- current systems-engineer introduction;
- personal writing/music/travel framing;
- no outdated final-year/student or job-seeking text;
- no missing portrait.

`pages/404.html`:

- helpful links and static/lightweight star detail;
- no infinite SVG animation.

`pages/projects.html`:

- compatibility page at `/projects/` linking directly to `/work/#projects`;
- no duplicate project grid.

Remove `pages/search.json` after `rg "search.json|blog/search"` shows no new reference.

- [ ] **Step 8: Run content contracts and production build**

Run:

```bash
PATH="/opt/homebrew/Cellar/ruby/3.4.7/bin:$PATH" ruby -Itest test/content_contract_test.rb
PATH="/opt/homebrew/Cellar/ruby/3.4.7/bin:$PATH" ruby -Itest test/design_contract_test.rb
node --test test/site_js.test.js
PATH="/opt/homebrew/Cellar/ruby/3.4.7/bin:$PATH" bundle exec jekyll build --strict_front_matter --safe --trace
```

Then verify generated routes:

```bash
test -f _site/index.html
test -f _site/writing/index.html
test -f _site/now/index.html
test -f _site/work/index.html
test -f _site/about/index.html
test -f _site/404.html
test -f _site/blog/what-is-a-placement-coordinator.html
```

Expected: every command exits 0; the old article route exists.

- [ ] **Step 9: Review public copy before committing**

Search only public site sources:

```bash
rg -n -i '7587246531|@nutanix\.com|prakhar-pandey-nutanix|\b(ENG|FEAT|DIAL|ONCALL)-[0-9]+\b|lorem ipsum' \
  pages _posts _projects _updates _data _layouts _includes
```

Expected: no matches. Present the rendered Work copy to the user for the explicit public-content approval required by the design.

- [ ] **Step 10: Commit content with the personal identity**

Run the required `git status`, full `git diff`, and recent `git log` preflight. Stage only Task 2 files, leaving `ai_studio_code.html` untracked.

Commit:

```bash
GIT_AUTHOR_NAME="Prakhar Pandey" \
GIT_AUTHOR_EMAIL="3.14prakhar@gmail.com" \
GIT_COMMITTER_NAME="Prakhar Pandey" \
GIT_COMMITTER_EMAIL="3.14prakhar@gmail.com" \
git commit -m "$(cat <<'EOF'
Add writing, now, and public work content

Make long-form writing, short updates, and a sanitized professional history easy to browse without exposing private or internal details.
EOF
)"
```

Verify both author and committer fields with `git log -1 --format=fuller`. Do not push.

---

### Task 3: Authoring Helper, Legacy Cleanup, and Delivery Verification

**Files:**
- Create: `lib/site_tools.rb`
- Create: `lib/site_cli.rb`
- Create: `site`
- Create: `test/site_tools_test.rb`
- Modify: `_templates/new-post.md`
- Create: `_templates/new-update.md`
- Modify: `README.md`
- Modify: `.github/workflows/jekyll.yml`
- Delete: confirmed-unreferenced legacy layouts/includes/SCSS/JS
- Modify: design and implementation plan status only when implementation is verified

**Interfaces:**
- `SiteTools.slugify(title) -> String`
- `SiteTools.create_content(root:, kind:, attributes:, date:) -> Pathname`
- `SiteTools.publish(path:, date:) -> Pathname`
- `SiteTools.add_music(root:, entry:) -> Integer`
- `SiteTools.remove_music(root:, index:) -> Hash`
- CLI commands: `new post`, `new update`, `preview`, `publish PATH`, `check`, `music add`, `music remove`.

- [ ] **Step 1: Write failing authoring-helper tests**

Create `test/site_tools_test.rb`:

```ruby
# frozen_string_literal: true

require "fileutils"
require "tmpdir"
require_relative "test_helper"
require_relative "../lib/site_tools"

class SiteToolsTest < Minitest::Test
  def with_site
    Dir.mktmpdir do |root|
      FileUtils.mkdir_p(File.join(root, "_posts"))
      FileUtils.mkdir_p(File.join(root, "_updates"))
      FileUtils.mkdir_p(File.join(root, "_data"))
      yield root
    end
  end

  def test_slugify_is_predictable
    assert_equal "learning-c-and-linux", SiteTools.slugify(" Learning C++ & Linux! ")
  end

  def test_new_post_is_unpublished_and_never_overwrites
    with_site do |root|
      attributes = {
        "title" => "Learning latency",
        "description" => "Notes from profiling.",
        "category" => "tech",
        "tags" => %w[performance linux]
      }
      path = SiteTools.create_content(
        root: root, kind: :post, attributes: attributes, date: Date.new(2026, 7, 30)
      )

      assert_equal "_posts/2026-07-30-learning-latency.md", path.relative_path_from(Pathname(root)).to_s
      assert_equal false, SiteTools.front_matter(path)["published"]
      assert_raises(SiteTools::AlreadyExists) do
        SiteTools.create_content(
          root: root, kind: :post, attributes: attributes, date: Date.new(2026, 7, 30)
        )
      end
    end
  end

  def test_invalid_category_is_rejected_before_writing
    with_site do |root|
      assert_raises(SiteTools::InvalidCategory) do
        SiteTools.create_content(
          root: root,
          kind: :post,
          attributes: {
            "title" => "Bad category",
            "description" => "Must fail.",
            "category" => "random",
            "tags" => []
          },
          date: Date.new(2026, 7, 30)
        )
      end
      assert_empty Dir[File.join(root, "_posts", "*.md")]
    end
  end

  def test_publish_changes_state_without_losing_body
    with_site do |root|
      path = SiteTools.create_content(
        root: root,
        kind: :update,
        attributes: {"title" => "A short update", "tags" => ["life"]},
        date: Date.new(2026, 7, 30)
      )
      File.open(path, "a") { |file| file.write("A body line.\n") }

      published = SiteTools.publish(path: path, date: Date.new(2026, 7, 31))

      assert_equal true, SiteTools.front_matter(published)["published"]
      assert_includes File.read(published), "A body line."
    end
  end

  def test_music_add_and_remove_round_trip
    with_site do |root|
      first = {"title" => "Track", "artist" => "Artist", "url" => "https://example.com"}
      assert_equal 1, SiteTools.add_music(root: root, entry: first)
      assert_equal first, SiteTools.remove_music(root: root, index: 0)
      assert_equal [], YAML.safe_load(File.read(File.join(root, "_data", "music.yml")))
    end
  end
end
```

- [ ] **Step 2: Run the helper tests and verify the missing implementation fails**

Run:

```bash
PATH="/opt/homebrew/Cellar/ruby/3.4.7/bin:$PATH" ruby -Itest test/site_tools_test.rb
```

Expected: failure loading `lib/site_tools`.

- [ ] **Step 3: Implement `lib/site_tools.rb`**

Use only Ruby standard libraries: `date`, `fileutils`, `pathname`, `psych/yaml`, `tempfile`.

Implement:

```ruby
module SiteTools
  CATEGORIES = %w[tech travel life essay].freeze
  CONTENT_DIR = {post: "_posts", update: "_updates"}.freeze

  class Error < StandardError; end
  class AlreadyExists < Error; end
  class InvalidCategory < Error; end
  class InvalidContent < Error; end
end
```

Required behavior:

- `slugify` lowercases, converts `C++` to `c`, converts `&` to `and`, replaces remaining non-alphanumeric runs with one hyphen, and strips edge hyphens.
- `create_content` validates title; validates description/category for posts; writes dated filename with `published: false`; creates valid YAML front matter and a trailing blank line; uses exclusive create mode so overwrite is impossible.
- `front_matter` safely parses only the first YAML block.
- `publish` rewrites front matter through a temporary file in the same directory, sets `published: true` and `date`, preserves the body byte-for-byte, and renames the date prefix if necessary without overwriting.
- `add_music` validates title/artist and optional `http`/`https` URL, appends, and atomically rewrites `_data/music.yml`.
- `remove_music` validates the zero-based index, returns the removed hash, and atomically rewrites the list.

- [ ] **Step 4: Implement the executable `site` launcher and Ruby CLI**

Create `site` as a POSIX shell launcher:

```sh
#!/bin/sh
set -eu

ROOT=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
BREW_RUBY="/opt/homebrew/Cellar/ruby/3.4.7/bin/ruby"

if [ -x "$BREW_RUBY" ]; then
  exec "$BREW_RUBY" "$ROOT/lib/site_cli.rb" "$@"
fi

if command -v ruby >/dev/null 2>&1; then
  exec ruby "$ROOT/lib/site_cli.rb" "$@"
fi

echo "Error: Ruby is required to manage this Jekyll site." >&2
exit 1
```

Create `lib/site_cli.rb` with `#!/usr/bin/env ruby`, `require "rbconfig"`, prepend `File.dirname(RbConfig.ruby)` to `ENV["PATH"]` so `bundle` matches the selected interpreter, require `site_tools`, and dispatch:

```text
site new post
site new update
site preview
site publish PATH
site check
site music add
site music remove
```

Behavior:

- prompt using `$stdin.gets` and print clear field names;
- comma-separated tags become trimmed arrays;
- `new post` prompts for title, description, category, tags;
- `new update` prompts for title, location, reading, tags and omits blank optional fields;
- `preview` uses `exec("bundle", "exec", "jekyll", "serve", "--livereload", "--unpublished")`;
- `check` runs Ruby tests, Node tests, then `bundle exec jekyll build --strict_front_matter --safe --trace`, stopping on the first failure;
- `publish` prints the resulting path;
- `music remove` prints a numbered list and requires an explicit `yes` confirmation;
- unknown commands print usage and exit 64;
- `SiteTools::Error` prints `Error: ...` and exits 1.

Mark the launcher executable:

```bash
chmod +x site
```

- [ ] **Step 5: Run helper tests and exercise noninteractive failure paths**

Run:

```bash
PATH="/opt/homebrew/Cellar/ruby/3.4.7/bin:$PATH" ruby -Itest test/site_tools_test.rb
PATH="/opt/homebrew/Cellar/ruby/3.4.7/bin:$PATH" ./site unknown
```

Expected: Minitest passes; unknown command prints usage and exits 64.

- [ ] **Step 6: Add templates and the publishing guide**

Update `_templates/new-post.md` to match the exact approved front matter and comments. Create `_templates/new-update.md` with optional fields.

Rewrite `README.md` with:

1. `./site` automatically selecting the installed compatible Ruby on this Mac;
2. `bundle install`;
3. `./site new post` / `new update`;
4. `./site preview`;
5. edit Markdown;
6. `./site publish PATH`;
7. `./site check`;
8. `./site music add/remove`;
9. personal commit identity requirement;
10. explicit statement that the user performs the push to `jekyll`.

Do not put internal resume/notes/Glean source details into the public README.

- [ ] **Step 7: Make deployment run the same tests**

Modify `.github/workflows/jekyll.yml` after Ruby setup:

```yaml
- name: Run content and helper tests
  run: bundle exec ruby -Itest -e 'Dir["test/*_test.rb"].sort.each { |file| require File.expand_path(file) }'

- name: Run browser-script unit tests
  run: node --test test/site_js.test.js
```

Add `--strict_front_matter` to the existing safe production build. Keep the trigger on `jekyll`, Pages permissions, artifact upload, and deployment job unchanged.

- [ ] **Step 8: Remove only confirmed-unreferenced legacy presentation files**

Search:

```bash
rg -n 'portfolio-3d|layouts/(head|navbar|footer|scripts|base-page)|content/(blog|projects|about)|shared/social|components/elements/button|theme\.js' \
  --glob '!docs/**' --glob '!.superpowers/**' .
```

After all active references are gone:

- delete the two `portfolio-3d` layouts;
- delete obsolete nested includes;
- delete old SCSS partials not imported by `assets/css/style.scss`;
- delete `assets/js/theme.js`;
- retain drafts and project/post Markdown;
- do not delete or stage `ai_studio_code.html`.

Run a second `rg` for `three`, `bootstrap`, `jquery`, `fontawesome`, `animate.css`, `wow.js`, `fonts.googleapis`, `unpkg`, and `cdnjs` across active layouts/includes/assets/pages. Expected: no active-page matches.

- [ ] **Step 9: Run the full local gate**

Run:

```bash
PATH="/opt/homebrew/Cellar/ruby/3.4.7/bin:$PATH" ./site check
```

Expected:

- all Ruby tests pass;
- all Node tests pass;
- strict safe Jekyll build passes.

Then run browser checks at 320, 375, 768, 1024, and 1440px in both themes:

- navigation remains visible and touch-friendly;
- no horizontal overflow;
- Writing filters work and all rows remain visible with JavaScript disabled;
- daily music is stable for the UTC day;
- star-note edges connect sequentially on hover/focus/tap;
- reduced-motion removes the sequence;
- piano is silent before activation and plays only the selected note afterward;
- Work print preview is readable;
- old article URLs resolve.

- [ ] **Step 10: Verify repository and identity state before the final commit**

Run the required parallel preflight: `git status --short`, full staged/unstaged `git diff`, and recent `git log`.

Confirm:

- branch is `jekyll`;
- `git remote get-url origin` targets `p-prakhar/p-prakhar.github.io`;
- `ai_studio_code.html` is untracked and unstaged;
- no `.superpowers` visual-companion artifact is staged;
- only source, tests, README, workflow, and plan documents are included.

- [ ] **Step 11: Commit helpers, cleanup, and documentation**

Stage only relevant files and commit:

```bash
GIT_AUTHOR_NAME="Prakhar Pandey" \
GIT_AUTHOR_EMAIL="3.14prakhar@gmail.com" \
GIT_COMMITTER_NAME="Prakhar Pandey" \
GIT_COMMITTER_EMAIL="3.14prakhar@gmail.com" \
git commit -m "$(cat <<'EOF'
Add content publishing helpers and documentation

Make posts, updates, and favorite music safe to maintain while enforcing the same content and build contracts in CI.
EOF
)"
```

Verify:

```bash
git log -3 --format='%h author=%an <%ae> committer=%cn <%ce> %s'
git status --short
```

Expected: all three redesign commits have the personal author/committer identity; only intentionally untouched untracked files remain.

- [ ] **Step 12: Handoff without pushing**

Do not run `git push`.

Before giving the user a push command, verify the authentication path resolves to the personal `p-prakhar` account rather than `prakhar-pandey-nutanix`. Report:

- all verification commands and outcomes;
- three commit hashes and identities;
- remaining untracked `ai_studio_code.html`;
- exact personal remote and branch;
- safe user-run push command only after personal authentication is confirmed.
