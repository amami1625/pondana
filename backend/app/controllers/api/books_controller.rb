class Api::BooksController < Api::ApplicationController
  def index
    books = current_user.books.includes(:category, :authors).order(created_at: :desc)
    render json: books, include: [:category, :authors]
  end

  def create
    book = current_user.books.build(book_params)
    if book.save
      render json: book, include: :category, status: :created
    else
      render json: { errors: book.errors }, status: :unprocessable_entity
    end
  end

  def update
    book = current_user.books.find(params[:id])
    if book.update(book_params)
      render json: book, include: :category
    else
      render json: { errors: book.errors }, status: :unprocessable_entity
    end
  end

  def show
    book = current_user.books.includes(:category, :authors, :lists, :list_books, :cards).find(params[:id])
    render json: book,
           include: {
             category: {},
             authors: {},
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

  # TODO: Tag機能を実装したらtagsも追加する
  def book_params
    params.require(:book).permit(:title, :description, :rating, :reading_status, :category_id, :public, author_ids: [])
  end
end
