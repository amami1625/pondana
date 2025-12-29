require_relative 'boot'

require 'rails/all'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module App
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 7.1

    # Please, add to the `ignore` list any other `lib` subdirectories that do
    # not contain `.rb` files, or that should not be reloaded or eager loaded.
    # Common ones are `templates`, `generators`, or `middleware`, for example.
    config.autoload_lib(ignore: %w[assets tasks])

    # Configuration for the application, engines, and railties goes here.
    #
    # These settings can be overridden in specific environments using the files
    # in config/environments, which are processed later.
    # Set timezone to Tokyo
    config.time_zone = 'Tokyo'
    config.active_record.default_timezone = :local
    # config.eager_load_paths << Rails.root.join("extras")

    config.generators do |g|
      g.skip_routes false        # ルートは生成する
      g.template_engine nil      # ビューテンプレート（ERB）を生成しない
      g.test_framework nil       # テストファイルを生成しない
      g.stylesheets false        # CSSファイルを生成しない
      g.javascripts false        # JavaScriptファイルを生成しない
      g.helper false            # ヘルパーファイルを生成しない
      g.assets false            # アセットファイルを生成しない
    end
  end
end
