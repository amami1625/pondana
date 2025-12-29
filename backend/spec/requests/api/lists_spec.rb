require 'rails_helper'

RSpec.describe 'Api::Lists', type: :request do
  let(:user) { create(:user) }
  let(:headers) { auth_headers(user) }

  describe 'GET /api/lists' do
    it '認証済みユーザーのリスト一覧を取得できること' do
      create_list(:list, 3, user: user)
      other_user = create(:user)
      create(:list, user: other_user)

      get '/api/lists', headers: headers

      expect(response).to have_http_status(:ok)
      json = response.parsed_body
      expect(json.length).to eq(3)
    end

    it 'リストに含まれる本の数をbooks_countとして返すこと' do
      list = create(:list, user: user)
      book1 = create(:book, user: user)
      book2 = create(:book, user: user)
      create(:list_book, list: list, book: book1)
      create(:list_book, list: list, book: book2)

      get '/api/lists', headers: headers

      expect(response).to have_http_status(:ok)
      json = response.parsed_body
      expect(json.first['books_count']).to eq(2)
    end

    it '認証なしではアクセスできないこと' do
      get '/api/lists'

      expect(response).to have_http_status(:unauthorized)
    end
  end

  describe 'GET /api/lists/:id' do
    context '自分のリストの場合' do
      it '公開リストを取得できること' do
        list = create(:list, user: user, public: true)
        book = create(:book, user: user)
        create(:list_book, list: list, book: book)

        get "/api/lists/#{list.id}", headers: headers

        expect(response).to have_http_status(:ok)
        json = response.parsed_body
        expect(json['id']).to eq(list.id)
        expect(json['books']).to be_present
      end

      it '非公開リストを取得できること' do
        list = create(:list, user: user, public: false)
        book = create(:book, user: user)
        create(:list_book, list: list, book: book)

        get "/api/lists/#{list.id}", headers: headers

        expect(response).to have_http_status(:ok)
        json = response.parsed_body
        expect(json['id']).to eq(list.id)
      end

      it '非公開の本も含めて全ての本を取得できること' do
        list = create(:list, user: user, public: true)
        public_book = create(:book, user: user, public: true)
        private_book = create(:book, user: user, public: false)
        create(:list_book, list: list, book: public_book)
        create(:list_book, list: list, book: private_book)

        get "/api/lists/#{list.id}", headers: headers

        expect(response).to have_http_status(:ok)
        json = response.parsed_body
        expect(json['books'].length).to eq(2)
      end
    end

    context '他のユーザーのリストの場合' do
      let(:other_user) { create(:user) }

      it '公開リストを取得できること' do
        list = create(:list, user: other_user, public: true)
        book = create(:book, user: other_user, public: true)
        create(:list_book, list: list, book: book)

        get "/api/lists/#{list.id}", headers: headers

        expect(response).to have_http_status(:ok)
        json = response.parsed_body
        expect(json['id']).to eq(list.id)
      end

      it '非公開リストは取得できないこと' do
        list = create(:list, user: other_user, public: false)

        get "/api/lists/#{list.id}", headers: headers

        expect(response).to have_http_status(:forbidden)
        json = response.parsed_body
        expect(json['code']).to eq('FORBIDDEN')
      end

      it '公開リストでも非公開の本はフィルタリングされること' do
        list = create(:list, user: other_user, public: true)
        public_book = create(:book, user: other_user, public: true)
        private_book = create(:book, user: other_user, public: false)
        create(:list_book, list: list, book: public_book)
        create(:list_book, list: list, book: private_book)

        get "/api/lists/#{list.id}", headers: headers

        expect(response).to have_http_status(:ok)
        json = response.parsed_body
        expect(json['books'].length).to eq(1)
        expect(json['books'].first['id']).to eq(public_book.id)
      end
    end
  end

  describe 'POST /api/lists' do
    let(:valid_attributes) { { list: { name: '読みたいリスト', description: '読みたい本のリスト', public: true } } }

    it '有効な属性でリストを作成できること' do
      expect do
        post '/api/lists', params: valid_attributes, headers: headers
      end.to change(List, :count).by(1)

      expect(response).to have_http_status(:created)
      json = response.parsed_body
      expect(json['name']).to eq('読みたいリスト')
      expect(json['description']).to eq('読みたい本のリスト')
      expect(json['public']).to be true
    end

    it '重複する名前では作成できないこと' do
      create(:list, user: user, name: '読みたいリスト')

      post '/api/lists', params: valid_attributes, headers: headers

      expect(response).to have_http_status(:unprocessable_content)
      json = response.parsed_body
      expect(json['code']).to eq('ALREADY_EXISTS')
    end

    it '名前が空の場合は作成できないこと' do
      post '/api/lists', params: { list: { name: '' } }, headers: headers

      expect(response).to have_http_status(:unprocessable_content)
      json = response.parsed_body
      expect(json['code']).to eq('CREATE_FAILED')
    end
  end

  describe 'PATCH /api/lists/:id' do
    let(:list) { create(:list, user: user, name: '旧リスト', public: false) }

    it 'リストを更新できること' do
      patch "/api/lists/#{list.id}",
            params: { list: { name: '新リスト', public: true } },
            headers: headers

      expect(response).to have_http_status(:ok)
      list.reload
      expect(list.name).to eq('新リスト')
      expect(list.public).to be true
    end

    it '重複する名前では更新できないこと' do
      create(:list, user: user, name: '既存リスト')

      patch "/api/lists/#{list.id}",
            params: { list: { name: '既存リスト' } },
            headers: headers

      expect(response).to have_http_status(:unprocessable_content)
      json = response.parsed_body
      expect(json['code']).to eq('ALREADY_EXISTS')
    end

    it '他のユーザーのリストは更新できないこと' do
      other_user = create(:user)
      other_list = create(:list, user: other_user)

      patch "/api/lists/#{other_list.id}",
            params: { list: { name: '新リスト' } },
            headers: headers

      expect(response).to have_http_status(:not_found)
    end
  end

  describe 'DELETE /api/lists/:id' do
    let!(:list) { create(:list, user: user) }

    it 'リストを削除できること' do
      expect do
        delete "/api/lists/#{list.id}", headers: headers
      end.to change(List, :count).by(-1)

      expect(response).to have_http_status(:no_content)
    end

    it '他のユーザーのリストは削除できないこと' do
      other_user = create(:user)
      other_list = create(:list, user: other_user)

      expect do
        delete "/api/lists/#{other_list.id}", headers: headers
      end.not_to change(List, :count)

      expect(response).to have_http_status(:not_found)
    end
  end
end
