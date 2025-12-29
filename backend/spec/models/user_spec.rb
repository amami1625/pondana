require 'rails_helper'

RSpec.describe User, type: :model do
  describe 'validations' do
    it 'is valid with valid attributes' do
      user = build(:user)
      expect(user).to be_valid
    end

    it 'is invalid without a name' do
      user = build(:user, name: nil)
      expect(user).not_to be_valid
    end

    it 'is invalid without a supabase_uid' do
      user = build(:user, supabase_uid: nil)
      expect(user).not_to be_valid
    end

    it 'is invalid with a duplicate supabase_uid' do
      create(:user, supabase_uid: 'duplicate_uid')
      user = build(:user, supabase_uid: 'duplicate_uid')
      expect(user).not_to be_valid
    end
  end

  describe 'associations' do
    it 'has many books' do
      association = described_class.reflect_on_association(:books)
      expect(association.macro).to eq(:has_many)
    end
  end
end
