class Api::TagsController < Api::ApplicationController
  rescue_from ActiveRecord::RecordNotFound, with: :record_not_found

  def index
    tags = current_user.tags
    render json: tags
  end

  def create
    tag = current_user.tags.build(tag_params)
    if tag.save
      render json: tag, status: :created
    else
      render json: {
        code: 'CREATE_FAILED',
        error: tag.errors.full_messages.join(', '),
      }, status: :unprocessable_entity
    end
  end

  def update
    tag = current_user.tags.find(params[:id])
    if tag.update(tag_params)
      render json: tag, status: :ok
    else
      render json: {
        code: 'UPDATE_FAILED',
        error: tag.errors.full_messages.join(', '),
      }, status: :unprocessable_entity
    end
  end

  def destroy
    tag = current_user.tags.find(params[:id])
    if tag.destroy
      head :no_content
    else
      render json: {
        code: 'DELETE_FAILED',
        error: tag.errors.full_messages.join(', '),
      }, status: :unprocessable_entity
    end
  end

  private

  def tag_params
    params.require(:tag).permit(:name)
  end

  def record_not_found
    render json: {
      code: 'NOT_FOUND',
      error: 'タグが見つかりませんでした',
    }, status: :not_found
  end
end
