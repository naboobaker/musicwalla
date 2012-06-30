//
// Playlist songs functions
//

function initPlaylistSongs() {
    // render the songs once the document is loaded/ready
    $(document).ready(function(){
        playlistSongs_renderView();
    });
}

function playlistSongs_renderView() {
    // the playlist ID is in the HTML - tbody's ID attribute
    var playlistId = $("#playlist_songs tbody:first").attr("id");

    // get the playlist and then add the playlist's songs to the songs table
    getPlaylist(playlistId, function(data){
        playlistSongs_renderTable(data.id, data.songs);
    });
}

function playlistSongs_renderTable(playlistId, songs) {
    // clear the songs table and add everything in the songs[] array to the table
    $("#playlist_songs tbody tr").remove();
    for (i = 0; i < songs.length; i++) {
        playlistSongs_renderTableRow(playlistId, songs[i]);
    }

    playlistSongs_renderTableEmptyMessage();
}

function playlistSongs_renderTableRow(playlistId, song) {
    // adding a row to the songs table, so remove the "empty table" message if it exists
    $("#playlist_songs tbody tr.empty_row").remove();

    var rowCount = $("#playlist_songs tr").length;
    $("#playlist_songs tbody" ).append("<tr id=\"" + song.id + "\"><td class=\"row_number\">" + rowCount + "</td><td><input style=\"width:100%\" name=\"playlist[songs_attributes][" + (rowCount - 1) + "][name]\" type=\"text\" value=\"" + song.name + "\"></td><td><input style=\"width:100%\" name=\"playlist[songs_attributes][" + (rowCount - 1) + "][url]\" type=\"text\" value=\"" + song.url + "\"></td><td>" + playlistSongs_renderActions(playlistId, song) + "<input name=\"playlist[songs_attributes][" + (rowCount - 1) + "][id]\" type=\"hidden\" value=\"" + song.id + "\"/></td></tr>");
}

function playlistSongs_renderActions(playlistId, song) {
    // render the actions for a song

    // TODO: Figure out how to make this link without doing it by hand
    var remove = "<a class=\"btn btn-mini btn-danger\" onClick=\"playlistSongs_deleteSong(" + song.id + ")\" rel=\"nofollow\"><i class=\"icon-remove icon-white\"></i></a>\n";
    return remove;
}

function playlistSongs_renderTableEmptyMessage() {
    var rowCount = $("#playlist_songs tbody tr").length;

    // if there is nothing in the table, give a friendly message indicating an empty table
    if (rowCount == 0) {
        $("#playlist_songs tbody").append("<tr class=\"empty_row\"><td colspan=\"4\">Song list is empty.</td></tr>");
    }
}

function playlistSongs_createSong(playlistId) {
    createSong(playlistId, "[NewSong]", "http://www.example.com/song.mp3", function(data){
        // add a row to the songs table
        playlistSongs_renderTableRow(playlistId, data);
    });
}

function playlistSongs_deleteSong(songId) {
    deleteSong(songId, function(data){
        // remove deleted song from the table
        $("#playlist_songs tbody #" + songId).remove();

        // update row numbers, since a middle row could have been deleted
        $("#playlist_songs tbody tr").each(function() {
            $this = $(this)
            var row = $this[0].rowIndex;
            $this.find("td.row_number").html(row);
        });

        playlistSongs_renderTableEmptyMessage();
    });
}
