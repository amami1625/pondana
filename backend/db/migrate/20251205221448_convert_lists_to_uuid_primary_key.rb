class ConvertListsToUuidPrimaryKey < ActiveRecord::Migration[7.1]
  def up
    # 外部キー制約を一時的に削除
    remove_foreign_key :list_books, :lists

    # 一時的なUUID列を追加
    add_column :lists, :uuid, :uuid, default: 'gen_random_uuid()', null: false
    add_column :list_books, :list_uuid, :uuid

    # 既存データのUUIDを関連テーブルに設定
    execute <<-SQL
      UPDATE list_books
      SET list_uuid = lists.uuid
      FROM lists
      WHERE list_books.list_id = lists.id;
    SQL

    # 古いID列を削除
    remove_column :lists, :id
    remove_column :list_books, :list_id

    # UUID列をidにリネーム
    rename_column :lists, :uuid, :id
    rename_column :list_books, :list_uuid, :list_id

    # 主キー制約を追加
    execute 'ALTER TABLE lists ADD PRIMARY KEY (id);'

    # NOT NULL制約を追加
    change_column_null :list_books, :list_id, false

    # インデックスを再作成
    add_index :list_books, :list_id

    # 外部キー制約を再追加
    add_foreign_key :list_books, :lists
  end

  def down
    raise ActiveRecord::IrreversibleMigration, 'Cannot revert UUID conversion'
  end
end
