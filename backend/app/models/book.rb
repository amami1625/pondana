class Book < ApplicationRecord
  belongs_to :user
  belongs_to :category, optional: true
  has_many :list_books, dependent: :destroy
  has_many :lists, through: :list_books
  has_many :cards, dependent: :destroy
  has_many :book_tags, dependent: :destroy
  has_many :tags, through: :book_tags

  validates :title, presence: true, length: { maximum: 255 }
  validates :google_books_id, uniqueness: { scope: :user_id }, allow_nil: true
  validates :rating, inclusion: { in: 1..5 }, allow_nil: true
  validates :reading_status, presence: true
  validates :public, inclusion: { in: [true, false] }
  validate :category_belongs_to_user
  validate :tags_belong_to_user

  enum :reading_status, { unread: 0, reading: 1, completed: 2 }

  def self.as_cards_list(user)
    user.books.includes(cards: :status).map do |book|
      {
        book: {
          id: book.id,
          title: book.title
        },
        cards: book.cards.map do |card|
          {
            id: card.id,
            title: card.title,
            content: card.content,
            book_id: card.book_id,
            status: card.status,
            created_at: card.created_at,
            updated_at: card.updated_at
          }
        end
      }
    end
  end

  private

  def category_belongs_to_user
    return if category_id.blank?
    return if category&.user_id == user_id

    errors.add(:category_id, 'must belong to the user')
  end

  def tags_belong_to_user
    return if tags.empty?

    invalid_tags = tags.reject { |tag| tag.user_id == user_id }
    return if invalid_tags.empty?

    errors.add(:tags, 'must all belong to the user')
  end
end
