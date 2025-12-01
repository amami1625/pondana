class Api::TagsController < Api::ApplicationController
  def index
    tags = current_user.tags
    render json: tags
  end

  def create
    tag = current_user.tags.build(tag_params)
    if tag.save
      render json: tag, status: :created
    else
      render json: { errors: tag.errors }, status: :unprocessable_entity
    end
  end

  def update
    tag = current_user.tags.find(params[:id])
    if tag.update(tag_params)
      render json: tag, status: :ok
    else
      render json: { errors: tag.errors }, status: :unprocessable_entity
    end
  end

  def destroy
    tag = current_user.tags.find(params[:id])
    if tag.destroy
      head :no_content
    else
      render json: { errors: tag.errors }, status: :unprocessable_entity
    end
  end

  private

  def tag_params
    params.require(:tag).permit(:name)
  end
end
