class ConvertCardsToUuidPrimaryKey < ActiveRecord::Migration[7.1]
  def up
    # 一時的なUUID列を追加
    add_column :cards, :uuid, :uuid, default: 'gen_random_uuid()', null: false

    # 古いID列を削除
    remove_column :cards, :id

    # UUID列をidにリネーム
    rename_column :cards, :uuid, :id

    # 主キー制約を追加
    execute 'ALTER TABLE cards ADD PRIMARY KEY (id);'
  end

  def down
    raise ActiveRecord::IrreversibleMigration, 'Cannot revert UUID conversion'
  end
end
