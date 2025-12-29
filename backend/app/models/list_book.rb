class ListBook < ApplicationRecord
  belongs_to :list
  belongs_to :book

  validates :book_id, uniqueness: { scope: :list_id, message: 'はすでにこのリストに追加されています' }
end
