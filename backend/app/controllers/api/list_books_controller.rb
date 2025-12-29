module Api
  class ListBooksController < Api::ApplicationController
    before_action :find_list_and_book, only: [:create]
    before_action :find_list_book, only: [:destroy]

    def create
      # 既に追加されているかチェック
      if @list.list_books.exists?(book: @book)
        render json: {
          code: 'ALREADY_EXISTS',
          error: '既にこの本はリストに追加されています'
        }, status: :unprocessable_content
        return
      end

      list_book = @list.list_books.build(book: @book)

      if list_book.save
        render json: list_book, status: :created
      else
        render json: {
          code: 'ADD_FAILED',
          error: list_book.errors.full_messages.join(', ')
        }, status: :unprocessable_content
      end
    rescue ActiveRecord::RecordNotFound
      render json: {
        code: 'NOT_FOUND',
        error: 'リストまたは本が見つかりませんでした'
      }, status: :not_found
    end

    def destroy
      if @list_book.destroy
        head :no_content
      else
        render json: {
          code: 'REMOVE_FAILED',
          error: @list_book.errors.full_messages.join(', ')
        }, status: :unprocessable_content
      end
    rescue ActiveRecord::RecordNotFound
      render json: {
        code: 'NOT_FOUND',
        error: 'リストまたは本が見つかりませんでした'
      }, status: :not_found
    end

    private

    def list_book_params
      # フロントエンドから { list_book: { list_id, book_id } } が送られてくる
      params.require(:list_book).permit(:list_id, :book_id)
    end

    def find_list_and_book
      # 現在のユーザーが所有するリストと本のみを取得
      @list = current_user.lists.find(list_book_params[:list_id])
      @book = current_user.books.find(list_book_params[:book_id])
    end

    def find_list_book
      list_book = ListBook.find(params[:id])

      # 現在のユーザーのリストに紐づいているか確認
      @list = current_user.lists.find(list_book.list_id)
      @list_book = list_book
    end
  end
end
