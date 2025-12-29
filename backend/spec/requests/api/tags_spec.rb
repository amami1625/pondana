require 'rails_helper'

RSpec.describe 'Api::Tags', type: :request do
  let(:user) { create(:user) }
  let(:headers) { auth_headers(user) }

  describe 'GET /api/tags' do
    it '認証済みユーザーのタグ一覧を取得できること' do
      create_list(:tag, 3, user: user)
      other_user = create(:user)
      create(:tag, user: other_user)

      get '/api/tags', headers: headers

      expect(response).to have_http_status(:ok)
      json = response.parsed_body
      expect(json.length).to eq(3)
    end

    it '認証なしではアクセスできないこと' do
      get '/api/tags'

      expect(response).to have_http_status(:unauthorized)
    end
  end

  describe 'POST /api/tags' do
    let(:valid_attributes) { { tag: { name: '重要' } } }

    it '有効な属性でタグを作成できること' do
      expect do
        post '/api/tags', params: valid_attributes, headers: headers
      end.to change(Tag, :count).by(1)

      expect(response).to have_http_status(:created)
      json = response.parsed_body
      expect(json['name']).to eq('重要')
    end

    it '重複する名前では作成できないこと' do
      create(:tag, user: user, name: '重要')

      post '/api/tags', params: valid_attributes, headers: headers

      expect(response).to have_http_status(:unprocessable_content)
      json = response.parsed_body
      expect(json['code']).to eq('ALREADY_EXISTS')
    end

    it '名前が空の場合は作成できないこと' do
      post '/api/tags', params: { tag: { name: '' } }, headers: headers

      expect(response).to have_http_status(:unprocessable_content)
      json = response.parsed_body
      expect(json['code']).to eq('CREATE_FAILED')
    end
  end

  describe 'PATCH /api/tags/:id' do
    let(:tag) { create(:tag, user: user, name: '旧タグ') }

    it 'タグを更新できること' do
      patch "/api/tags/#{tag.id}",
            params: { tag: { name: '新タグ' } },
            headers: headers

      expect(response).to have_http_status(:ok)
      expect(tag.reload.name).to eq('新タグ')
    end

    it '重複する名前では更新できないこと' do
      create(:tag, user: user, name: '既存タグ')

      patch "/api/tags/#{tag.id}",
            params: { tag: { name: '既存タグ' } },
            headers: headers

      expect(response).to have_http_status(:unprocessable_content)
      json = response.parsed_body
      expect(json['code']).to eq('ALREADY_EXISTS')
    end

    it '他のユーザーのタグは更新できないこと' do
      other_user = create(:user)
      other_tag = create(:tag, user: other_user)

      patch "/api/tags/#{other_tag.id}",
            params: { tag: { name: '新タグ' } },
            headers: headers

      expect(response).to have_http_status(:not_found)
    end
  end

  describe 'DELETE /api/tags/:id' do
    let!(:tag) { create(:tag, user: user) }

    it 'タグを削除できること' do
      expect do
        delete "/api/tags/#{tag.id}", headers: headers
      end.to change(Tag, :count).by(-1)

      expect(response).to have_http_status(:no_content)
    end

    it '他のユーザーのタグは削除できないこと' do
      other_user = create(:user)
      other_tag = create(:tag, user: other_user)

      expect do
        delete "/api/tags/#{other_tag.id}", headers: headers
      end.not_to change(Tag, :count)

      expect(response).to have_http_status(:not_found)
    end
  end
end
