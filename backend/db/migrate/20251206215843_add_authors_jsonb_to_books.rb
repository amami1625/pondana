class AddAuthorsJsonbToBooks < ActiveRecord::Migration[7.1]
  def up
    # authorsカラム(jsonb)を追加
    add_column :books, :authors, :jsonb, default: []

    # 既存データを移行（book_authorsテーブルが存在する場合のみ）
    if table_exists?(:book_authors) && table_exists?(:authors)
      Book.reset_column_information

      # 一時的なアソシエーションを定義
      Book.class_eval do
        has_many :book_authors_temp, class_name: 'BookAuthor', foreign_key: 'book_id'
      end

      # BookAuthorモデルを一時的に定義
      class BookAuthor < ActiveRecord::Base
        belongs_to :book
        belongs_to :author
      end

      # Authorモデルを一時的に定義
      class Author < ActiveRecord::Base
        has_many :book_authors
      end

      Book.find_each do |book|
        author_names = BookAuthor.where(book_id: book.id).includes(:author).map { |ba| ba.author.name }
        book.update_column(:authors, author_names)
      end
    end
  end

  def down
    remove_column :books, :authors
  end
end
