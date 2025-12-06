# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.1].define(version: 2025_12_06_022342) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pgcrypto"
  enable_extension "plpgsql"

  create_table "authors", force: :cascade do |t|
    t.string "name", null: false
    t.bigint "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_authors_on_user_id"
  end

  create_table "book_authors", force: :cascade do |t|
    t.bigint "author_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.uuid "book_id", null: false
    t.index ["author_id"], name: "index_book_authors_on_author_id"
    t.index ["book_id"], name: "index_book_authors_on_book_id"
  end

  create_table "book_tags", force: :cascade do |t|
    t.bigint "tag_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.uuid "book_id", null: false
    t.index ["book_id"], name: "index_book_tags_on_book_id"
    t.index ["tag_id"], name: "index_book_tags_on_tag_id"
  end

  create_table "books", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "title", null: false
    t.text "description"
    t.bigint "user_id", null: false
    t.bigint "category_id"
    t.integer "rating"
    t.integer "reading_status", default: 0, null: false
    t.boolean "public", default: false, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["category_id"], name: "index_books_on_category_id"
    t.index ["user_id"], name: "index_books_on_user_id"
  end

  create_table "cards", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "title", null: false
    t.text "content", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.uuid "book_id", null: false
    t.index ["book_id"], name: "index_cards_on_book_id"
  end

  create_table "categories", force: :cascade do |t|
    t.string "name", null: false
    t.bigint "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_categories_on_user_id"
  end

  create_table "list_books", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.uuid "book_id", null: false
    t.uuid "list_id", null: false
    t.index ["book_id"], name: "index_list_books_on_book_id"
    t.index ["list_id"], name: "index_list_books_on_list_id"
  end

  create_table "lists", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "name"
    t.text "description"
    t.bigint "user_id", null: false
    t.boolean "public"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_lists_on_user_id"
  end

  create_table "tags", force: :cascade do |t|
    t.string "name", null: false
    t.bigint "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_tags_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "supabase_uid", null: false
    t.string "name", null: false
    t.string "avatar_url"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["supabase_uid"], name: "index_users_on_supabase_uid", unique: true
  end

  add_foreign_key "authors", "users"
  add_foreign_key "book_authors", "authors"
  add_foreign_key "book_authors", "books"
  add_foreign_key "book_tags", "books"
  add_foreign_key "book_tags", "tags"
  add_foreign_key "books", "categories"
  add_foreign_key "books", "users"
  add_foreign_key "cards", "books"
  add_foreign_key "categories", "users"
  add_foreign_key "list_books", "books"
  add_foreign_key "list_books", "lists"
  add_foreign_key "lists", "users"
  add_foreign_key "tags", "users"
end
