module Api
  class ProfilesController < Api::ApplicationController
    rescue_from ActiveRecord::RecordNotFound, with: :record_not_found

    def show
      user = current_user

      render json: user
    end

    def update
      user = current_user

      if user.update(profile_params)
        render json: user, status: :ok
      else
        render json: {
          code: 'UPDATE_FAILED',
          error: user.errors.full_messages.join(', ')
        }, status: :unprocessable_content
      end
    end

    private

    def profile_params
      params.require(:profile).permit(:name, :avatar_url)
    end

    def record_not_found
      render json: {
        code: 'NOT_FOUND',
        error: 'プロフィール情報が見つかりませんでした'
      }, status: :not_found
    end
  end
end
