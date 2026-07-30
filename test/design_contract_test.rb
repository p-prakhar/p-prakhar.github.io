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
      read_site_file("_includes", "theme-toggle.html"),
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
      assert_includes header, "'#{path}'"
      assert_match(/>\s*#{label}\s*<\/a>/m, header)
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
