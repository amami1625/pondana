FactoryBot.define do
  factory :book_tag do
    association :book
    association :tag
  end
end
