require 'rails_helper'

RSpec.describe 'Api::Cards', type: :request do
  let(:user) { create(:user) }
  let(:headers) { auth_headers(user) }
  let(:category) { create(:category, user: user) }
  let(:book) { create(:book, user: user, category: category) }
  let(:status) { create(:status, user: user) }

  describe 'GET /api/cards' do
    it 'カード一覧を本ごとにグループ化して取得できること' do
      book1 = create(:book, user: user, category: category)
      book2 = create(:book, user: user, category: category)
      create(:card, book: book1)
      create(:card, book: book1)
      create(:card, book: book2)

      get '/api/cards', headers: headers

      expect(response).to have_http_status(:ok)
      json = response.parsed_body
      expect(json['books']).to be_an(Array)
      expect(json['books'].length).to eq(2)
    end

    it '認証なしではアクセスできないこと' do
      get '/api/cards'

      expect(response).to have_http_status(:unauthorized)
    end
  end

  describe 'GET /api/cards/:id' do
    it 'カードの詳細を取得できること' do
      card = create(:card, book: book, status: status)

      get "/api/cards/#{card.id}", headers: headers

      expect(response).to have_http_status(:ok)
      json = response.parsed_body
      expect(json['id']).to eq(card.id)
      expect(json['book']).to be_present
      expect(json['status']).to be_present
    end

    it '他のユーザーのカードは取得できないこと' do
      other_user = create(:user)
      other_category = create(:category, user: other_user)
      other_book = create(:book, user: other_user, category: other_category)
      other_card = create(:card, book: other_book)

      get "/api/cards/#{other_card.id}", headers: headers

      expect(response).to have_http_status(:not_found)
      json = response.parsed_body
      expect(json['error']).to be_present
    end
  end

  describe 'POST /api/books/:book_id/cards' do
    let(:valid_attributes) do
      {
        card: {
          title: 'カードタイトル',
          content: 'カード内容',
          status_id: status.id
        }
      }
    end

    it '有効な属性でカードを作成できること' do
      expect do
        post "/api/books/#{book.id}/cards", params: valid_attributes, headers: headers
      end.to change(Card, :count).by(1)

      expect(response).to have_http_status(:created)
      json = response.parsed_body
      expect(json['title']).to eq('カードタイトル')
      expect(json['content']).to eq('カード内容')
      expect(json['status']).to be_present
    end

    it 'タイトルが空の場合は作成できないこと' do
      post "/api/books/#{book.id}/cards",
           params: { card: { title: '', content: '内容' } },
           headers: headers

      expect(response).to have_http_status(:unprocessable_content)
      json = response.parsed_body
      expect(json['error']).to be_present
    end

    it '他のユーザーの本にはカードを作成できないこと' do
      other_user = create(:user)
      other_category = create(:category, user: other_user)
      other_book = create(:book, user: other_user, category: other_category)

      expect do
        post "/api/books/#{other_book.id}/cards",
             params: { card: { title: 'カード', content: '内容' } },
             headers: headers
      end.not_to change(Card, :count)

      expect(response).to have_http_status(:not_found)
    end
  end

  describe 'PATCH /api/books/:book_id/cards/:id' do
    let(:card) { create(:card, book: book, title: '旧タイトル') }

    it 'カードを更新できること' do
      new_status = create(:status, user: user, name: '新ステータス')

      patch "/api/books/#{book.id}/cards/#{card.id}",
            params: {
              card: { title: '新タイトル', status_id: new_status.id }
            },
            headers: headers

      expect(response).to have_http_status(:ok)
      card.reload
      expect(card.title).to eq('新タイトル')
      expect(card.status_id).to eq(new_status.id)
    end

    it '他のユーザーのカードは更新できないこと' do
      other_user = create(:user)
      other_category = create(:category, user: other_user)
      other_book = create(:book, user: other_user, category: other_category)
      other_card = create(:card, book: other_book)

      patch "/api/books/#{other_book.id}/cards/#{other_card.id}",
            params: {
              card: { title: '新タイトル' }
            },
            headers: headers

      expect(response).to have_http_status(:not_found)
    end
  end

  describe 'DELETE /api/books/:book_id/cards/:id' do
    let!(:card) { create(:card, book: book) }

    it 'カードを削除できること' do
      expect do
        delete "/api/books/#{book.id}/cards/#{card.id}", headers: headers
      end.to change(Card, :count).by(-1)

      expect(response).to have_http_status(:no_content)
    end

    it '他のユーザーのカードは削除できないこと' do
      other_user = create(:user)
      other_category = create(:category, user: other_user)
      other_book = create(:book, user: other_user, category: other_category)
      other_card = create(:card, book: other_book)

      expect do
        delete "/api/books/#{other_book.id}/cards/#{other_card.id}",
               headers: headers
      end.not_to change(Card, :count)

      expect(response).to have_http_status(:not_found)
    end
  end
end
