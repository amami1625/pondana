module AuthHelper
  def generate_jwt_token(user)
    payload = {
      sub: user.supabase_uid,
      exp: 1.hour.from_now.to_i
    }
    JWT.encode(payload, ENV.fetch('SUPABASE_JWT_SECRET', 'test_secret'), 'HS256')
  end

  def auth_headers(user)
    token = generate_jwt_token(user)
    { 'Authorization' => "Bearer #{token}" }
  end
end
