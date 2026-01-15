require 'rails_helper'

RSpec.describe 'Api::Profiles', type: :request do
  let(:user) { create(:user) }
  let(:headers) { auth_headers(user) }

  describe 'GET /api/profile' do
    it '認証済みユーザーのプロフィール情報を取得できること' do
      get '/api/profile', headers: headers

      expect(response).to have_http_status(:ok)
      json = response.parsed_body
      expect(json['id']).to eq(user.id)
      expect(json['name']).to eq(user.name)
    end

    it '認証なしではアクセスできないこと' do
      get '/api/profile'

      expect(response).to have_http_status(:unauthorized)
    end
  end

  describe 'PATCH /api/profile' do
    let(:valid_attributes) do
      {
        profile: {
          name: '新しい名前',
          avatar_url: 'https://example.com/avatar.jpg'
        }
      }
    end

    it 'プロフィール情報を更新できること' do
      patch '/api/profile', params: valid_attributes, headers: headers

      expect(response).to have_http_status(:ok)
      json = response.parsed_body
      expect(json['name']).to eq('新しい名前')
      expect(json['avatar_url']).to eq('https://example.com/avatar.jpg')
      expect(user.reload.name).to eq('新しい名前')
    end

    it 'avatar_urlをnullにして画像を削除できること' do
      user.update(avatar_url: 'https://example.com/old-avatar.jpg')

      patch '/api/profile',
            params: { profile: { avatar_url: nil } },
            headers: headers

      expect(response).to have_http_status(:ok)
      expect(user.reload.avatar_url).to be_nil
    end

    it '無効なURLの場合は更新できないこと' do
      patch '/api/profile',
            params: { profile: { avatar_url: 'invalid-url' } },
            headers: headers

      expect(response).to have_http_status(:unprocessable_content)
      json = response.parsed_body
      expect(json['code']).to eq('UPDATE_FAILED')
    end

    it '名前が空の場合は更新できないこと' do
      patch '/api/profile',
            params: { profile: { name: '' } },
            headers: headers

      expect(response).to have_http_status(:unprocessable_content)
      json = response.parsed_body
      expect(json['code']).to eq('UPDATE_FAILED')
    end

    it '認証なしでは更新できないこと' do
      patch '/api/profile', params: valid_attributes

      expect(response).to have_http_status(:unauthorized)
    end
  end
end
