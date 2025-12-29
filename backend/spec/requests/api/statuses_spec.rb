require 'rails_helper'

RSpec.describe 'Api::Statuses', type: :request do
  let(:user) { create(:user) }
  let(:headers) { auth_headers(user) }

  describe 'GET /api/statuses' do
    it '認証済みユーザーのステータス一覧を取得できること' do
      create_list(:status, 3, user: user)
      other_user = create(:user)
      create(:status, user: other_user)

      get '/api/statuses', headers: headers

      expect(response).to have_http_status(:ok)
      json = response.parsed_body
      expect(json.length).to eq(3)
    end

    it '認証なしではアクセスできないこと' do
      get '/api/statuses'

      expect(response).to have_http_status(:unauthorized)
    end
  end

  describe 'POST /api/statuses' do
    let(:valid_attributes) { { status: { name: '進行中' } } }

    it '有効な属性でステータスを作成できること' do
      expect do
        post '/api/statuses', params: valid_attributes, headers: headers
      end.to change(Status, :count).by(1)

      expect(response).to have_http_status(:created)
      json = response.parsed_body
      expect(json['name']).to eq('進行中')
    end

    it '重複する名前では作成できないこと' do
      create(:status, user: user, name: '進行中')

      post '/api/statuses', params: valid_attributes, headers: headers

      expect(response).to have_http_status(:unprocessable_content)
      json = response.parsed_body
      expect(json['code']).to eq('ALREADY_EXISTS')
    end

    it '名前が空の場合は作成できないこと' do
      post '/api/statuses', params: { status: { name: '' } }, headers: headers

      expect(response).to have_http_status(:unprocessable_content)
      json = response.parsed_body
      expect(json['code']).to eq('CREATE_FAILED')
    end
  end

  describe 'PATCH /api/statuses/:id' do
    let(:status) { create(:status, user: user, name: '旧ステータス') }

    it 'ステータスを更新できること' do
      patch "/api/statuses/#{status.id}",
            params: { status: { name: '新ステータス' } },
            headers: headers

      expect(response).to have_http_status(:ok)
      expect(status.reload.name).to eq('新ステータス')
    end

    it '重複する名前では更新できないこと' do
      create(:status, user: user, name: '既存ステータス')

      patch "/api/statuses/#{status.id}",
            params: { status: { name: '既存ステータス' } },
            headers: headers

      expect(response).to have_http_status(:unprocessable_content)
      json = response.parsed_body
      expect(json['code']).to eq('ALREADY_EXISTS')
    end

    it '他のユーザーのステータスは更新できないこと' do
      other_user = create(:user)
      other_status = create(:status, user: other_user)

      patch "/api/statuses/#{other_status.id}",
            params: { status: { name: '新ステータス' } },
            headers: headers

      expect(response).to have_http_status(:not_found)
    end
  end

  describe 'DELETE /api/statuses/:id' do
    let!(:status) { create(:status, user: user) }

    it 'ステータスを削除できること' do
      expect do
        delete "/api/statuses/#{status.id}", headers: headers
      end.to change(Status, :count).by(-1)

      expect(response).to have_http_status(:no_content)
    end

    it '他のユーザーのステータスは削除できないこと' do
      other_user = create(:user)
      other_status = create(:status, user: other_user)

      expect do
        delete "/api/statuses/#{other_status.id}", headers: headers
      end.not_to change(Status, :count)

      expect(response).to have_http_status(:not_found)
    end
  end
end
