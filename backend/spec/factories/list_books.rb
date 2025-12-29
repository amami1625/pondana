FactoryBot.define do
  factory :list_book do
    association :list
    association :book
  end
end
