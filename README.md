# Prakhar's personal site

A small Jekyll site for writing, short updates, projects, and a public
professional history. GitHub Pages deploys the `jekyll` branch.

## One-time setup

The `./site` launcher automatically chooses the compatible Homebrew Ruby on
this Mac and falls back to `ruby` elsewhere.

```sh
bundle install
```

## Write and publish

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
