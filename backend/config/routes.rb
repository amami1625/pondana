Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # API routes
  namespace :api do
    get "hello/index", to: "hello#index"
    get "top", to: "top#index"
    resources :books, only: %i[index create update show destroy] do
      resources :cards, only: %i[create update destroy]
    end
    resources :cards, only: %i[index show]
    resources :lists, only: %i[index create update show destroy]
    resources :list_books, only: %i[create destroy]
    resources :categories, only: %i[index create update destroy]
    resources :tags, only: %i[index create update destroy]
    resources :statuses, only: %i[index create update destroy]
    resource :profile, only: %i[show update]
    resources :users, only: %i[show] do
      member do
        get :books
        get :lists
      end
    end
  end

  # Defines the root path route ("/")
  # root "posts#index"
end
