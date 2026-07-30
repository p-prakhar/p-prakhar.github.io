# frozen_string_literal: true

require "date"
require "fileutils"
require "pathname"
require "tempfile"
require "yaml"

module SiteTools
  CATEGORIES = %w[tech travel life essay].freeze
  CONTENT_DIR = {post: "_posts", update: "_updates"}.freeze
  MUSIC_FIELDS = %w[title artist url].freeze

  class Error < StandardError; end
  class AlreadyExists < Error; end
  class InvalidCategory < Error; end
  class InvalidContent < Error; end

  module_function

  def slugify(title)
    slug = title.to_s.strip.downcase
      .gsub(/c\+\+/, "c")
      .gsub("&", " and ")
      .gsub(/[^a-z0-9]+/, "-")
      .gsub(/\A-+|-+\z/, "")

    raise InvalidContent, "Title must contain letters or numbers." if slug.empty?

    slug
  end

  def create_content(root:, kind:, attributes:, date: Date.today)
    kind = kind.to_sym
    directory = CONTENT_DIR[kind]
    raise InvalidContent, "Unknown content type: #{kind}." unless directory

    attributes = stringify_keys(attributes)
    title = required_text(attributes, "title")
    date = normalize_date(date)
    data = content_front_matter(kind, attributes, title, date)
    path = Pathname(root).expand_path.join(
      directory,
      "#{date.iso8601}-#{slugify(title)}.md"
    )

    FileUtils.mkdir_p(path.dirname)
    begin
      File.open(path, File::WRONLY | File::CREAT | File::EXCL, 0o644) do |file|
        file.write(serialize_document(data, "\n"))
      end
    rescue Errno::EEXIST
      raise AlreadyExists, "Refusing to overwrite #{path}."
    end

    path
  end

  def front_matter(path)
    data, = parse_document(Pathname(path))
    data
  end

  def publish(path:, date: Date.today)
    source = Pathname(path).expand_path
    raise InvalidContent, "Content file does not exist: #{source}." unless source.file?

    data, body = parse_document(source)
    date = normalize_date(date)
    data["published"] = true
    data["date"] = date.iso8601
    data["timeline_sort"] = date.iso8601 if data.key?("timeline_kind")

    unless source.basename.to_s.match?(/\A\d{4}-\d{2}-\d{2}-/)
      raise InvalidContent, "Content filename must start with YYYY-MM-DD-."
    end

    target_name = source.basename.to_s.sub(
      /\A\d{4}-\d{2}-\d{2}-/,
      "#{date.iso8601}-"
    )
    target = source.dirname.join(target_name)
    if target != source && target.exist?
      raise AlreadyExists, "Refusing to overwrite #{target}."
    end

    payload = serialize_document(data, body)
    temp = write_tempfile(source.dirname, payload, source.stat.mode)

    begin
      if target == source
        File.rename(temp.path, source)
      else
        File.rename(temp.path, target)
        File.delete(source)
      end
    ensure
      temp.close!
    end

    target
  end

  def add_music(root:, entry:)
    entry = normalize_music_entry(entry)
    path = music_path(root: root)
    entries = read_music(path)
    entries << entry
    atomic_yaml_write(path, entries)
    entries.length
  end

  def list_music(root:)
    read_music(music_path(root: root)).map(&:dup)
  end

  def remove_music(root:, index:)
    path = music_path(root: root)
    entries = read_music(path)
    index = Integer(index)
    unless index.between?(0, entries.length - 1)
      raise InvalidContent, "Music index must be between 0 and #{entries.length - 1}."
    end

    removed = entries.delete_at(index)
    atomic_yaml_write(path, entries)
    removed
  rescue ArgumentError, TypeError
    raise InvalidContent, "Music index must be a number."
  end

  def content_front_matter(kind, attributes, title, date)
    tags = normalize_tags(attributes["tags"])
    common = {
      "title" => title,
      "date" => date.iso8601,
      "timeline_kind" => kind == :post ? "writing" : "update",
      "timeline_sort" => date.iso8601,
      "tags" => tags,
      "published" => false
    }

    if kind == :post
      category = required_text(attributes, "category").downcase
      unless CATEGORIES.include?(category)
        raise InvalidCategory,
              "Category must be one of: #{CATEGORIES.join(', ')}."
      end

      {
        "layout" => "post",
        "title" => title,
        "description" => required_text(attributes, "description"),
        "category" => category
      }.merge(common.reject { |key, _value| key == "title" })
    else
      optional = {}
      %w[location reading].each do |field|
        value = attributes[field].to_s.strip
        optional[field] = value unless value.empty?
      end
      common.merge(optional)
    end
  end
  private_class_method :content_front_matter

  def parse_document(path)
    source = File.binread(path)
    match = source.match(
      /\A---[ \t]*\r?\n(?<yaml>.*?)\r?\n---[ \t]*(?:\r?\n|\z)/m
    )
    raise InvalidContent, "Missing YAML front matter: #{path}." unless match

    yaml = match[:yaml].dup.force_encoding(Encoding::UTF_8)
    data = YAML.safe_load(
      yaml,
      permitted_classes: [Date, Time],
      aliases: false
    ) || {}
    raise InvalidContent, "Front matter must be a YAML mapping: #{path}." unless data.is_a?(Hash)

    [stringify_keys(data), source.byteslice(match.end(0)..)]
  rescue Psych::Exception => error
    raise InvalidContent, "Invalid YAML front matter in #{path}: #{error.message}"
  end
  private_class_method :parse_document

  def serialize_document(data, body)
    "#{YAML.dump(data)}---\n".b + body.to_s.b
  end
  private_class_method :serialize_document

  def write_tempfile(directory, payload, mode)
    temp = Tempfile.new([".site-tools-", ".tmp"], directory.to_s)
    temp.binmode
    temp.write(payload)
    temp.flush
    temp.fsync
    File.chmod(mode & 0o777, temp.path)
    temp.close
    temp
  rescue StandardError
    temp&.close!
    raise
  end
  private_class_method :write_tempfile

  def atomic_yaml_write(path, value)
    FileUtils.mkdir_p(path.dirname)
    mode = path.exist? ? path.stat.mode : 0o644
    temp = write_tempfile(path.dirname, YAML.dump(value), mode)
    File.rename(temp.path, path)
  ensure
    temp&.close!
  end
  private_class_method :atomic_yaml_write

  def read_music(path)
    return [] unless path.file?

    value = YAML.safe_load(File.read(path), aliases: false) || []
    raise InvalidContent, "#{path} must contain a YAML list." unless value.is_a?(Array)

    value.map { |entry| normalize_music_entry(entry) }
  rescue Psych::Exception => error
    raise InvalidContent, "Invalid music YAML: #{error.message}"
  end
  private_class_method :read_music

  def normalize_music_entry(entry)
    entry = stringify_keys(entry)
    unknown = entry.keys - MUSIC_FIELDS
    unless unknown.empty?
      raise InvalidContent, "Unsupported music fields: #{unknown.join(', ')}."
    end

    normalized = {
      "title" => required_text(entry, "title"),
      "artist" => required_text(entry, "artist")
    }
    url = entry["url"].to_s.strip
    unless url.empty?
      unless url.match?(/\Ahttps?:\/\/[^\s]+\z/i)
        raise InvalidContent, "Music URL must start with http:// or https://."
      end
      normalized["url"] = url
    end
    normalized
  end
  private_class_method :normalize_music_entry

  def music_path(root:)
    Pathname(root).expand_path.join("_data", "music.yml")
  end
  private_class_method :music_path

  def normalize_tags(value)
    value ||= []
    raise InvalidContent, "Tags must be a list." unless value.is_a?(Array)

    value.map { |tag| tag.to_s.strip }.reject(&:empty?).uniq
  end
  private_class_method :normalize_tags

  def required_text(attributes, field)
    value = attributes[field].to_s.strip
    raise InvalidContent, "#{field.capitalize} cannot be blank." if value.empty?

    value
  end
  private_class_method :required_text

  def normalize_date(value)
    value.is_a?(Date) ? value : Date.parse(value.to_s)
  rescue Date::Error
    raise InvalidContent, "Date must be a valid calendar date."
  end
  private_class_method :normalize_date

  def stringify_keys(hash)
    raise InvalidContent, "Attributes must be a mapping." unless hash.respond_to?(:each_pair)

    hash.each_pair.to_h { |key, value| [key.to_s, value] }
  end
  private_class_method :stringify_keys
end
