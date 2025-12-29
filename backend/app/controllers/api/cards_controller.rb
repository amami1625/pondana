module Api
  class CardsController < Api::ApplicationController
    def index
      books_with_cards = Book.as_cards_list(current_user)
      render json: { books: books_with_cards }
    end

    def show
      card = Card.joins(:book).includes(:book, :status).find_by(id: params[:id], books: { user_id: current_user.id })
      if card
        render json: card, include: %i[book status]
      else
        render json: {
          code: 'NOT_FOUND',
          message: 'Card not found'
        }, status: :not_found
      end
    end

    def create
      book = current_user.books.find(params[:book_id])
      card = book.cards.build(card_params)
      if card.save
        render json: card, include: [:status], status: :created
      else
        render json: { errors: card.errors }, status: :unprocessable_content
      end
    end

    def update
      book = current_user.books.find(params[:book_id])
      card = book.cards.find(params[:id])
      if card.update(card_params)
        render json: card, include: [:status]
      else
        render json: { errors: card.errors }, status: :unprocessable_content
      end
    end

    def destroy
      book = current_user.books.find(params[:book_id])
      card = book.cards.find(params[:id])
      if card.destroy
        head :no_content
      else
        render json: { errors: card.errors }, status: :unprocessable_content
      end
    end

    private

    def card_params
      params.require(:card).permit(:title, :content, :status_id)
    end
  end
end
