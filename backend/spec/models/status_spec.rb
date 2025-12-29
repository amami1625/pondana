require 'rails_helper'

RSpec.describe Status, type: :model do
  describe 'アソシエーション' do
    it { is_expected.to belong_to(:user) }
    it { is_expected.to have_many(:cards).dependent(:nullify) }
  end

  describe 'バリデーション' do
    subject(:status) { build(:status) }

    it { is_expected.to validate_presence_of(:name) }
    it { is_expected.to validate_length_of(:name).is_at_most(50) }
    it { is_expected.to validate_uniqueness_of(:name).scoped_to(:user_id).case_insensitive }

    context '名前の重複' do
      it '異なるユーザーであれば同じ名前でも有効であること' do
        user1 = create(:user)
        user2 = create(:user)
        create(:status, user: user1, name: '同じステータス')
        duplicate_status = build(:status, user: user2, name: '同じステータス')
        expect(duplicate_status).to be_valid
      end
    end
  end

  describe '関連の削除' do
    let(:status) { create(:status) }
    let!(:card) { create(:card, status: status) }

    it 'ステータスを削除すると関連するカードのstatus_idがnullになること' do
      expect { status.destroy }.to change { card.reload.status_id }.from(status.id).to(nil)
    end
  end
end
