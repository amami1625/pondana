require 'rails_helper'

RSpec.describe User, type: :model do
  describe 'バリデーション' do
    subject(:user) { build(:user) }

    it { is_expected.to validate_presence_of(:name) }
    it { is_expected.to validate_length_of(:name).is_at_most(50) }
    it { is_expected.to validate_presence_of(:supabase_uid) }
    it { is_expected.to validate_uniqueness_of(:supabase_uid) }

    context 'avatar_url' do
      it 'nilの場合は有効であること' do
        user.avatar_url = nil
        expect(user).to be_valid
      end

      it '有効なURL形式の場合は有効であること' do
        user.avatar_url = 'https://example.com/avatar.jpg'
        expect(user).to be_valid
      end

      it '無効なURL形式の場合は無効であること' do
        user.avatar_url = 'invalid-url'
        expect(user).not_to be_valid
        expect(user.errors[:avatar_url]).to include('must be a valid URL')
      end

      it 'httpスキームのURLは有効であること' do
        user.avatar_url = 'http://example.com/avatar.jpg'
        expect(user).to be_valid
      end
    end
  end

  describe 'アソシエーション' do
    it { is_expected.to have_many(:books).dependent(:destroy) }
  end
end
