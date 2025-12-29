require 'rails_helper'

RSpec.describe Card, type: :model do
  describe 'アソシエーション' do
    it { is_expected.to belong_to(:book) }
    it { is_expected.to belong_to(:status).optional }
  end

  describe 'バリデーション' do
    it { is_expected.to validate_presence_of(:title) }
    it { is_expected.to validate_length_of(:title).is_at_most(255) }
    it { is_expected.to validate_presence_of(:content) }
    it { is_expected.to validate_length_of(:content).is_at_most(10_000) }
  end
end
