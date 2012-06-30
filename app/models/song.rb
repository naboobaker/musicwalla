=begin
Songs are made up of a Name and URL.
A Song is always part of a Playlist, so if a Playlist is deleted, the Song will be deleted too.
=end
class Song < ActiveRecord::Base
  belongs_to :playlist
  attr_accessible :url, :name, :playlist
end
