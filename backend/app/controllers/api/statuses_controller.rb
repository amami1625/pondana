class Api::StatusesController < Api::ApplicationController
  def index
    statuses = current_user.statuses
    render json: statuses
  end

  def create
    status = current_user.statuses.build(status_params)
    if status.save
      render json: status, status: :created
    else
      render json: { errors: status.errors }, status: :unprocessable_entity
    end
  end

  def update
    status = current_user.statuses.find(params[:id])
    if status.update(status_params)
      render json: status, status: :ok
    else
      render json: { errors: status.errors }, status: :unprocessable_entity
    end
  end

  def destroy
    status = current_user.statuses.find(params[:id])
    if status.destroy
      head :no_content
    else
      render json: { errors: status.errors }, status: :unprocessable_entity
    end
  end

  private

  def status_params
    params.require(:status).permit(:name)
  end
end
