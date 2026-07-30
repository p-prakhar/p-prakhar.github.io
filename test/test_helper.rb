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
    match = source.match(/\A---[ \t]*\n(.*?)\n---[ \t]*(?:\n|\z)/m)
    raise "Missing front matter: #{path}" unless match

    YAML.safe_load(match[1], permitted_classes: [Date, Time], aliases: true) || {}
  end
end
