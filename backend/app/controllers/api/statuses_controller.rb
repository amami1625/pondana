class Api::StatusesController < Api::ApplicationController
  rescue_from ActiveRecord::RecordNotFound, with: :record_not_found

  def index
    statuses = current_user.statuses
    render json: statuses
  end

  def create
    status = current_user.statuses.build(status_params)
    if status.save
      render json: status, status: :created
    else
      render json: {
        code: 'CREATE_FAILED',
        error: status.errors.full_messages.join(', '),
      }, status: :unprocessable_entity
    end
  end

  def update
    status = current_user.statuses.find(params[:id])
    if status.update(status_params)
      render json: status, status: :ok
    else
      render json: {
        code: 'UPDATE_FAILED',
        error: status.errors.full_messages.join(', '),
      }, status: :unprocessable_entity
    end
  end

  def destroy
    status = current_user.statuses.find(params[:id])
    if status.destroy
      head :no_content
    else
      render json: {
        code: 'DELETE_FAILED',
        error: status.errors.full_messages.join(', '),
      }, status: :unprocessable_entity
    end
  end

  private

  def status_params
    params.require(:status).permit(:name)
  end

  def record_not_found
    render json: {
      code: 'NOT_FOUND',
      error: 'ステータスが見つかりませんでした',
    }, status: :not_found
  end
end
