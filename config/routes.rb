Rails.application.routes.draw do
  root to: 'answers#index'
  get 'answers', to: 'answers#index'
  post 'answers/find', to: 'answers#findAnswer'
end
