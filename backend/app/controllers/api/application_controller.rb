module Api
  class ApplicationController < ApplicationController
    before_action :authenticate_user!

    private

    def authenticate_user!
      token = extract_bearer_token
      return render_unauthorized unless token

      begin
        # Supabase JWT シークレットで検証
        decoded_token = JWT.decode(
          token,
          ENV.fetch('SUPABASE_JWT_SECRET', nil),
          true,
          { algorithm: 'HS256' }
        )

        payload = decoded_token[0]
        supabase_uid = payload['sub']

        # supabase_uid でユーザーを検索、存在しなければ作成
        @current_user = User.find_or_create_by_supabase_uid(supabase_uid, payload)
      rescue JWT::DecodeError, JWT::ExpiredSignature => e
        Rails.logger.error "JWT verification failed: #{e.message}"
        render_unauthorized
      rescue ActiveRecord::RecordInvalid => e
        Rails.logger.error "User creation failed: #{e.message}"
        render json: { error: 'アカウント作成に失敗しました' }, status: :internal_server_error
      end
    end

    # 現在のユーザー取得
    attr_reader :current_user

    # Authorization ヘッダーからBearerトークンを抽出
    def extract_bearer_token
      auth_header = request.headers['Authorization']
      return nil unless auth_header&.start_with?('Bearer ')

      auth_header.split(' ', 2).last
    end

    # 認証エラーレスポンス
    def render_unauthorized
      render json: { error: 'ユーザー認証に失敗しました' }, status: :unauthorized
    end
  end
end
