module Api
  class CategoriesController < Api::ApplicationController
    rescue_from ActiveRecord::RecordNotFound, with: :record_not_found

    def index
      categories = current_user.categories
      render json: categories
    end

    def create
      category = current_user.categories.build(category_params)
      if category.save
        render json: category, status: :created
      else
        error_code = category.errors[:name].any? { |msg| msg.include?('taken') } ? 'ALREADY_EXISTS' : 'CREATE_FAILED'
        render json: {
          code: error_code,
          error: category.errors.full_messages.join(', ')
        }, status: :unprocessable_content
      end
    end

    def update
      category = current_user.categories.find(params[:id])
      if category.update(category_params)
        render json: category, status: :ok
      else
        error_code = category.errors[:name].any? { |msg| msg.include?('taken') } ? 'ALREADY_EXISTS' : 'UPDATE_FAILED'
        render json: {
          code: error_code,
          error: category.errors.full_messages.join(', ')
        }, status: :unprocessable_content
      end
    end

    def destroy
      category = current_user.categories.find(params[:id])
      if category.destroy
        head :no_content
      else
        render json: {
          code: 'DELETE_FAILED',
          error: category.errors.full_messages.join(', ')
        }, status: :unprocessable_content
      end
    end

    private

    def category_params
      params.require(:category).permit(:name)
    end

    def record_not_found
      render json: {
        code: 'NOT_FOUND',
        error: 'カテゴリが見つかりませんでした'
      }, status: :not_found
    end
  end
end
