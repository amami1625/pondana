class Tag < ApplicationRecord
  belongs_to :user
  has_many :book_tags, dependent: :destroy
  has_many :books, through: :book_tags

  validates :name, presence: true, uniqueness: { scope: :user_id }, length: { maximum: 100 }
end
