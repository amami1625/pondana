Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins ENV.fetch('FRONTEND_URL', nil)

    resource '*',
             headers: %w[Content-Type Authorization],
             methods: %i[get post put patch delete options head],
             credentials: true
  end
end
