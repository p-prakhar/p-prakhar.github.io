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
      assert_equal "writing", data["timeline_kind"], path
    end
  end

  def test_projects_have_unique_integer_order
    projects = Dir[root_path("_projects", "*.md")].map do |path|
      [path, front_matter(path)]
    end
    orders = projects.map { |_path, data| Integer(data.fetch("order")) }

    assert_equal orders.uniq.sort, orders.sort
    projects.each do |path, data|
      refute_empty data.fetch("title"), path
      refute_empty data.fetch("description"), path
      assert_kind_of Array, data.fetch("tools"), path
      source = File.read(path)
      body = source.sub(/\A---[ \t]*\n.*?\n---[ \t]*(?:\n|\z)/m, "").strip
      assert_operator body.length, :>=, 40, path
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

  def test_now_page_combines_updates_writing_and_public_milestones
    milestones = YAML.safe_load(
      read_site_file("_data", "milestones.yml"),
      aliases: true
    )
    milestone_copy = milestones.map { |event| event.values_at("title", "description").join(" ") }.join("\n")
    now_page = read_site_file("pages", "now.html")

    assert_operator milestones.size, :>=, 6
    assert_includes milestone_copy, "IIT Guwahati"
    assert_includes milestone_copy, "Nutanix"
    assert_includes milestone_copy.downcase, "graduated"
    assert_includes now_page, "site.data.milestones"
    assert_includes now_page, "site.posts"
  end

  def test_every_timeline_source_has_a_comparable_iso_sort_key
    events = YAML.safe_load(
      read_site_file("_data", "milestones.yml"),
      aliases: true
    )
    events += Dir[root_path("_posts", "*.md")].map { |path| front_matter(path) }
    events += Dir[root_path("_updates", "*.md")].map { |path| front_matter(path) }

    events.each do |event|
      assert_kind_of String, event["timeline_sort"]
      assert_match(/\A\d{4}-\d{2}-\d{2}\z/, event["timeline_sort"])
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
