class AddStatusIdToCards < ActiveRecord::Migration[7.1]
  def change
    add_reference :cards, :status, foreign_key: true
  end
end
