FactoryBot.define do
  factory :list do
    association :user
    sequence(:name) { |n| "リスト#{n}" }
    public { true }

    trait :private do
      public { false }
    end
  end
end
