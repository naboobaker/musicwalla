class CreatePlaylistQueues < ActiveRecord::Migration
  def change
    create_table :playlist_queues do |t|
      t.references :playlist

      t.timestamps
    end
    add_index :playlist_queues, :playlist_id
  end
end
