class Api::TopController < Api::ApplicationController
  def index
    # 最新の本（5件）
    recent_books = current_user.books
                               .includes(:category, :tags)
                               .order(created_at: :desc)
                               .limit(5)

    # 最新のリスト（5件）
    recent_lists = current_user.lists
                               .left_joins(:list_books)
                               .select('lists.*, COUNT(list_books.id) as books_count')
                               .group('lists.id')
                               .order(created_at: :desc)
                               .limit(5)

    # 最新のカード（5件）
    recent_cards = Card.joins(:book)
                       .includes(:book)
                       .where(books: { user_id: current_user.id })
                       .order(created_at: :desc)
                       .limit(5)

    render json: {
      recent_books: recent_books.as_json(include: [:category, :tags]),
      recent_lists: recent_lists,
      recent_cards: recent_cards.as_json(include: [:book])
    }
  end
end
