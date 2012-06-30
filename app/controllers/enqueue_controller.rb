class EnqueueController < ApplicationController

  # POST /enqueue.json
  def create
    # need to have either a UUID or a Playlist ID parameter
    # UUID takes precendence
    uuid = params[:uuid]
    playlist_id = params[:playlist_id]

    if not uuid.nil?
      enqueue_uuid(uuid)
    elsif not playlist_id.nil?
      enqueue_playlist(playlist_id)
    else
      # No UUID or Playlist ID, so return an error
      respond_to do |format|
        format.json { render json: {:errors => ["uuid or playlist_id parameter not given"]}, status: :unprocessable_entity }
      end
    end
  end


  private

  # Queue the playlist with the given playlist ID
  def enqueue_playlist(playlist_id)
    playlist = Playlist.find_by_id(playlist_id)

    if playlist.nil?
      # playlist with given ID not found, so return an error
      respond_to do |format|
        format.json { render json: {:errors => ["Playlist (id = #{playlist_id}) not found."]}, status: :unprocessable_entity }
      end
    else
      enqueue_common(playlist)
    end
  end

  # Queue the playlist with the given playlist UUID
  def enqueue_uuid(uuid)
    playlist = Playlist.where("uuid = ?", uuid).first

    if playlist.nil?
      playlist = Playlist.new(:name => uuid, :uuid => uuid)
      if not playlist.save
        respond_to do |format|
          format.json { render json: playlist.errors, status: :unprocessable_entity }
        end
      end
    end

    enqueue_common(playlist)
  end

  # Common queue code
  def enqueue_common(playlist)
    playlist_queue = PlaylistQueue.new(:playlist => playlist)

    respond_to do |format|
      if playlist_queue.save
        format.json { render json: playlist_queue.to_json(:include => { :playlist => { :include => :songs} } ) }
      else
        format.json { render json: playlist_queue.errors, status: :unprocessable_entity }
      end
    end
  end
end
