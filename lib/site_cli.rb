#!/usr/bin/env ruby
# frozen_string_literal: true

require "rbconfig"
require_relative "site_tools"

ruby_bin = File.dirname(RbConfig.ruby)
ENV["PATH"] = [ruby_bin, ENV.fetch("PATH", "")].reject(&:empty?).join(File::PATH_SEPARATOR)

module SiteCLI
  ROOT = File.expand_path("..", __dir__)
  RUBY_TEST_RUNNER = <<~'RUBY'.strip
    Dir["test/*_test.rb"].sort.each { |file| require File.expand_path(file) }
  RUBY
  USAGE = <<~TEXT
    Usage:
      ./site new post
      ./site new update
      ./site preview
      ./site publish PATH
      ./site check
      ./site music add
      ./site music remove
  TEXT

  class Runner
    def initialize(input: $stdin, output: $stdout, error: $stderr)
      @input = input
      @output = output
      @error = error
    end

    def run(arguments)
      command, subcommand, *rest = arguments

      case [command, subcommand]
      when ["new", "post"]
        ensure_no_arguments(rest)
        new_post
      when ["new", "update"]
        ensure_no_arguments(rest)
        new_update
      when ["music", "add"]
        ensure_no_arguments(rest)
        music_add
      when ["music", "remove"]
        ensure_no_arguments(rest)
        music_remove
      else
        return preview(rest) if command == "preview" && subcommand.nil?
        return publish(subcommand, rest) if command == "publish"
        return check(rest) if command == "check" && subcommand.nil?
        return usage(0) if %w[help --help -h].include?(command) && subcommand.nil?

        usage(64)
      end
    rescue SiteTools::Error => error
      @error.puts "Error: #{error.message}"
      1
    rescue Interrupt
      @error.puts "\nCancelled."
      130
    end

    private

    def new_post
      path = SiteTools.create_content(
        root: ROOT,
        kind: :post,
        attributes: {
          "title" => prompt("Title", required: true),
          "description" => prompt("Description", required: true),
          "category" => prompt(
            "Category (#{SiteTools::CATEGORIES.join('/')})",
            required: true
          ),
          "tags" => comma_list(prompt("Tags (comma-separated)"))
        }
      )
      created(path)
    end

    def new_update
      attributes = {
        "title" => prompt("Title", required: true),
        "location" => prompt("Location (optional)"),
        "reading" => prompt("Reading (optional)"),
        "tags" => comma_list(prompt("Tags (comma-separated)"))
      }
      path = SiteTools.create_content(
        root: ROOT,
        kind: :update,
        attributes: attributes
      )
      created(path)
    end

    def created(path)
      @output.puts "Created #{relative(path)}"
      @output.puts "Edit the Markdown, then publish it with:"
      @output.puts "  ./site publish #{relative(path)}"
      0
    end

    def preview(arguments)
      ensure_no_arguments(arguments)
      Dir.chdir(ROOT)
      exec(
        "bundle", "exec", "jekyll", "serve",
        "--livereload", "--unpublished", "--strict_front_matter"
      )
    end

    def publish(path, rest)
      raise SiteTools::InvalidContent, "publish requires a Markdown path." if path.to_s.empty?

      ensure_no_arguments(rest)
      result = SiteTools.publish(path: File.expand_path(path, ROOT))
      @output.puts "Published #{relative(result)}"
      0
    end

    def check(arguments)
      ensure_no_arguments(arguments)
      commands = [
        [RbConfig.ruby, "-Itest", "-e", RUBY_TEST_RUNNER],
        ["node", "--test", "test/site_js.test.js"],
        [
          "bundle", "exec", "jekyll", "build",
          "--strict_front_matter", "--safe", "--trace"
        ]
      ]

      commands.each do |command|
        @output.puts "→ #{command.join(' ')}"
        return $?.exitstatus || 1 unless system(*command, chdir: ROOT)
      end

      @output.puts "All checks passed."
      0
    end

    def music_add
      count = SiteTools.add_music(
        root: ROOT,
        entry: {
          "title" => prompt("Track title", required: true),
          "artist" => prompt("Artist", required: true),
          "url" => prompt("URL (optional)")
        }
      )
      @output.puts "Saved. #{count} #{count == 1 ? 'track' : 'tracks'} in the favourites list."
      0
    end

    def music_remove
      entries = SiteTools.list_music(root: ROOT)
      if entries.empty?
        @output.puts "The favourites list is empty."
        return 0
      end

      entries.each_with_index do |entry, index|
        @output.puts "#{index + 1}. #{entry.fetch('title')} — #{entry.fetch('artist')}"
      end

      selected = Integer(prompt("Number to remove", required: true), 10) - 1
      unless selected.between?(0, entries.length - 1)
        raise SiteTools::InvalidContent, "Choose a number shown in the list."
      end
      candidate = entries.fetch(selected)
      confirmation = prompt(
        "Remove “#{candidate.fetch('title')}” by #{candidate.fetch('artist')}? Type yes"
      )
      unless confirmation.downcase == "yes"
        @output.puts "Cancelled."
        return 0
      end

      removed = SiteTools.remove_music(root: ROOT, index: selected)
      @output.puts "Removed #{removed.fetch('title')} — #{removed.fetch('artist')}."
      0
    rescue ArgumentError, IndexError
      raise SiteTools::InvalidContent, "Choose a number shown in the list."
    end

    def prompt(label, required: false)
      @output.print "#{label}: "
      @output.flush
      value = @input.gets
      raise SiteTools::InvalidContent, "Input ended before #{label} was provided." if value.nil?

      value = value.strip
      if required && value.empty?
        raise SiteTools::InvalidContent, "#{label} cannot be blank."
      end
      value
    end

    def comma_list(value)
      value.split(",").map(&:strip).reject(&:empty?).uniq
    end

    def relative(path)
      Pathname(path).relative_path_from(Pathname(ROOT)).to_s
    end

    def ensure_no_arguments(arguments)
      return if arguments.empty?

      raise SiteTools::InvalidContent, "Unexpected arguments: #{arguments.join(' ')}."
    end

    def usage(status)
      stream = status.zero? ? @output : @error
      stream.puts USAGE
      status
    end
  end

  module_function

  def run(arguments)
    Runner.new.run(arguments)
  end
end

exit SiteCLI.run(ARGV) if $PROGRAM_NAME == __FILE__
