FactoryBot.define do
  factory :user do
    sequence(:name) { |n| "ユーザー#{n}" }
    sequence(:supabase_uid) { |n| "uid_#{n}" }
  end
end
