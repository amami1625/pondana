require 'rails_helper'

RSpec.describe 'Api::Dashboards', type: :request do
  let(:user) { create(:user) }
  let(:headers) { auth_headers(user) }
  let(:category1) { create(:category, user: user, name: 'プログラミング') }
  let(:category2) { create(:category, user: user, name: 'インフラ') }
  let(:tag1) { create(:tag, user: user, name: 'Ruby') }
  let(:tag2) { create(:tag, user: user, name: 'Rails') }

  describe 'GET /api/dashboard' do
    context '認証済みユーザーの場合' do
      before do
        # 書籍データを作成
        book1 = create(:book, user: user, category: category1, created_at: 1.month.ago)
        book2 = create(:book, user: user, category: category1, created_at: 2.months.ago)
        create(:book, user: user, category: category2, created_at: 3.months.ago)

        # タグを追加
        book1.tags << tag1
        book2.tags << [tag1, tag2]

        # カードを作成
        create(:card, book: book1)
        create(:card, book: book1)
        create(:card, book: book2)
      end

      it 'ダッシュボード統計データを取得できること' do
        get '/api/dashboard', headers: headers

        expect(response).to have_http_status(:ok)
        json = response.parsed_body

        # レスポンス構造の確認
        expect(json).to have_key('overview')
        expect(json).to have_key('monthly')
        expect(json).to have_key('categories')
        expect(json).to have_key('tags')
        expect(json).to have_key('recent_books')
      end

      it 'overview統計が正しいこと' do
        get '/api/dashboard', headers: headers

        json = response.parsed_body
        overview = json['overview']

        expect(overview['total_books']).to eq(3)
        expect(overview['total_cards']).to eq(3)
        expect(overview['total_categories']).to eq(2)
        expect(overview['total_tags']).to eq(2)
      end

      it '月別統計が正しいこと' do
        get '/api/dashboard', headers: headers

        json = response.parsed_body
        monthly = json['monthly']

        # 過去12ヶ月分のデータが含まれること（配列形式）
        expect(monthly).to be_an(Array)
        expect(monthly.length).to eq(12)

        # 書籍を作成した月のカウントが正しいこと
        one_month_ago_key = 1.month.ago.strftime('%Y-%m')
        two_months_ago_key = 2.months.ago.strftime('%Y-%m')
        three_months_ago_key = 3.months.ago.strftime('%Y-%m')

        expect(monthly).to include({ 'month' => one_month_ago_key, 'count' => 1 })
        expect(monthly).to include({ 'month' => two_months_ago_key, 'count' => 1 })
        expect(monthly).to include({ 'month' => three_months_ago_key, 'count' => 1 })
      end

      it 'カテゴリー別統計が正しいこと' do
        get '/api/dashboard', headers: headers

        json = response.parsed_body
        categories = json['categories']

        expect(categories).to be_an(Array)
        expect(categories.length).to eq(2)
        expect(categories).to include({ 'name' => 'プログラミング', 'count' => 2 })
        expect(categories).to include({ 'name' => 'インフラ', 'count' => 1 })
      end

      it 'タグ別統計が正しいこと' do
        get '/api/dashboard', headers: headers

        json = response.parsed_body
        tags = json['tags']

        expect(tags).to be_an(Array)
        expect(tags.length).to eq(2)
        expect(tags).to include({ 'name' => 'Ruby', 'count' => 2 })
        expect(tags).to include({ 'name' => 'Rails', 'count' => 1 })
      end

      it '最近の書籍が正しい順序で取得できること' do
        get '/api/dashboard', headers: headers

        json = response.parsed_body
        recent_books = json['recent_books']

        expect(recent_books.length).to eq(3)
        expect(recent_books.first).to have_key('id')
        expect(recent_books.first).to have_key('title')
        expect(recent_books.first).to have_key('created_at')

        # 作成日時の降順であることを確認
        created_ats = recent_books.map { |book| Time.zone.parse(book['created_at']) }
        expect(created_ats).to eq(created_ats.sort.reverse)
      end

      it '最近の書籍が最大5冊であること' do
        create_list(:book, 6, user: user, category: category1)

        get '/api/dashboard', headers: headers

        json = response.parsed_body
        recent_books = json['recent_books']

        expect(recent_books.length).to eq(5)
      end

      it '他のユーザーのデータは含まれないこと' do
        other_user = create(:user)
        other_category = create(:category, user: other_user)
        create_list(:book, 2, user: other_user, category: other_category)

        get '/api/dashboard', headers: headers

        json = response.parsed_body

        expect(json['overview']['total_books']).to eq(3) # 自分の書籍のみ
      end
    end

    context '認証なしの場合' do
      it 'アクセスできないこと' do
        get '/api/dashboard'

        expect(response).to have_http_status(:unauthorized)
      end
    end
  end
end
