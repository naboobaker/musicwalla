class PlaylistsController < ApplicationController

  # GET /playlists
  # GET /playlists.json
  def index
    @playlists = Playlist.find(:all, :order => 'id')

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @playlists.to_json(:include => :songs) }
    end
  end

  # GET /playlists/1.json
  def show
    @playlist = Playlist.find_by_id(params[:id])

    respond_to do |format|
      if @playlist.nil?
        format.json { render_id_error(params[:id]) }
      else
        format.json { render json: @playlist.to_json(:include => :songs) }
      end
    end
  end

  # GET /playlists/1/edit
  def edit
    @playlist = Playlist.find_by_id(params[:id])

    if @playlist.nil?
      respond_to do |format|
        format.html { redirect_to playlists_url }
        format.json { render_id_error(params[:id]) }
      end
    end
  end

  # POST /playlists.json
  def create

    # UUID has to be unique, so find a unique UUID
    i = 0
    uuid = ""
    begin
       i += 1
      uuid = "[Undefined #{i}]"
      playlist = Playlist.where("uuid = ?", uuid).first
    end while not playlist.nil?

    playlist = Playlist.new(:name => params[:name], :uuid => uuid)

    respond_to do |format|
      if playlist.save
        format.json { render json: playlist.to_json(:include => :songs), status: :created, location: playlist }
      else
        format.json { render json: playlist.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /playlists/1
  # PUT /playlists/1.json
  def update
    @playlist = Playlist.find_by_id(params[:id])

    respond_to do |format|
      if @playlist.nil?
        format.html { redirect_to playlists_url }
        format.json { render_id_error(params[:id]) }
      elsif @playlist.update_attributes(params[:playlist])
        format.html { redirect_to playlists_url }
        format.json { head :no_content }
      else
        format.html { redirect_to playlists_url} #todo: should really show error on page
        format.json { render json: @playlist.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /playlists/1.json
  def destroy
    playlist = Playlist.find_by_id(params[:id])

    respond_to do |format|
      if playlist.nil?
        format.json { render_id_error(params[:id]) }
      elsif playlist.destroy
        format.json { head :no_content }
      else
        format.json { render json: playlist.errors, status: :unprocessable_entity }
      end
    end
  end

  private

  def render_id_error(id)
    render json: {:errors => ["Playlist (id = #{id}) not found."]}, status: :unprocessable_entity
  end
end
