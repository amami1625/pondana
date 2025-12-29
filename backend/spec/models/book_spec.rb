require 'rails_helper'

RSpec.describe Book, type: :model do
  describe 'アソシエーション' do
    it { is_expected.to belong_to(:user) }
    it { is_expected.to belong_to(:category).optional }
    it { is_expected.to have_many(:list_books).dependent(:destroy) }
    it { is_expected.to have_many(:lists).through(:list_books) }
    it { is_expected.to have_many(:cards).dependent(:destroy) }
    it { is_expected.to have_many(:book_tags).dependent(:destroy) }
    it { is_expected.to have_many(:tags).through(:book_tags) }
  end

  describe 'バリデーション' do
    subject(:book) { build(:book) }

    it { is_expected.to validate_presence_of(:title) }
    it { is_expected.to validate_length_of(:title).is_at_most(255) }
    it { is_expected.to validate_uniqueness_of(:google_books_id).scoped_to(:user_id).allow_nil }
    it { is_expected.to validate_inclusion_of(:rating).in_range(1..5).allow_nil }
    it { is_expected.to validate_presence_of(:reading_status) }
    it { is_expected.to validate_inclusion_of(:public).in_array([true, false]) }

    context 'タイトルの重複' do
      it '異なるユーザーであれば同じタイトルでも有効であること' do
        user1 = create(:user)
        user2 = create(:user)
        create(:book, user: user1, title: '同じタイトル')
        duplicate_book = build(:book, user: user2, title: '同じタイトル')
        expect(duplicate_book).to be_valid
      end
    end

    context 'カテゴリの所有権検証' do
      it '自分のカテゴリを設定できること' do
        user = create(:user)
        category = create(:category, user: user)
        book = build(:book, user: user, category: category)
        expect(book).to be_valid
      end

      it '他のユーザーのカテゴリを設定できないこと' do
        user1 = create(:user)
        user2 = create(:user)
        category = create(:category, user: user2)
        book = build(:book, user: user1, category: category)
        expect(book).not_to be_valid
        expect(book.errors[:category_id]).to be_present
      end

      it 'カテゴリがnilの場合は有効であること' do
        user = create(:user)
        book = build(:book, user: user, category: nil)
        expect(book).to be_valid
      end
    end

    context 'タグの所有権検証' do
      it '自分のタグを設定できること' do
        user = create(:user)
        tag1 = create(:tag, user: user)
        tag2 = create(:tag, user: user)
        book = create(:book, user: user)
        book.tags = [tag1, tag2]
        expect(book).to be_valid
      end

      it '他のユーザーのタグを設定できないこと' do
        user1 = create(:user)
        user2 = create(:user)
        tag = create(:tag, user: user2)
        book = create(:book, user: user1)
        book.tags = [tag]
        expect(book).not_to be_valid
        expect(book.errors[:tags]).to be_present
      end

      it '自分のタグと他のユーザーのタグが混在している場合は無効であること' do
        user1 = create(:user)
        user2 = create(:user)
        own_tag = create(:tag, user: user1)
        other_tag = create(:tag, user: user2)
        book = create(:book, user: user1)
        book.tags = [own_tag, other_tag]
        expect(book).not_to be_valid
        expect(book.errors[:tags]).to be_present
      end

      it 'タグが空の場合は有効であること' do
        user = create(:user)
        book = create(:book, user: user)
        book.tags = []
        expect(book).to be_valid
      end
    end
  end

  describe 'enum' do
    it { is_expected.to define_enum_for(:reading_status).with_values(unread: 0, reading: 1, completed: 2) }
  end

  describe '.as_cards_list' do
    let(:user) { create(:user) }
    let!(:book1) { create(:book, user: user, title: 'Book 1') }
    let!(:book2) { create(:book, user: user, title: 'Book 2') }

    it '書籍とカードの配列を返すこと' do
      result = described_class.as_cards_list(user)

      expect(result).to be_an(Array)
      expect(result.size).to eq(2)
      expect(result.first[:book]).to include(id: book1.id, title: book1.title)
      expect(result.first[:cards]).to eq([])
    end
  end

  describe '関連の削除' do
    let(:book) { create(:book) }

    it '書籍を削除すると関連するlist_booksも削除されること' do
      list = create(:list, user: book.user)
      create(:list_book, book: book, list: list)
      expect { book.destroy }.to change(ListBook, :count).by(-1)
    end

    it '書籍を削除すると関連するcardsも削除されること' do
      create(:card, book: book)
      expect { book.destroy }.to change(Card, :count).by(-1)
    end

    it '書籍を削除すると関連するbook_tagsも削除されること' do
      tag = create(:tag, user: book.user)
      create(:book_tag, book: book, tag: tag)
      expect { book.destroy }.to change(BookTag, :count).by(-1)
    end
  end
end
