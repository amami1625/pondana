class Status < ApplicationRecord
  belongs_to :user
  has_many :cards, dependent: :nullify

  validates :name, presence: true, length: { maximum: 50 }
end
