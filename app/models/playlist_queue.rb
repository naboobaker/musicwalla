require 'net/http'

=begin
A PlaylistQueue represents a single Playlist that has been queued for playing.
Since the PlaylistQueue only makes sense if the Playlist exists, a PlaylistQueue is part of a Playlist.
=end
class PlaylistQueue < ActiveRecord::Base
  after_create :create_notify
  after_destroy :destroy_notify

  belongs_to :playlist
  attr_accessible :playlist

  private
    def create_notify
      broadcast("/playlist_queues/create", {:playlist_queue_id => id})
    end

  private
    def destroy_notify
      broadcast("/playlist_queues/destroy", {:playlist_queue_id => id})
    end

  def broadcast(channel, data)
    message = {:channel => channel, :data => data}
    uri = URI.parse("http://musicwalla.herokuapp.com/faye")
    Thread.new do
      Net::HTTP.post_form(uri, :message => message.to_json)
    end
  end
end
