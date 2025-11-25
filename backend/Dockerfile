FROM ruby:3.2.2
WORKDIR /app

RUN apt-get update -qq && apt-get install -y \
  nodejs \
  npm \
  postgresql-client \
  && rm -rf /var/lib/apt/lists/*

COPY Gemfile* ./
RUN bundle install

COPY . .
COPY docker-entrypoint.sh /app/docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh

EXPOSE 3000
CMD ["/app/docker-entrypoint.sh"]