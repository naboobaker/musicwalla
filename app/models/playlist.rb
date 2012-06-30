=begin
A Playlist has a Name, a unique UUID (from a NFC tag), and a list of songs.
Songs and PlaylistQueues depend on Playlists.
=end
class Playlist < ActiveRecord::Base
  attr_accessible :uuid, :name, :songs_attributes

  validates :name, :presence => true
  validates :uuid, :presence => true, :uniqueness => true

  has_many :songs, :dependent => :destroy, :order => "songs.id"
  has_many :playlist_queues, :dependent => :destroy

  accepts_nested_attributes_for :songs, :allow_destroy => :true,
    :reject_if => proc { |attrs| attrs.all? { |k, v| v.blank? } }

  accepts_nested_attributes_for :playlist_queues, :allow_destroy => :true,
    :reject_if => proc { |attrs| attrs.all? { |k, v| v.blank? } }
end
