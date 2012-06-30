class CreatePlaylists < ActiveRecord::Migration
  def change
    create_table :playlists do |t|
      t.string :uuid

      t.timestamps
    end
  end
end
