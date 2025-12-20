class Api::UsersController < Api::ApplicationController
  rescue_from ActiveRecord::RecordNotFound, with: :record_not_found

  def index
    query = params[:q].to_s.strip

    if query.blank?
      render json: []
      return
    end

    # 現在のユーザーを除外してユーザー名で部分一致検索
    users = User.where('name ILIKE ?', "%#{query}%")
                .where.not(id: current_user.id)
                .limit(20)
                .order(:name)

    render json: users
  end

  def show
    user = User.find(params[:id])
    render json: user.as_json.merge(stats: user.stats)
  end

  def books
    user = User.find(params[:id])
    books = user.books.where(public: true).includes(:category, :tags).order(created_at: :desc)
    render json: books, include: [:category, :tags]
  end

  def lists
    user = User.find(params[:id])
    lists = user.lists
                .where(public: true)
                .left_joins(list_books: :book)
                .select('lists.*, COUNT(CASE WHEN books.public = true THEN 1 END) as books_count')
                .group('lists.id')
                .order(created_at: :desc)
    render json: lists
  end

  private

  def record_not_found
    render json: { error: 'User not found' }, status: :not_found
  end
end
