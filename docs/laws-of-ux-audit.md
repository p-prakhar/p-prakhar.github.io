# Laws of UX audit

**Date:** 2026-11-07
**Scope:** every public page (Home, Writing, post pages, Now, Work, About, Tags,
project case studies, 404) and the phone editor at `/admin/`, checked at
1440px desktop and a 412px Android phone, light and dark.
**Source list:** the 30 laws on [lawsofux.com](https://lawsofux.com/).

"Fixed" means this redesign changed something because of the law. "Holds" means
the site already met it and nothing changed.

| Law | Finding | Status |
| --- | --- | --- |
| Aesthetic-Usability Effect | Default Georgia, tracked capitals, pills and arrows made the site look templated. Newsreader is now self-hosted, the labels are plain sentence case, and there is one accent colour. | Fixed |
| Choice Overload | The Writing page showed five category filters even when only one category had posts. Filters now appear only for categories with posts, with counts, and the row hides when there is nothing to choose. | Fixed |
| Chunking | The Work page is split into eight titled sections with a jump bar that stays at the top on phones. Timeline entries carry a month and year. | Holds |
| Cognitive Bias | No dark patterns, counters or urgency cues. | Holds |
| Cognitive Load | Removed decoration that competed with content: uppercase eyebrows, pill tags, arrows after every link, the left-border "card" on Now. | Fixed |
| Doherty Threshold | Every interaction responds in 120 to 240ms. Fonts use `font-display: swap` with the roman preloaded, so text never waits on a font. Page changes cross-fade in 180ms. | Fixed |
| Fitts's Law | Article and project rows are now one tap target each (the whole row), and every link, tag, filter and nav item is at least 44px tall. The piano keys grew. Long posts end with a "Back to top" link. | Fixed |
| Flow | Posts have a 36rem reading column, no sidebar, and a 2px reading-progress line driven by the scroll timeline. | Fixed |
| Goal-Gradient Effect | The reading-progress line shows how close the reader is to the end of a post. | Fixed |
| Hick's Law | One filled button on the home page (Read the writing); the second action is a text link. | Fixed |
| Jakob's Law | Logo top left links home, nav top right, underlined links, RSS in the footer, Older/Newer links at the end of posts. | Fixed (RSS, post nav) |
| Law of Common Region | Older/Newer post links sit in bordered boxes; the Now preview groups date and note in one ruled band. | Fixed |
| Law of Proximity | Dates sit in a fixed left column beside what they date (writing, Now, Work), not above it on desktop. | Holds |
| Law of Prägnanz | The theme toggle is one icon that morphs between sun and moon instead of two glyphs plus a text label. | Fixed |
| Law of Similarity | Writing rows, project rows and timeline entries share one row pattern: hairline, muted meta, serif title. | Fixed |
| Law of Uniform Connectedness | The Now timeline keeps its connecting line; updates are solid dots, milestones and posts are rings. | Fixed |
| Mental Model | In the editor, drafts are a single "Published" switch with a hint under it, matching how Jekyll actually treats `published: false`. | Fixed |
| Miller's Law | Work's jump bar has eight items, at the edge of 7±2; it scrolls sideways on phones so only four or five show at once. | Holds |
| Occam's Razor | The Now page no longer needs a hand-maintained `timeline_sort` key; it sorts by each item's own date. | Fixed |
| Paradox of the Active User | The editor explains itself inline (field hints) so there is nothing to read first. | Fixed |
| Pareto Principle | The editor lists Now updates and Writing first, the two things edited most. | Fixed |
| Parkinson's Law | "New update" opens a short form with only a title and text required, and is one tap from any page once signed in. | Fixed |
| Peak-End Rule | A post ends with tags, Back to top, All writing and the next post to read, rather than a dead end. | Fixed |
| Postel's Law | The build accepts posts with no tags, and the editor fills the date and hidden fields. | Fixed |
| Selective Attention | Owner-only shortcuts are hidden from visitors; nothing banner-like competes with content. | Fixed |
| Serial Position Effect | Writing is first in the nav; contact links and the piano close every page. | Holds |
| Tesler's Law | Front-matter bookkeeping (layout, timeline kind, date, filename) moved from the author into the editor config. | Fixed |
| Von Restorff Effect | Exactly one accent word in the home headline, one filled button, and an accent underline on the current nav item. | Fixed |
| Working Memory | Older/Newer links show the post title, not just a direction; filter buttons show counts. | Fixed |
| Zeigarnik Effect | The editor has a "Drafts" filter on Writing and Now updates, so unfinished pieces stay in view. | Fixed |

## Also fixed along the way

- The 404 page printed raw Markdown links (`[home page](/)`) because it is an
  HTML file. They are real links now.
- On the Now page, the latest update appeared twice (in full and again as the
  first timeline entry). The timeline now starts from the update before it.
- Project titles that leave the site carry a ↗ and a screen-reader note.

## Left as is, on purpose

- The home headline and other personal copy were kept in Prakhar's words.
- The Work page jump bar keeps all eight sections rather than merging any.

## Follow-up: old-newspaper edition (2026-11-07)

The palette and masthead changed after this audit (newsprint and a night
edition, a blackletter masthead, ruled sections). The findings above still
hold: tap targets, the single filled button, and the motion timings are
unchanged. Text contrast was rechecked: body ink is 13.6:1 on newsprint, muted
text is 6:1, and the spot red is 6.5:1. The dark edition has the same
contrast levels.
