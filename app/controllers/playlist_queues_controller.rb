class PlaylistQueuesController < ApplicationController

  # GET /playlist_queues.json
  def index
    playlist_queues = PlaylistQueue.find(:all, :order => 'id')

    respond_to do |format|
      format.html { redirect_to playlists_url }
      format.json { render json: playlist_queues.to_json(:include => { :playlist => { :include => :songs} } ) }
    end
  end

  # GET /playlist_queues/1.json
  def show
    playlist_queue = PlaylistQueue.find_by_id(params[:id])

    respond_to do |format|
      if playlist_queue.nil?
        format.html { redirect_to playlists_url }
        format.json { render_id_error(params[:id]) }
      else
        format.html { redirect_to playlists_url }
        format.json { render json: playlist_queue.to_json(:include => { :playlist => { :include => :songs} } ) }
      end
    end
  end

  # DELETE /playlist_queues/1.json
  def destroy
    playlist_queue = PlaylistQueue.find_by_id(params[:id])

    respond_to do |format|
      if playlist_queue.nil?
        format.html { redirect_to playlists_url }
        format.json { render_id_error(params[:id]) }
      elsif playlist_queue.destroy
        format.html { redirect_to playlists_url }
        format.json { head :no_content }
      else
        format.html { redirect_to playlists_url }
        format.json { render json: playlist_queue.errors, status: :unprocessable_entity }
      end
    end
  end

  private

  def render_id_error(id)
    render json: {:errors => ["Playlist (id = #{id}) not found."]}, status: :unprocessable_entity
  end
end
