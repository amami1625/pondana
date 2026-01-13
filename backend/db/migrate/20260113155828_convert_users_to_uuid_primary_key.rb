class ConvertUsersToUuidPrimaryKey < ActiveRecord::Migration[7.1]
  def up
    # 外部キー制約を一時的に削除
    remove_foreign_key :books, :users
    remove_foreign_key :categories, :users
    remove_foreign_key :tags, :users
    remove_foreign_key :lists, :users
    remove_foreign_key :statuses, :users
    remove_foreign_key :follows, :users, column: :follower_id
    remove_foreign_key :follows, :users, column: :followed_id

    # 一時的なUUID列を追加
    add_column :users, :uuid, :uuid, default: 'gen_random_uuid()', null: false
    add_column :books, :user_uuid, :uuid
    add_column :categories, :user_uuid, :uuid
    add_column :tags, :user_uuid, :uuid
    add_column :lists, :user_uuid, :uuid
    add_column :statuses, :user_uuid, :uuid
    add_column :follows, :follower_uuid, :uuid
    add_column :follows, :followed_uuid, :uuid

    # 既存データのUUIDを関連テーブルに設定
    execute <<-SQL
      UPDATE books
      SET user_uuid = users.uuid
      FROM users
      WHERE books.user_id = users.id;

      UPDATE categories
      SET user_uuid = users.uuid
      FROM users
      WHERE categories.user_id = users.id;

      UPDATE tags
      SET user_uuid = users.uuid
      FROM users
      WHERE tags.user_id = users.id;

      UPDATE lists
      SET user_uuid = users.uuid
      FROM users
      WHERE lists.user_id = users.id;

      UPDATE statuses
      SET user_uuid = users.uuid
      FROM users
      WHERE statuses.user_id = users.id;

      UPDATE follows
      SET follower_uuid = users.uuid
      FROM users
      WHERE follows.follower_id = users.id;

      UPDATE follows
      SET followed_uuid = users.uuid
      FROM users
      WHERE follows.followed_id = users.id;
    SQL

    # 古いID列を削除
    remove_column :users, :id
    remove_column :books, :user_id
    remove_column :categories, :user_id
    remove_column :tags, :user_id
    remove_column :lists, :user_id
    remove_column :statuses, :user_id
    remove_column :follows, :follower_id
    remove_column :follows, :followed_id

    # UUID列をidにリネーム
    rename_column :users, :uuid, :id
    rename_column :books, :user_uuid, :user_id
    rename_column :categories, :user_uuid, :user_id
    rename_column :tags, :user_uuid, :user_id
    rename_column :lists, :user_uuid, :user_id
    rename_column :statuses, :user_uuid, :user_id
    rename_column :follows, :follower_uuid, :follower_id
    rename_column :follows, :followed_uuid, :followed_id

    # 主キー制約を追加
    execute 'ALTER TABLE users ADD PRIMARY KEY (id);'

    # NOT NULL制約を追加
    change_column_null :books, :user_id, false
    change_column_null :categories, :user_id, false
    change_column_null :tags, :user_id, false
    change_column_null :lists, :user_id, false
    change_column_null :statuses, :user_id, false
    change_column_null :follows, :follower_id, false
    change_column_null :follows, :followed_id, false

    # インデックスを再作成
    add_index :books, :user_id
    add_index :categories, :user_id
    add_index :tags, :user_id
    add_index :lists, :user_id
    add_index :statuses, :user_id
    add_index :follows, :follower_id
    add_index :follows, :followed_id
    add_index :follows, [:follower_id, :followed_id], unique: true

    # 複合ユニークインデックスを再作成
    add_index :statuses, [:user_id, :name], unique: true

    # 外部キー制約を再追加
    add_foreign_key :books, :users
    add_foreign_key :categories, :users
    add_foreign_key :tags, :users
    add_foreign_key :lists, :users
    add_foreign_key :statuses, :users
    add_foreign_key :follows, :users, column: :follower_id
    add_foreign_key :follows, :users, column: :followed_id
  end

  def down
    raise ActiveRecord::IrreversibleMigration, 'Cannot revert UUID conversion'
  end
end
