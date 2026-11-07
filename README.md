# Prakhar's personal site

A small Jekyll site for writing, short updates, projects, and a public
professional history. GitHub Pages deploys the `jekyll` branch.

## One-time setup

The `./site` launcher automatically chooses the compatible Homebrew Ruby on
this Mac and falls back to `ruby` elsewhere.

```sh
bundle install
```

## Write from your phone

The site has a phone-friendly editor at
[p-prakhar.github.io/admin/](https://p-prakhar.github.io/admin/)
([Sveltia CMS](https://github.com/sveltia/sveltia-cms), configured in
`admin/config.yml`). Every save is a commit to `jekyll`, and the normal
GitHub Actions deploy publishes it in about a minute.

- **Now updates** and **Writing** have a **Published** switch. Off means
  draft: the file is committed but Jekyll never builds it. Switch it on and
  save to publish.
- **Projects**, the **About** page, **Music favourites**, and the **Profile**
  are editable too. `hbd/` is deliberately not in the editor.
- Photos added from the phone are resized to WebP and stored in
  `assets/img/uploads/`.
- After you sign in on a device, every page on the site shows a small
  "New update · New post · Edit this page" row in the footer on that device
  only.

### One-time setup on Android

1. Create a fine-grained token at
   <https://github.com/settings/personal-access-tokens/new>: repository
   access **Only select repositories → p-prakhar.github.io**, permission
   **Contents: Read and write** (Metadata read-only is added automatically).
   Pick an expiry you are happy to renew.
2. Open <https://p-prakhar.github.io/admin/> in Chrome, tap
   **Sign In Using Access Token**, and paste the token.
3. Chrome menu → **Add to Home screen** → **Install**. The editor now opens
   from its own icon like an app.

Optional: for a "Sign in with GitHub" button instead of a token, deploy
[sveltia-cms-auth](https://github.com/sveltia/sveltia-cms-auth) to Cloudflare
Workers, register a GitHub OAuth app pointing at it, and set `base_url` in
`admin/config.yml`.

## Write and publish from a computer

Create an unpublished Markdown draft:

```sh
./site new post
./site new update
```

Preview drafts and published content together:

```sh
./site preview
```

Edit the generated Markdown file, then publish it:

```sh
./site publish _posts/YYYY-MM-DD-your-post.md
```

Publishing sets `published: true`, updates the date and timeline order, and
renames the dated filename without overwriting another file.

The manual templates live in `_templates/new-post.md` and
`_templates/new-update.md`.

## Music favourites

The homepage chooses one entry from `_data/music.yml` per UTC day. Manage that
list interactively:

```sh
./site music add
./site music remove
```

An empty list is valid and hides the music module.

## Check before committing

```sh
./site check
```

This runs all Ruby contracts, the JavaScript unit tests, and a strict
GitHub-Pages-compatible Jekyll build.

## Personal Git identity

Commits for this repository must use the personal identity without changing
global Git configuration:

```sh
GIT_AUTHOR_NAME="Prakhar Pandey" \
GIT_AUTHOR_EMAIL="3.14prakhar@gmail.com" \
GIT_COMMITTER_NAME="Prakhar Pandey" \
GIT_COMMITTER_EMAIL="3.14prakhar@gmail.com" \
git commit
```

The site owner performs the push. Before pushing, verify that GitHub
authentication is the personal `p-prakhar` account—not a corporate account:

```sh
gh auth status
git push origin jekyll
```
