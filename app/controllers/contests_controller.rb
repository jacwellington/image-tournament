class ContestsController < ApplicationController

  before_action :create_contest

  respond_to :json

  def overview
    json_overview = @contest.overview
    overview = JSON.parse(json_overview)
    prepare_overview(overview)
    render :json => overview.to_json
  end

  def current_round
    render :json => @contest.current_round
  end

  def current_images
    render :json => @contest.current_images
  end

  def round
    if params[:round]
      render :json => @contest.round(params[:round])
    else
      error
    end
  end

  def reset
    render :json => @contest.reset
  end

  def done
    @contest.done
    render :json => @contest.reset
  end

  def answer
    if params[:flickr_ids] && params[:round]
      render :json => @contest.answer(params[:flickr_ids], params[:round])
    else
      error
    end
  end


  private

  # Fills out the overview json by making calls to @contest.round
  def prepare_overview(overview)
    overview["contest"]["rounds"].each do |round|
      round_detail = JSON.parse(@contest.round(round["number"]));
      round["pairs"].each_with_index do |pair, index|
        unless round["number"] == 5
          image_a = round_detail["images"][index * 2]
          image_b = round_detail["images"][(index * 2) + 1]
          pair["a_url"] = image_a["url"] 
          pair["b_url"] = image_b["url"]
          pair["a_chosen"] = ""
          pair["b_chosen"] = ""
          if pair["winner_ch"] == "a"
            pair["a_chosen"] = "chosen"
            pair["b_chosen"] = "not-chosen"
          elsif pair["winner_ch"] == "b"
            pair["a_chosen"] = "not-chosen"
            pair["b_chosen"] = "chosen"
          end
        else
          image_a = round_detail["images"][index * 2]
          pair["a_url"] = image_a["url"] 
        end
      end
    end
  end

  def create_contest
    @contest = Contest.new
  end

  def error
    render :json => {success: false} 
  end
  
end
