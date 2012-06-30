//
// Playlist Queues functions
//

function initPlaylistQueues() {
    var faye = new Faye.Client("/faye");
    faye.disable("websocket");

    faye.subscribe("/playlist_queues/create", function(data) {
        playlistQueues_playlistQueuesCreate(data.playlist_queue_id);
    });

    faye.subscribe("/playlist_queues/destroy", function(data) {
        playlistQueues_playlistQueuesDestroy(data.playlist_queue_id);
    });


    // render the playlist_queues once the document is loaded/ready
    $(document).ready(function(){
        playlistQueues_renderView();
    });
}

function playlistQueues_renderView() {
    // get all playlist_queues and then add them to the playlist_queues table
    getPlaylistQueues(playlistQueues_renderTable);
}

function playlistQueues_renderTable(playlistQueues) {
    // clear the table and add everything in the playlist_queues[] array to the table
    $("#playlist_queues tbody tr").remove();
    for (i = 0; i < playlistQueues.length; i++) {
        playlistQueues_renderTableRow(playlistQueues[i].id, playlistQueues[i].playlist);
    }

    playlistQueues_renderTableEmptyMessage();
}

function playlistQueues_renderTableRow(playlistQueueId, playlist) {
    // adding a row to the playlist_queues table, so remove the "empty table" message if it exists
    $("#playlist_queues tbody tr.empty_row").remove();

    var rowCount = $("#playlist_queues tbody tr").length;
    $("#playlist_queues tbody").append("<tr id=\"" + playlistQueueId +"\"><td class=\"row_number\">" + (rowCount + 1) + "</td><td class=\"playlist_name\">" + playlist.name + "</td><td class=\"playlist_length\">" + playlist.songs.length + "</td><td>" + playlistQueues_renderActions(playlistQueueId) + "</td></tr>");
}

function playlistQueues_renderActions(playlistQueueId) {
    // render the actions for a playlist_queue

    // TODO: Figure out how to make this link without doing it by hand
    var remove = "<a class=\"btn btn-mini btn-danger\" onClick=\"playlistQueues_deletePlaylistQueue(" + playlistQueueId + ")\" rel=\"nofollow\"><i class=\"icon-remove icon-white\"></i></a>";
    return remove;
}
function playlistQueues_renderTableEmptyMessage() {
    var rowCount = $("#playlist_queues tbody tr").length;

    // if there is nothing in the table, give a friendly message indicating an empty table
    if (rowCount == 0) {
        $("#playlist_queues tbody").append("<tr class=\"empty_row\"><td colspan=\"4\">Queue is empty.</td></tr>");
    }
}

function playlistQueues_deletePlaylistQueue(playlistQueueId) {
    // delete the playlist queue
    deletePlaylistQueue(playlistQueueId, function(data) {
        playlistQueues_playlistQueuesDestroy(playlistQueueId);
    });
}

function playlistQueues_playlistQueuesCreate(playlistQueueId) {
    // get the newly created playlist_queue's info and add a row to the playlist_queue table
    getPlaylistQueue(playlistQueueId, playlistQueues_renderTableRow);
}

function playlistQueues_playlistQueuesDestroy(playlistQueueId) {
    // since there are multiple ways to get to this method, need to make sure
    // the Playlist Queue is still in the table - it could have already been removed
    var playlistQueue = $("#playlist_queues tbody #" + playlistQueueId);
    if (playlistQueue.length > 0) {
        // remove deleted playlist_queue
        playlistQueue.remove();

        // update row numbers, since a middle row could have been deleted
        $("#playlist_queues tbody tr").each(function() {
            $this = $(this)
            var row = $this[0].rowIndex;
            $this.find("td.row_number").html(row);
        });

        playlistQueues_renderTableEmptyMessage();
    }
}
