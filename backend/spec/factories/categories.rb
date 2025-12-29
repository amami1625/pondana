FactoryBot.define do
  factory :category do
    association :user
    sequence(:name) { |n| "カテゴリー#{n}" }
  end
end
