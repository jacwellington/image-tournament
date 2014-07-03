ImageTournament::Application.routes.draw do

  # Homepage
  root 'static_pages#index'

  # Api routes
  get "/contest/current-round" => "contests#current_round"
  get "/contest/current-images" => "contests#current_images"
  get "/contest/round" => "contests#round"
  post "/contest/reset" => "contests#reset"
  post "/contest/done" => "contests#done"
  post "/contest/answer" => "contests#answer"

end
