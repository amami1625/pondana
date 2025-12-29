FactoryBot.define do
  factory :card do
    association :book
    sequence(:title) { |n| "カードタイトル#{n}" }
    content { 'これはカードのコンテンツです。' }
  end
end
