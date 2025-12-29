require 'rails_helper'

RSpec.describe 'Api::Books', type: :request do
  let(:user) { create(:user) }
  let(:headers) { auth_headers(user) }
  let(:category) { create(:category, user: user) }
  let(:tag1) { create(:tag, user: user) }
  let(:tag2) { create(:tag, user: user) }

  describe 'GET /api/books' do
    it '認証済みユーザーの本一覧を取得できること' do
      create_list(:book, 3, user: user, category: category)
      other_user = create(:user)
      other_category = create(:category, user: other_user)
      create(:book, user: other_user, category: other_category)

      get '/api/books', headers: headers

      expect(response).to have_http_status(:ok)
      json = response.parsed_body
      expect(json.length).to eq(3)
    end

    it '本にカテゴリとタグが含まれること' do
      book = create(:book, user: user, category: category)
      book.tags << tag1

      get '/api/books', headers: headers

      expect(response).to have_http_status(:ok)
      json = response.parsed_body
      expect(json.first['category']).to be_present
      expect(json.first['tags']).to be_present
    end

    it '認証なしではアクセスできないこと' do
      get '/api/books'

      expect(response).to have_http_status(:unauthorized)
    end
  end

  describe 'GET /api/books/:id' do
    it '本の詳細を取得できること' do
      book = create(:book, user: user, category: category)
      book.tags << [tag1, tag2]
      list = create(:list, user: user)
      create(:list_book, list: list, book: book)
      create(:card, book: book)

      get "/api/books/#{book.id}", headers: headers

      expect(response).to have_http_status(:ok)
      json = response.parsed_body
      expect(json['id']).to eq(book.id)
      expect(json['category']).to be_present
      expect(json['tags']).to be_an(Array)
      expect(json['lists']).to be_an(Array)
      expect(json['list_books']).to be_an(Array)
      expect(json['cards']).to be_an(Array)
    end

    it '他のユーザーの本は取得できないこと' do
      other_user = create(:user)
      other_category = create(:category, user: other_user)
      other_book = create(:book, user: other_user, category: other_category)

      get "/api/books/#{other_book.id}", headers: headers

      expect(response).to have_http_status(:not_found)
    end
  end

  describe 'POST /api/books' do
    let(:valid_attributes) do
      {
        book: {
          title: 'Rubyの教科書',
          description: 'Ruby入門書',
          authors: %w[著者A 著者B],
          isbn: '1234567890',
          category_id: category.id,
          tag_ids: [tag1.id, tag2.id],
          public: true,
          rating: 5,
          reading_status: 'unread'
        }
      }
    end

    it '有効な属性で本を作成できること' do
      expect do
        post '/api/books', params: valid_attributes, headers: headers
      end.to change(Book, :count).by(1)

      expect(response).to have_http_status(:created)
      json = response.parsed_body
      expect(json['title']).to eq('Rubyの教科書')
      expect(json['description']).to eq('Ruby入門書')
      expect(json['category']['id']).to eq(category.id)
      expect(json['tags'].length).to eq(2)
    end

    it 'タイトルが空の場合は作成できないこと' do
      post '/api/books', params: { book: { title: '' } }, headers: headers

      expect(response).to have_http_status(:unprocessable_content)
      json = response.parsed_body
      expect(json['errors']).to be_present
    end

    it '他のユーザーのカテゴリを使用できないこと' do
      other_user = create(:user)
      other_category = create(:category, user: other_user)

      expect do
        post '/api/books',
             params: { book: { title: 'テスト本', category_id: other_category.id, reading_status: 'unread' } },
             headers: headers
      end.not_to change(Book, :count)

      expect(response).to have_http_status(:unprocessable_content)
      json = response.parsed_body
      expect(json['errors']).to be_present
    end

    it '他のユーザーのタグを使用できないこと' do
      other_user = create(:user)
      other_tag = create(:tag, user: other_user)

      expect do
        post '/api/books',
             params: { book: { title: 'テスト本', tag_ids: [other_tag.id], reading_status: 'unread' } },
             headers: headers
      end.not_to change(Book, :count)

      expect(response).to have_http_status(:unprocessable_content)
      json = response.parsed_body
      expect(json['errors']).to be_present
    end
  end

  describe 'PATCH /api/books/:id' do
    let(:book) { create(:book, user: user, category: category, title: '旧タイトル') }

    it '本を更新できること' do
      new_category = create(:category, user: user, name: '新カテゴリ')

      patch "/api/books/#{book.id}",
            params: { book: { title: '新タイトル', category_id: new_category.id } },
            headers: headers

      expect(response).to have_http_status(:ok)
      book.reload
      expect(book.title).to eq('新タイトル')
      expect(book.category_id).to eq(new_category.id)
    end

    it 'タグを更新できること' do
      book.tags << tag1

      patch "/api/books/#{book.id}",
            params: { book: { tag_ids: [tag2.id] } },
            headers: headers

      expect(response).to have_http_status(:ok)
      expect(book.reload.tags).to eq([tag2])
    end

    it '他のユーザーの本は更新できないこと' do
      other_user = create(:user)
      other_category = create(:category, user: other_user)
      other_book = create(:book, user: other_user, category: other_category)

      patch "/api/books/#{other_book.id}",
            params: { book: { title: '新タイトル' } },
            headers: headers

      expect(response).to have_http_status(:not_found)
    end

    it '他のユーザーのカテゴリに更新できないこと' do
      other_user = create(:user)
      other_category = create(:category, user: other_user)

      patch "/api/books/#{book.id}",
            params: { book: { category_id: other_category.id } },
            headers: headers

      expect(response).to have_http_status(:unprocessable_content)
      json = response.parsed_body
      expect(json['errors']).to be_present
    end

    it '他のユーザーのタグに更新できないこと' do
      other_user = create(:user)
      other_tag = create(:tag, user: other_user)

      patch "/api/books/#{book.id}",
            params: { book: { tag_ids: [other_tag.id] } },
            headers: headers

      expect(response).to have_http_status(:unprocessable_content)
      json = response.parsed_body
      expect(json['errors']).to be_present
    end
  end

  describe 'DELETE /api/books/:id' do
    let!(:book) { create(:book, user: user, category: category) }

    it '本を削除できること' do
      expect do
        delete "/api/books/#{book.id}", headers: headers
      end.to change(Book, :count).by(-1)

      expect(response).to have_http_status(:no_content)
    end

    it '他のユーザーの本は削除できないこと' do
      other_user = create(:user)
      other_category = create(:category, user: other_user)
      other_book = create(:book, user: other_user, category: other_category)

      expect do
        delete "/api/books/#{other_book.id}", headers: headers
      end.not_to change(Book, :count)

      expect(response).to have_http_status(:not_found)
    end
  end
end
