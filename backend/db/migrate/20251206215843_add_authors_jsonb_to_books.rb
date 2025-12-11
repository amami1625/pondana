class AddAuthorsJsonbToBooks < ActiveRecord::Migration[7.1]
  def up
    # authorsカラム(jsonb)を追加
    add_column :books, :authors, :jsonb, default: []

    # 既存データを移行（book_authorsテーブルが存在する場合のみ）
    if table_exists?(:book_authors) && table_exists?(:authors)
      # 直接SQLでデータ移行を行う
      execute <<-SQL
        UPDATE books
        SET authors = COALESCE(
          (
            SELECT jsonb_agg(authors.name)
            FROM book_authors
            JOIN authors ON authors.id = book_authors.author_id
            WHERE book_authors.book_id = books.id
          ),
          '[]'::jsonb
        )
      SQL
    end
  end

  def down
    remove_column :books, :authors
  end
end
