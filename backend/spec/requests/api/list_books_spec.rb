require 'rails_helper'

RSpec.describe 'Api::ListBooks', type: :request do
  let(:user) { create(:user) }
  let(:headers) { auth_headers(user) }
  let(:list) { create(:list, user: user) }
  let(:category) { create(:category, user: user) }
  let(:book) { create(:book, user: user, category: category) }

  describe 'POST /api/list_books' do
    let(:valid_attributes) do
      {
        list_book: {
          list_id: list.id,
          book_id: book.id
        }
      }
    end

    it 'リストに本を追加できること' do
      expect do
        post '/api/list_books', params: valid_attributes, headers: headers
      end.to change(ListBook, :count).by(1)

      expect(response).to have_http_status(:created)
      json = response.parsed_body
      expect(json['list_id']).to eq(list.id)
      expect(json['book_id']).to eq(book.id)
    end

    it '同じ本を同じリストに重複して追加できないこと' do
      create(:list_book, list: list, book: book)

      post '/api/list_books', params: valid_attributes, headers: headers

      expect(response).to have_http_status(:unprocessable_content)
      json = response.parsed_body
      expect(json['error']).to be_present
    end

    it '他のユーザーのリストには本を追加できないこと' do
      other_user = create(:user)
      other_list = create(:list, user: other_user)

      expect do
        post '/api/list_books',
             params: { list_book: { list_id: other_list.id, book_id: book.id } },
             headers: headers
      end.not_to change(ListBook, :count)

      expect(response).to have_http_status(:not_found)
    end

    it '他のユーザーの本をリストに追加できないこと' do
      other_user = create(:user)
      other_category = create(:category, user: other_user)
      other_book = create(:book, user: other_user, category: other_category)

      expect do
        post '/api/list_books',
             params: { list_book: { list_id: list.id, book_id: other_book.id } },
             headers: headers
      end.not_to change(ListBook, :count)

      expect(response).to have_http_status(:not_found)
    end
  end

  describe 'DELETE /api/list_books/:id' do
    let!(:list_book) { create(:list_book, list: list, book: book) }

    it 'リストから本を削除できること' do
      expect do
        delete "/api/list_books/#{list_book.id}", headers: headers
      end.to change(ListBook, :count).by(-1)

      expect(response).to have_http_status(:no_content)
    end

    it '他のユーザーのリストからは本を削除できないこと' do
      other_user = create(:user)
      other_list = create(:list, user: other_user)
      other_category = create(:category, user: other_user)
      other_book = create(:book, user: other_user, category: other_category)
      other_list_book = create(:list_book, list: other_list, book: other_book)

      expect do
        delete "/api/list_books/#{other_list_book.id}", headers: headers
      end.not_to change(ListBook, :count)

      expect(response).to have_http_status(:not_found)
    end
  end
end
