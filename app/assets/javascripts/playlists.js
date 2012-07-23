//
// Playlist functions
//


// all changes are done via model, table will automatically reflect model changes
var playlistModel;

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
    getPlaylists(playlists_createTable);
}

function playlists_createTable(playlists) {
    playlistModel = new MusicWallaTableModel(["Playlist Name", "Tracks"]);
    for (i = 0; i < playlists.length; i++) {
        playlists_addRow(playlists[i]);
    }

    var renderers = {actionRenderer: playlists_renderActions};
    var table = new MusicWallaTable(playlistModel, "playlists", "No playlists defined.", renderers);
}

function playlists_addRow(playlist) {
    playlistModel.addRow(playlist.id, [playlist.name, playlist.songs.length]);
}

function playlists_renderActions(id) {
    // render the actions for a playlist

    // TODO: Figure out how to make this link without doing it by hand
    var edit = "<a class=\"btn btn-mini btn-primary\" alt =\"Edit\" href=\"/playlists/" + id + "/edit\" rel=\"nofollow\"><i class=\"icon-edit icon-white\"></i></a>\n";
    var remove = "<a class=\"btn btn-mini btn-danger\" alt =\"Delete\" onClick=\"playlists_deletePlaylist(" + id + ")\" rel=\"nofollow\"><i class=\"icon-remove icon-white\"></i></a>\n";
    var enqueue = "<a class=\"btn btn-mini btn-success\" onClick=\"enqueuePlaylist(" + id + ")\" rel=\"nofollow\"><i alt =\"Queue\" class=\"icon-share-alt icon-white\"></i></a>\n";

    return edit + remove + enqueue;
}

function playlists_createPlaylist() {
    createPlaylist("[New Playlist]", playlists_addRow);
}

function playlists_deletePlaylist(playlistId) {
    deletePlaylist(playlistId, function(data) {
        playlistModel.removeRow(playlistId);
    });
}
