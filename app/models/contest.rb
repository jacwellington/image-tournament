# Represents an entire contest within the MPC API. Acts as a wrapper around the api calls.
class Contest

  # Creates a contest by initializing the connection object.
  def initialize 
    @connection =  Faraday.new(:url => 'http://pv.pop.umn.edu') do |faraday|
      faraday.request  :url_encoded             # form-encode POST params
      faraday.response :logger                  # log requests to STDOUT
      faraday.adapter  Faraday.default_adapter  # make requests with Net::HTTP
    end
  end

  # Gets the current round from the api.
  # @returns Current round json.
  def current_round
    response = @connection.get "/contest/#{MPC_TOKEN}/round"
    response.body
  end

  # Gets information on the current images for this round.
  # @returns Json with details on current images.
  def current_images
    response = @connection.get "/contest/#{MPC_TOKEN}/images"
    response.body
  end

  # Gets information on a specific round.
  #
  # @params number [Integer] The number of the round to get information for.
  # @returns Json with details on the round.
  def round(number)
    response = @connection.get "/contest/#{MPC_TOKEN}/round/#{number.to_s}"
    response.body
  end 

  # Resets the current round and initializes a new round.
  # @returns Json response if successful or not.
  def reset
   response = @connection.post "/contest/#{MPC_TOKEN}/reset" 
   response.body
  end

  # Completes the contest.
  # @returns Json response if successful or not.
  def done
    response = @connection.post "/contest/#{MPC_TOKEN}/done"
    response.body
  end

  # Stores an answer to a image for the round.
  #
  # @param flickr_ids [Array] An array of flickr_ids that won the current round.
  # @param round_number [Integer] The round number to answer.
  # @returns Json response if successful or not.
  def answer flickr_ids, round_number
    data = flickr_ids.map { |flickr_id| {flickr_id: flickr_id} }
    response = @connection.post "/contest/#{MPC_TOKEN}/round/#{round_number}", { :data => data }
    response.body
  end
end
