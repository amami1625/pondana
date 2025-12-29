FactoryBot.define do
  factory :book do
    association :user
    association :category
    sequence(:title) { |n| "Book Title #{n}" }
    description { 'これは書籍の説明文です。' }
    rating { 4 }
    reading_status { :reading }
    public { true }

    trait :unread do
      reading_status { :unread }
    end

    trait :completed do
      reading_status { :completed }
    end

    trait :private do
      public { false }
    end

    trait :with_tags do
      transient do
        tags_count { 2 }
      end

      after(:create) do |book, evaluator|
        create_list(:tag, evaluator.tags_count, user: book.user).each do |tag|
          book.tags << tag
        end
      end
    end
  end
end
