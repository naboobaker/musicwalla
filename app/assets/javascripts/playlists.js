//
// Playlist functions
//

function initPlaylists() {
    // render the playlists once the document is loaded/ready
    $(document).ready(function() {
        playlists_renderView();
    });
}

function playlists_renderView() {
    // make the Mangage tab on the nav bar active
    $("li#manage_nav").addClass("active");

    // get all playlists and then add them to the playlists table
    getPlaylists(playlists_renderTable);
}

function playlists_renderTable(playlists) {
    // clear the table and add everything in the playlists[] array to the table
    $("#" + getPlaylistTableId() + " tbody tr").remove();

    for (i = 0; i < playlists.length; i++) {
        playlists_renderTableRow(playlists[i]);
    }

    playlists_renderTableEmptyMessage();
}

function playlists_renderTableRow(playlist) {
    // adding a row to the playlist table, so remove the "empty table" message if it exists
    $("#" + getPlaylistTableId() + " tbody tr.empty_row").remove();

    $("#" + getPlaylistTableId() + " tbody").append("<tr id=\"" + getPlaylistRowId(playlist.id) + "\"><td>" + playlist.name + "</td><td>" + playlist.songs.length + "</td><td>" + playlists_renderActions(playlist) + "</td></tr>");
}

function playlists_renderActions(playlist) {
    // render the actions for a playlist

    // TODO: Figure out how to make this link without doing it by hand
    var edit = "<a class=\"btn btn-mini btn-primary\" alt =\"Edit\" href=\"/playlists/" + playlist.id + "/edit\" rel=\"nofollow\"><i class=\"icon-edit icon-white\"></i></a>\n";
    var remove = "<a class=\"btn btn-mini btn-danger\" alt =\"Delete\" onClick=\"playlists_deletePlaylist(" + playlist.id + ")\" rel=\"nofollow\"><i class=\"icon-remove icon-white\"></i></a>\n";
    var enqueue = "<a class=\"btn btn-mini btn-success\" onClick=\"enqueuePlaylist(" + playlist.id + ")\" rel=\"nofollow\"><i alt =\"Queue\" class=\"icon-share-alt icon-white\"></i></a>\n";

    return edit + remove + enqueue;
}

function playlists_renderTableEmptyMessage() {
    var rowCount = $("#" + getPlaylistTableId() + " tbody tr").length;

    // if there is nothing in the table, give a friendly message indicating an empty table
    if (rowCount == 0) {
        $("#" + getPlaylistTableId() + " tbody").append("<tr class=\"empty_row\"><td colspan=\"3\">No playlists defined.</td></tr>");
    }
}

function playlists_createPlaylist() {
    createPlaylist("[New Playlist]", playlists_renderTableRow);
}

function playlists_deletePlaylist(playlistId) {
    deletePlaylist(playlistId, function(data) {
        // remove deleted playlist from the table
        $("#" + getPlaylistTableId() + " #" + getPlaylistRowId(playlistId)).remove();

        playlists_renderTableEmptyMessage();
    });
}

function getPlaylistTableId() {
    return "playlists";
}

function getPlaylistRowId(playlistId) {
    return "playlist-" + playlistId;
}
