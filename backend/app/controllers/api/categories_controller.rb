module Api
  class CategoriesController < Api::ApplicationController
    def index
      categories = current_user.categories
      render json: categories
    end

    def create
      category = current_user.categories.build(category_params)
      if category.save
        render json: category, status: :created
      else
        render json: { errors: category.errors }, status: :unprocessable_content
      end
    end

    def update
      category = current_user.categories.find(params[:id])
      if category.update(category_params)
        render json: category, status: :ok
      else
        render json: { errors: category.errors }, status: :unprocessable_content
      end
    end

    def destroy
      category = current_user.categories.find(params[:id])
      if category.destroy
        head :no_content
      else
        render json: { errors: category.errors }, status: :unprocessable_content
      end
    end

    private

    def category_params
      params.require(:category).permit(:name)
    end
  end
end
