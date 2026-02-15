module Api
  class BooksController < Api::ApplicationController
    rescue_from ActiveRecord::RecordNotFound, with: :record_not_found

    def index
      books = current_user.books.includes(:category, :tags).order(created_at: :desc)
      render json: books, include: %i[category tags]
    end

    def show
      book = current_user.books.includes(:category, :tags, :lists, :list_books, :cards).find(params[:id])
      render json: book,
             include: {
               category: {},
               tags: {},
               lists: {},
               list_books: { only: %i[id book_id list_id] },
               cards: {}
             }
    end

    def create
      book = current_user.books.build(book_params)
      if book.save
        render json: book, include: %i[category tags], status: :created
      else
        render json: { error: book.errors.full_messages.join(', ') }, status: :unprocessable_content
      end
    end

    def update
      book = current_user.books.find(params[:id])
      if book.update(book_params)
        render json: book, include: %i[category tags]
      else
        render json: { error: book.errors.full_messages.join(', ') }, status: :unprocessable_content
      end
    end

    def destroy
      book = current_user.books.find(params[:id])
      if book.destroy
        head :no_content
      else
        render json: { error: book.errors.full_messages.join(', ') }, status: :unprocessable_content
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

    def record_not_found
      render json: { error: 'Book not found' }, status: :not_found
    end
  end
end
