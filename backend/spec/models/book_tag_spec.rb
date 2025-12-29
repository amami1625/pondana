require 'rails_helper'

RSpec.describe BookTag, type: :model do
  describe 'アソシエーション' do
    it { is_expected.to belong_to(:book) }
    it { is_expected.to belong_to(:tag) }
  end

  describe 'バリデーション' do
    context '重複の検証' do
      it '同じ書籍に同じタグを追加できないこと' do
        user = create(:user)
        book = create(:book, user: user)
        tag = create(:tag, user: user)
        create(:book_tag, book: book, tag: tag)
        duplicate_book_tag = build(:book_tag, book: book, tag: tag)
        expect(duplicate_book_tag).not_to be_valid
      end

      it '異なる書籍であれば同じタグを追加できること' do
        user = create(:user)
        book1 = create(:book, user: user)
        book2 = create(:book, user: user)
        tag = create(:tag, user: user)
        create(:book_tag, book: book1, tag: tag)
        book_tag2 = build(:book_tag, book: book2, tag: tag)
        expect(book_tag2).to be_valid
      end
    end
  end
end
