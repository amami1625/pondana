require "rails_helper"

RSpec.describe "Api::Users", type: :request do
  let(:user) { create(:user) }
  let(:headers) { auth_headers(user) }

  describe "GET /api/users" do
    it "クエリでユーザーを検索できること" do
      create(:user, name: "田中太郎")
      create(:user, name: "佐藤花子")
      create(:user, name: "鈴木一郎")

      get "/api/users", params: { q: "田中" }, headers: headers

      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json.length).to eq(1)
      expect(json.first["name"]).to eq("田中太郎")
    end

    it "クエリが空の場合は空配列を返すこと" do
      get "/api/users", params: { q: "" }, headers: headers

      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json).to eq([])
    end

    it "現在のユーザーは検索結果から除外されること" do
      user.update(name: "テストユーザー")
      create(:user, name: "テストユーザー2")

      get "/api/users", params: { q: "テスト" }, headers: headers

      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json.length).to eq(1)
      expect(json.first["name"]).to eq("テストユーザー2")
    end

    it "認証なしではアクセスできないこと" do
      get "/api/users", params: { q: "test" }

      expect(response).to have_http_status(:unauthorized)
    end
  end

  describe "GET /api/users/:id" do
    let(:target_user) { create(:user) }

    it "ユーザーの詳細情報を取得できること" do
      get "/api/users/#{target_user.id}", headers: headers

      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json["id"]).to eq(target_user.id)
      expect(json["stats"]).to be_present
    end

    it "存在しないユーザーの場合は404エラーになること" do
      get "/api/users/nonexistent-id", headers: headers

      expect(response).to have_http_status(:not_found)
    end
  end

  describe "GET /api/users/:id/books" do
    let(:target_user) { create(:user) }
    let(:category) { create(:category, user: target_user) }

    it "ユーザーの公開本一覧を取得できること" do
      create(:book, user: target_user, category: category, public: true)
      create(:book, user: target_user, category: category, public: true)
      create(:book, user: target_user, category: category, public: false)

      get "/api/users/#{target_user.id}/books", headers: headers

      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json.length).to eq(2)
    end

    it "認証なしではアクセスできないこと" do
      get "/api/users/#{target_user.id}/books"

      expect(response).to have_http_status(:unauthorized)
    end
  end

  describe "GET /api/users/:id/lists" do
    let(:target_user) { create(:user) }

    it "ユーザーの公開リスト一覧を取得できること" do
      create(:list, user: target_user, public: true)
      create(:list, user: target_user, public: true)
      create(:list, user: target_user, public: false)

      get "/api/users/#{target_user.id}/lists", headers: headers

      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json.length).to eq(2)
    end

    it "books_countが含まれること" do
      list = create(:list, user: target_user, public: true)
      category = create(:category, user: target_user)
      book = create(:book, user: target_user, category: category, public: true)
      create(:list_book, list: list, book: book)

      get "/api/users/#{target_user.id}/lists", headers: headers

      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json.first["books_count"]).to eq(1)
    end
  end

  describe "POST /api/users/:id/follow" do
    let(:target_user) { create(:user) }

    it "ユーザーをフォローできること" do
      expect {
        post "/api/users/#{target_user.id}/follow", headers: headers
      }.to change(Follow, :count).by(1)

      expect(response).to have_http_status(:created)
      json = JSON.parse(response.body)
      expect(json["message"]).to be_present
    end

    it "自分自身をフォローできないこと" do
      expect {
        post "/api/users/#{user.id}/follow", headers: headers
      }.not_to change(Follow, :count)

      expect(response).to have_http_status(:unprocessable_content)
      json = JSON.parse(response.body)
      expect(json["code"]).to eq("FOLLOW_SELF_ERROR")
    end

    it "既にフォローしているユーザーは再度フォローできないこと" do
      create(:follow, follower: user, followed: target_user)

      expect {
        post "/api/users/#{target_user.id}/follow", headers: headers
      }.not_to change(Follow, :count)

      expect(response).to have_http_status(:unprocessable_content)
      json = JSON.parse(response.body)
      expect(json["code"]).to eq("ALREADY_FOLLOWING")
    end
  end

  describe "DELETE /api/users/:id/follow" do
    let(:target_user) { create(:user) }

    it "ユーザーのフォローを解除できること" do
      create(:follow, follower: user, followed: target_user)

      expect {
        delete "/api/users/#{target_user.id}/follow", headers: headers
      }.to change(Follow, :count).by(-1)

      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json["message"]).to be_present
    end

    it "フォローしていないユーザーのフォロー解除はエラーになること" do
      expect {
        delete "/api/users/#{target_user.id}/follow", headers: headers
      }.not_to change(Follow, :count)

      expect(response).to have_http_status(:not_found)
      json = JSON.parse(response.body)
      expect(json["code"]).to eq("NOT_FOLLOWING")
    end
  end

  describe "GET /api/users/:id/following" do
    let(:target_user) { create(:user) }
    let(:followed_user1) { create(:user) }
    let(:followed_user2) { create(:user) }

    it "ユーザーのフォロー一覧を取得できること" do
      create(:follow, follower: target_user, followed: followed_user1)
      create(:follow, follower: target_user, followed: followed_user2)

      get "/api/users/#{target_user.id}/following", headers: headers

      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json.length).to eq(2)
    end
  end

  describe "GET /api/users/:id/followers" do
    let(:target_user) { create(:user) }
    let(:follower_user1) { create(:user) }
    let(:follower_user2) { create(:user) }

    it "ユーザーのフォロワー一覧を取得できること" do
      create(:follow, follower: follower_user1, followed: target_user)
      create(:follow, follower: follower_user2, followed: target_user)

      get "/api/users/#{target_user.id}/followers", headers: headers

      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json.length).to eq(2)
    end
  end

  describe "GET /api/users/:id/follow_status" do
    let(:target_user) { create(:user) }

    it "フォロー状態を取得できること" do
      create(:follow, follower: user, followed: target_user)

      get "/api/users/#{target_user.id}/follow_status", headers: headers

      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json["is_following"]).to be true
      expect(json["is_followed_by"]).to be false
    end

    it "相互フォローの状態を取得できること" do
      create(:follow, follower: user, followed: target_user)
      create(:follow, follower: target_user, followed: user)

      get "/api/users/#{target_user.id}/follow_status", headers: headers

      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json["is_following"]).to be true
      expect(json["is_followed_by"]).to be true
    end
  end
end
