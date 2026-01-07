module Api
  class DashboardsController < Api::ApplicationController
    def index
      render json: {
        overview: overview_stats,
        monthly: monthly_stats,
        categories: category_stats,
        tags: tag_stats,
        recent_books: recent_books_data
      }
    end

    private

    def overview_stats
      {
        total_books: current_user.books.count,
        total_cards: current_user.books.joins(:cards).count,
        total_categories: current_user.categories.count,
        total_tags: current_user.tags.count
      }
    end

    def monthly_stats
      # 過去12ヶ月の読書数を集計
      books = current_user.books.where(created_at: 12.months.ago..)

      # 月ごとにグループ化してカウント
      books_by_month = books.group_by { |book| book.created_at.strftime('%Y-%m') }
                            .transform_values(&:count)

      # 過去12ヶ月の全ての月を生成し、データがない月は0で埋める（配列形式）
      12.downto(1).map do |months_ago|
        month_key = months_ago.months.ago.strftime('%Y-%m')
        { month: month_key, count: books_by_month[month_key] || 0 }
      end
    end

    def category_stats
      current_user.books
                  .joins(:category)
                  .group('categories.name')
                  .count
                  .map { |name, count| { name: name, count: count } }
    end

    def tag_stats
      current_user.books
                  .joins(:tags)
                  .group('tags.name')
                  .count
                  .map { |name, count| { name: name, count: count } }
    end

    def recent_books_data
      current_user.books
                  .order(created_at: :desc)
                  .limit(5)
                  .as_json(only: %i[id title created_at])
    end
  end
end
