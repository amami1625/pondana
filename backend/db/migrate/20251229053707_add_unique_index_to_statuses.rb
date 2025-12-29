class AddUniqueIndexToStatuses < ActiveRecord::Migration[7.1]
  def change
    add_index :statuses, [:user_id, :name], unique: true
  end
end
