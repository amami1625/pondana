require "rails_helper"

RSpec.describe "Api::Top", type: :request do
  let(:user) { create(:user) }
  let(:headers) { auth_headers(user) }
  let(:category) { create(:category, user: user) }

  describe "GET /api/top" do
    it "トップページのデータを取得できること" do
      get "/api/top", headers: headers

      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json).to have_key("recent_books")
      expect(json).to have_key("recent_lists")
      expect(json).to have_key("recent_cards")
    end

    it "最新の本を5件まで取得できること" do
      create_list(:book, 7, user: user, category: category)

      get "/api/top", headers: headers

      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json["recent_books"].length).to eq(5)
    end

    it "最新のリストを5件まで取得できること" do
      create_list(:list, 7, user: user)

      get "/api/top", headers: headers

      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json["recent_lists"].length).to eq(5)
    end

    it "最新のカードを5件まで取得できること" do
      book = create(:book, user: user, category: category)
      create_list(:card, 7, book: book)

      get "/api/top", headers: headers

      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json["recent_cards"].length).to eq(5)
    end

    it "本にカテゴリとタグが含まれること" do
      book = create(:book, user: user, category: category)
      tag = create(:tag, user: user)
      book.tags << tag

      get "/api/top", headers: headers

      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json["recent_books"].first["category"]).to be_present
      expect(json["recent_books"].first["tags"]).to be_present
    end

    it "カードに本とステータスが含まれること" do
      book = create(:book, user: user, category: category)
      status = create(:status, user: user)
      create(:card, book: book, status: status)

      get "/api/top", headers: headers

      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json["recent_cards"].first["book"]).to be_present
      expect(json["recent_cards"].first["status"]).to be_present
    end

    it "リストにbooks_countが含まれること" do
      list = create(:list, user: user)
      book = create(:book, user: user, category: category)
      create(:list_book, list: list, book: book)

      get "/api/top", headers: headers

      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json["recent_lists"].first["books_count"]).to eq(1)
    end

    it "他のユーザーのデータは含まれないこと" do
      other_user = create(:user)
      other_category = create(:category, user: other_user)
      create(:book, user: other_user, category: other_category)
      create(:list, user: other_user)

      get "/api/top", headers: headers

      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json["recent_books"]).to be_empty
      expect(json["recent_lists"]).to be_empty
      expect(json["recent_cards"]).to be_empty
    end

    it "認証なしではアクセスできないこと" do
      get "/api/top"

      expect(response).to have_http_status(:unauthorized)
    end
  end
end
