# Require any additional compass plugins here.

# Set this to the root of your project when deployed:
http_path = "/"
css_dir = "wbritt-5059851/assets"
sass_dir = "sass"
images_dir = "wbritt-5059851/assets"
javascripts_dir = "wbritt-5059851/assets"

output_style = :expanded
line_comments = false

# got this from:
# http://stackoverflow.com/questions/11237792/shopify-theme-with-compass-and-sass
module Sass::Script::Functions
  def siu(string)
      assert_type string, :String
      Sass::Script::String.new("url({{'#{string.value}' | asset_url}})")
  end
end
require 'fileutils'
on_stylesheet_saved do |filename|
  s = filename + ".liquid"
  puts "copying to: " + s
  FileUtils.cp(filename, s)
  FileUtils.rm(filename)
  puts "removing: " + filename
end
