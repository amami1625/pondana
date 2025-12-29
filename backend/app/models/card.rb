class Card < ApplicationRecord
  belongs_to :book
  belongs_to :status, optional: true

  validates :title, presence: true, length: { maximum: 255 }
  validates :content, presence: true, length: { maximum: 10_000 }
end
