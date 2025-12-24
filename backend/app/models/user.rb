class User < ApplicationRecord
  has_many :books, dependent: :destroy
  has_many :authors, dependent: :destroy
  has_many :categories, dependent: :destroy
  has_many :tags, dependent: :destroy
  has_many :lists, dependent: :destroy
  has_many :statuses, dependent: :destroy

  # フォロー機能の関連
  has_many :active_follows, class_name: 'Follow', foreign_key: 'follower_id', dependent: :destroy
  has_many :passive_follows, class_name: 'Follow', foreign_key: 'followed_id', dependent: :destroy
  has_many :following, through: :active_follows, source: :followed
  has_many :followers, through: :passive_follows, source: :follower

  validates :name, presence: true, length: { maximum: 50 }
  validates :supabase_uid, presence: true, uniqueness: true

  # 初回ログイン時にSupabaseのUIDをもとにユーザーを検索し、存在しない場合は作成する
  def self.find_or_create_by_supabase_uid(supabase_uid, payload = {})
    find_or_create_by!(supabase_uid: supabase_uid) do |user|
      user.name = extract_user_name(payload)
    end
  rescue ActiveRecord::RecordInvalid => e
    Rails.logger.error "ユーザー作成失敗: #{e.message}, payload: #{payload}"
    raise
  end

  # 読書統計情報を返す
  def stats
    {
      public_books: books.where(public: true).count,
      public_lists: lists.where(public: true).count,
      following_count: following.count,
      followers_count: followers.count
    }
  end

  private

  def self.extract_user_name(payload)
    payload.dig('user_metadata', 'full_name') ||
    payload.dig('user_metadata', 'name') || '名無しさん'
  end

end
