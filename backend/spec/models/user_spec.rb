require 'rails_helper'

RSpec.describe User, type: :model do
  describe 'バリデーション' do
    subject(:user) { build(:user) }

    it { is_expected.to validate_presence_of(:name) }
    it { is_expected.to validate_length_of(:name).is_at_most(50) }
    it { is_expected.to validate_presence_of(:supabase_uid) }
    it { is_expected.to validate_uniqueness_of(:supabase_uid) }
  end

  describe 'アソシエーション' do
    it { is_expected.to have_many(:books).dependent(:destroy) }
  end
end
