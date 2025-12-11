class AddGoogleBooksFieldsToBooks < ActiveRecord::Migration[7.1]
  def change
    add_column :books, :google_books_id, :string
    add_column :books, :isbn, :string
    add_column :books, :subtitle, :text
    add_column :books, :thumbnail, :string

    add_index :books, [:user_id, :google_books_id], unique: true, where: 'google_books_id IS NOT NULL'
  end
end
