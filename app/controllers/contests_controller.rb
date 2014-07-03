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
    render :json => @contest.round(params[:round]) if params[:round]
    render_error
  end

  def reset
    render :json => @contest.reset
  end

  def done
    render :json => @contest.done
  end

  def answer
    if params[:flickr_ids] && params[:round]
      render :json => @contest.answer(params[:flickr_ids], params[:round])
    end
    render_error
  end


  private

  def create_contest
    @contest = Contest.new
  end

  def render_error
    render :json => {success: false}, status: 404 
  end
  
end
