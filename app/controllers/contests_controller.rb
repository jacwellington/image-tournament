class ContestsController < ApplicationController

  before_action :create_contest

  respond_to :json

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

  def create_contest
    @contest = Contest.new
  end

  def error
    render :json => {success: false} 
  end
  
end
