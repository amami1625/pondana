require 'rails_helper'

RSpec.describe 'Api::Categories', type: :request do
  let(:user) { create(:user) }
  let(:headers) { auth_headers(user) }

  describe 'GET /api/categories' do
    it '認証済みユーザーのカテゴリ一覧を取得できること' do
      create_list(:category, 3, user: user)
      other_user = create(:user)
      create(:category, user: other_user)

      get '/api/categories', headers: headers

      expect(response).to have_http_status(:ok)
      json = response.parsed_body
      expect(json.length).to eq(3)
    end

    it '認証なしではアクセスできないこと' do
      get '/api/categories'

      expect(response).to have_http_status(:unauthorized)
    end
  end

  describe 'POST /api/categories' do
    let(:valid_attributes) { { category: { name: '技術書' } } }

    it '有効な属性でカテゴリを作成できること' do
      expect do
        post '/api/categories', params: valid_attributes, headers: headers
      end.to change(Category, :count).by(1)

      expect(response).to have_http_status(:created)
      json = response.parsed_body
      expect(json['name']).to eq('技術書')
    end

    it '重複する名前では作成できないこと' do
      create(:category, user: user, name: '技術書')

      post '/api/categories', params: valid_attributes, headers: headers

      expect(response).to have_http_status(:unprocessable_content)
      json = response.parsed_body
      expect(json['code']).to eq('ALREADY_EXISTS')
    end

    it '名前が空の場合は作成できないこと' do
      post '/api/categories', params: { category: { name: '' } }, headers: headers

      expect(response).to have_http_status(:unprocessable_content)
      json = response.parsed_body
      expect(json['code']).to eq('CREATE_FAILED')
    end
  end

  describe 'PATCH /api/categories/:id' do
    let(:category) { create(:category, user: user, name: '旧カテゴリ') }

    it 'カテゴリを更新できること' do
      patch "/api/categories/#{category.id}",
            params: { category: { name: '新カテゴリ' } },
            headers: headers

      expect(response).to have_http_status(:ok)
      expect(category.reload.name).to eq('新カテゴリ')
    end

    it '重複する名前では更新できないこと' do
      create(:category, user: user, name: '既存カテゴリ')

      patch "/api/categories/#{category.id}",
            params: { category: { name: '既存カテゴリ' } },
            headers: headers

      expect(response).to have_http_status(:unprocessable_content)
      json = response.parsed_body
      expect(json['code']).to eq('ALREADY_EXISTS')
    end

    it '他のユーザーのカテゴリは更新できないこと' do
      other_user = create(:user)
      other_category = create(:category, user: other_user)

      patch "/api/categories/#{other_category.id}",
            params: { category: { name: '新カテゴリ' } },
            headers: headers

      expect(response).to have_http_status(:not_found)
    end
  end

  describe 'DELETE /api/categories/:id' do
    let!(:category) { create(:category, user: user) }

    it 'カテゴリを削除できること' do
      expect do
        delete "/api/categories/#{category.id}", headers: headers
      end.to change(Category, :count).by(-1)

      expect(response).to have_http_status(:no_content)
    end

    it '他のユーザーのカテゴリは削除できないこと' do
      other_user = create(:user)
      other_category = create(:category, user: other_user)

      expect do
        delete "/api/categories/#{other_category.id}", headers: headers
      end.not_to change(Category, :count)

      expect(response).to have_http_status(:not_found)
    end
  end
end
