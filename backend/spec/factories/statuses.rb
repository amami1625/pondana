FactoryBot.define do
  factory :status do
    association :user
    sequence(:name) { |n| "Status #{n}" }
  end
end
