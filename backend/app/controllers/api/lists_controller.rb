module Api
  class ListsController < Api::ApplicationController
    def index
      lists = current_user.lists
                          .left_joins(:list_books)
                          .select('lists.*, COUNT(list_books.id) as books_count')
                          .group('lists.id')
                          .order(created_at: :desc)
      render json: lists
    end

    def show
      list = List.includes({ books: %i[category tags] }, :list_books, :user).find(params[:id])

      # 非公開もしくは所有者でない場合はエラー
      unless list.public || list.user_id == current_user.id
        render json: { error: '権限がありません' }, status: :forbidden
        return
      end

      # 公開リストでも、非公開の本はフィルタリング（所有者以外には見せない）
      filtered_books = if list.user_id == current_user.id
                         list.books
                       else
                         list.books.select(&:public)
                       end

      # JSONレスポンスを明示的に構築
      list_json = list.as_json(
        include: {
          list_books: { only: %i[id book_id list_id] },
          user: { only: %i[id name] }
        }
      )
      list_json['books'] = filtered_books.as_json(include: %i[category tags])

      render json: list_json
    end

    def create
      list = current_user.lists.build(list_params)
      if list.save
        render json: list, status: :created
      else
        render json: { errors: list.errors }, status: :unprocessable_content
      end
    end

    def update
      list = current_user.lists.find(params[:id])
      if list.update(list_params)
        render json: list
      else
        render json: { error: list.error }, status: :unprocessable_content
      end
    end

    def destroy
      list = current_user.lists.find(params[:id])
      if list.destroy
        head :no_content
      else
        render json: { errors: list.errors }, status: :unprocessable_content
      end
    end

    private

    def list_params
      params.require(:list).permit(:name, :description, :public)
    end
  end
end
