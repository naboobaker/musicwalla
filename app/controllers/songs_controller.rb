class SongsController < ApplicationController

  # GET /songs.json
  def index
    songs = Song.find(:all, :order => 'id')

    respond_to do |format|
      format.json { render json: songs.to_json }
    end
  end

  # GET /songs/1.json
  def show
    song = Song.find_by_id(params[:id])

    respond_to do |format|
      if song.nil?
        format.json { render_id_error("Song", params[:id]) }
      else
        format.json { render json: song.to_json }
      end
    end
  end

  # DELETE /songs/1.json
  def destroy
    song = Song.find_by_id(params[:id])

    respond_to do |format|
      if song.nil?
        format.json { render_id_error("Song", params[:id]) }
      elsif song.destroy
        format.json { head :no_content }
      else
        format.json { render json: song.errors, status: :unprocessable_entity }
      end
    end
  end

  # POST /songs.json
  def create

   playlist = Playlist.find_by_id(params[:playlist_id])

    if playlist.nil?
      respond_to do |format|
        format.json { render_id_error("Playlist", params[:id]) }
      end
    elsif

      song = Song.new(:name => params[:name], :url => params[:url], :playlist => playlist)

      respond_to do |format|
        if song.save
          format.json { render json: song, status: :created, location: song }
        else
          format.json { render json: song.errors, status: :unprocessable_entity }
        end
      end
    end

  end

  # PUT /songs/1.json
  def update
    song = Song.find_by_id(params[:id])

    respond_to do |format|
      if song.nil?
        format.json { render_id_error("Song", params[:id]) }
      elsif song.update_attributes(params[:song])
        format.json { head :no_content }
      else
        format.json { render json: song.errors, status: :unprocessable_entity }
      end
    end
  end

  private

  def render_id_error(type, id)
    render json: {:errors => ["#{type} (id = #{id}) not found."]}, status: :unprocessable_entity
  end
end