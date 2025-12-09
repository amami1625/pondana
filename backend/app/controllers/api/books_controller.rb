class Api::BooksController < Api::ApplicationController
  def index
    books = current_user.books.includes(:category, :tags).order(created_at: :desc)
    render json: books, include: [:category, :tags]
  end

  def create
    book = current_user.books.build(book_params)
    if book.save
      render json: book, include: [:category, :tags], status: :created
    else
      render json: { errors: book.errors }, status: :unprocessable_entity
    end
  end

  def update
    book = current_user.books.find(params[:id])
    if book.update(book_params)
      render json: book, include: [:category, :tags]
    else
      render json: { errors: book.errors }, status: :unprocessable_entity
    end
  end

  def show
    book = current_user.books.includes(:category, :tags, :lists, :list_books, :cards).find(params[:id])
    render json: book,
           include: {
             category: {},
             tags: {},
             lists: {},
             list_books: { only: [:id, :book_id, :list_id] },
             cards: {}
           }
  end

  def destroy
    book = current_user.books.find(params[:id])
    if book.destroy
      head :no_content
    else
      render json: { errors: book.errors }, status: :unprocessable_entity
    end
  end

  private

  def book_params
    params.require(:book).permit(
      :title, :description, :google_books_id, :isbn, :subtitle, :thumbnail,
      :rating, :reading_status, :category_id, :public,
      authors: [], tag_ids: []
    )
  end
end
