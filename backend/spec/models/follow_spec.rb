require 'rails_helper'

RSpec.describe Follow, type: :model do
  describe 'アソシエーション' do
    it { is_expected.to belong_to(:follower).class_name('User') }
    it { is_expected.to belong_to(:followed).class_name('User') }
  end

  describe 'バリデーション' do
    context '自分自身をフォローできないこと' do
      it '自分自身をフォローしようとすると無効であること' do
        user = create(:user)
        follow = build(:follow, follower: user, followed: user)
        expect(follow).not_to be_valid
        expect(follow.errors[:follower_id]).to include("can't follow yourself")
      end
    end

    context '重複の検証' do
      it '同じユーザーを複数回フォローできないこと' do
        follower = create(:user)
        followed = create(:user)
        create(:follow, follower: follower, followed: followed)
        duplicate_follow = build(:follow, follower: follower, followed: followed)
        expect(duplicate_follow).not_to be_valid
      end

      it '異なるユーザーであればフォローできること' do
        follower = create(:user)
        followed1 = create(:user)
        followed2 = create(:user)
        create(:follow, follower: follower, followed: followed1)
        follow2 = build(:follow, follower: follower, followed: followed2)
        expect(follow2).to be_valid
      end
    end
  end
end
