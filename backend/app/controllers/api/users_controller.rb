class Api::UsersController < Api::ApplicationController
  rescue_from ActiveRecord::RecordNotFound, with: :record_not_found

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
    lists = user.lists.where(public: true).includes(:books).order(created_at: :desc)

    # リスト内の本も公開本のみにフィルタリング
    lists_json = lists.as_json(include: :books)
    lists_json.each do |list|
      list['books'] = list['books'].select { |book| book['public'] == true }
    end

    render json: lists_json
  end

  private

  def record_not_found
    render json: { error: 'User not found' }, status: :not_found
  end
end
