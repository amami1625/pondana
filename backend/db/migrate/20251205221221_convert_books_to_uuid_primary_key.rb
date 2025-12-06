class ConvertBooksToUuidPrimaryKey < ActiveRecord::Migration[7.1]
  def up
    # 外部キー制約を一時的に削除
    remove_foreign_key :book_authors, :books
    remove_foreign_key :book_tags, :books
    remove_foreign_key :cards, :books
    remove_foreign_key :list_books, :books

    # 一時的なUUID列を追加
    add_column :books, :uuid, :uuid, default: 'gen_random_uuid()', null: false
    add_column :book_authors, :book_uuid, :uuid
    add_column :book_tags, :book_uuid, :uuid
    add_column :cards, :book_uuid, :uuid
    add_column :list_books, :book_uuid, :uuid

    # 既存データのUUIDを関連テーブルに設定
    execute <<-SQL
      UPDATE book_authors
      SET book_uuid = books.uuid
      FROM books
      WHERE book_authors.book_id = books.id;

      UPDATE book_tags
      SET book_uuid = books.uuid
      FROM books
      WHERE book_tags.book_id = books.id;

      UPDATE cards
      SET book_uuid = books.uuid
      FROM books
      WHERE cards.book_id = books.id;

      UPDATE list_books
      SET book_uuid = books.uuid
      FROM books
      WHERE list_books.book_id = books.id;
    SQL

    # 古いID列を削除
    remove_column :books, :id
    remove_column :book_authors, :book_id
    remove_column :book_tags, :book_id
    remove_column :cards, :book_id
    remove_column :list_books, :book_id

    # UUID列をidにリネーム
    rename_column :books, :uuid, :id
    rename_column :book_authors, :book_uuid, :book_id
    rename_column :book_tags, :book_uuid, :book_id
    rename_column :cards, :book_uuid, :book_id
    rename_column :list_books, :book_uuid, :book_id

    # 主キー制約を追加
    execute 'ALTER TABLE books ADD PRIMARY KEY (id);'

    # NOT NULL制約を追加
    change_column_null :book_authors, :book_id, false
    change_column_null :book_tags, :book_id, false
    change_column_null :cards, :book_id, false
    change_column_null :list_books, :book_id, false

    # インデックスを再作成
    add_index :book_authors, :book_id
    add_index :book_tags, :book_id
    add_index :cards, :book_id
    add_index :list_books, :book_id

    # 外部キー制約を再追加
    add_foreign_key :book_authors, :books
    add_foreign_key :book_tags, :books
    add_foreign_key :cards, :books
    add_foreign_key :list_books, :books
  end

  def down
    raise ActiveRecord::IrreversibleMigration, 'Cannot revert UUID conversion'
  end
end
