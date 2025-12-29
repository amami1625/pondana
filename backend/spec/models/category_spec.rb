require 'rails_helper'

RSpec.describe Category, type: :model do
  describe 'アソシエーション' do
    it { is_expected.to belong_to(:user) }
    it { is_expected.to have_many(:books) }
  end

  describe 'バリデーション' do
    subject(:category) { build(:category) }

    it { is_expected.to validate_presence_of(:name) }
    it { is_expected.to validate_length_of(:name).is_at_most(100) }
    it { is_expected.to validate_uniqueness_of(:name).scoped_to(:user_id).case_insensitive }

    context '名前の重複' do
      it '同じユーザーで同じ名前のカテゴリは作成できないこと' do
        user = create(:user)
        create(:category, user: user, name: 'プログラミング')
        duplicate_category = build(:category, user: user, name: 'プログラミング')
        expect(duplicate_category).not_to be_valid
      end

      it '異なるユーザーであれば同じ名前のカテゴリが作成できること' do
        user1 = create(:user)
        user2 = create(:user)
        create(:category, user: user1, name: 'プログラミング')
        category = build(:category, user: user2, name: 'プログラミング')
        expect(category).to be_valid
      end
    end
  end

  describe '関連の削除' do
    let(:category) { create(:category) }
    let!(:book) { create(:book, category: category, user: category.user) }

    it 'カテゴリを削除すると関連する書籍のcategory_idがnullになること' do
      expect { category.destroy }.to change { book.reload.category_id }.from(category.id).to(nil)
    end
  end
end
