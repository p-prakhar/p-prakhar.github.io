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

  def test_launcher_prefers_the_ruby_with_the_installed_locked_bundle
    launcher = File.read(File.join(ROOT, "site"))
    locked = launcher.index("/opt/homebrew/Cellar/ruby/3.4.7/bin/ruby")
    rolling = launcher.index("/opt/homebrew/opt/ruby/bin/ruby")

    refute_nil locked
    refute_nil rolling
    assert_operator locked, :<, rolling
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
      assert_equal "writing", SiteTools.front_matter(path)["timeline_kind"]
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

  def test_publish_changes_state_and_date_without_losing_body
    with_site do |root|
      path = SiteTools.create_content(
        root: root,
        kind: :update,
        attributes: {"title" => "A short update", "tags" => ["life"]},
        date: Date.new(2026, 7, 30)
      )
      File.open(path, "a") { |file| file.write("A body line.\n") }

      published = SiteTools.publish(path: path, date: Date.new(2026, 7, 31))

      assert_equal "_updates/2026-07-31-a-short-update.md",
                   published.relative_path_from(Pathname(root)).to_s
      assert_equal true, SiteTools.front_matter(published)["published"]
      assert_equal "2026-07-31", SiteTools.front_matter(published)["timeline_sort"]
      assert_includes File.read(published), "A body line.\n"
      refute_path_exists path
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

  def test_music_rejects_non_web_urls
    with_site do |root|
      assert_raises(SiteTools::InvalidContent) do
        SiteTools.add_music(
          root: root,
          entry: {"title" => "Track", "artist" => "Artist", "url" => "javascript:alert(1)"}
        )
      end
    end
  end
end
