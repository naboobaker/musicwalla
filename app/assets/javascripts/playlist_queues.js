//
// Playlist Queues functions
//


// all changes are done via model, table will automatically reflect model changes
var playlistQueueModel;

function initPlaylistQueues() {
    var faye = new Faye.Client("/faye");
    faye.disable("websocket");

    faye.subscribe("/playlist_queues/create", function(data) {
        playlistQueues_createNotification(data.playlist_queue_id);
    });

    faye.subscribe("/playlist_queues/destroy", function(data) {
        playlistQueues_deleteNotification(data.playlist_queue_id);
    });


    // render the playlist_queues once the document is loaded/ready
    $(document).ready(function(){
        playlistQueues_renderView();
    });
}

function playlistQueues_renderView() {
    // get all playlist_queues and then add them to the playlist_queues table
    getPlaylistQueues(playlistQueues_createTable);
}

function playlistQueues_createTable(playlistQueues) {
    playlistQueueModel = new MusicWallaTableModel(["Playlist Name", "Tracks"]);
    for (i = 0; i < playlistQueues.length; i++) {
        playlistQueues_addRow(playlistQueues[i].id, playlistQueues[i].playlist);
    }

    var table = new MusicWallaTable(playlistQueueModel, "playlist-queues", playlistQueues_renderActions, "Queue is empty.");
}

function playlistQueues_addRow(playlistQueueId, playlist) {
    playlistQueueModel.addRow(playlistQueueId, [playlist.name, playlist.songs.length]);
}

function playlistQueues_renderActions(playlistQueueId) {
    // render the actions for a playlist_queue

    // TODO: Figure out how to make this link without doing it by hand
    var remove = "<a class=\"btn btn-mini btn-danger\" onClick=\"playlistQueues_deletePlaylistQueue(" + playlistQueueId + ")\" rel=\"nofollow\"><i class=\"icon-remove icon-white\"></i></a>";
    return remove;
}

function playlistQueues_deletePlaylistQueue(playlistQueueId) {
    // delete the playlist queue
    deletePlaylistQueue(playlistQueueId, function(data) {
        playlistQueues_deleteNotification(playlistQueueId);
    });
}

function playlistQueues_createNotification(playlistQueueId) {
    // get the newly created playlist_queue's info and add a row to the playlist_queue table
    getPlaylistQueue(playlistQueueId, playlistQueues_addRow);
}

function playlistQueues_deleteNotification(playlistQueueId) {
    playlistQueueModel.removeRow(playlistQueueId);
}