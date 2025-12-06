class AddAuthorsJsonbToBooks < ActiveRecord::Migration[7.1]
  def up
    # authorsカラム(jsonb)を追加
    add_column :books, :authors, :jsonb, default: []

    # 既存データを移行
    Book.reset_column_information
    Book.find_each do |book|
      author_names = book.book_authors.includes(:author).map { |ba| ba.author.name }
      book.update_column(:authors, author_names)
    end
  end

  def down
    remove_column :books, :authors
  end
end
