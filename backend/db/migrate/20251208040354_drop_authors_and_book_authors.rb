class DropAuthorsAndBookAuthors < ActiveRecord::Migration[7.1]
  def change
    drop_table :book_authors do |t|
      t.references :book, null: false, foreign_key: true
      t.references :author, null: false, foreign_key: true
      t.timestamps
    end

    drop_table :authors do |t|
      t.string :name, null: false
      t.references :user, null: false, foreign_key: true
      t.timestamps
    end
  end
end
