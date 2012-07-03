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
    var tbodyId = $("#" + getSongTableId() + " tbody:first").attr("id");
    var playlistId = tbodyId.substring(getPlaylistPrefix().length, tbodyId.length);

    // get the playlist and then add the playlist's songs to the songs table
    getPlaylist(playlistId, function(data){
        playlistSongs_renderTable(data.id, data.songs);
    });
}

function playlistSongs_renderTable(playlistId, songs) {
    // clear the songs table and add everything in the songs[] array to the table
    $("#" + getSongTableId() + " tbody tr").remove();
    for (i = 0; i < songs.length; i++) {
        playlistSongs_renderTableRow(playlistId, songs[i]);
    }

    playlistSongs_renderTableEmptyMessage();
}

function playlistSongs_renderTableRow(playlistId, song) {
    // adding a row to the songs table, so remove the "empty table" message if it exists
    $("#" + getSongTableId() + " tbody tr.empty_row").remove();

    var rowCount = $("#" + getSongTableId() + " tr").length;
    $("#" + getSongTableId() + " tbody" ).append("<tr id=\"" + getSongRowId(song.id) + "\"><td class=\"row_number\">" + rowCount + "</td><td><input style=\"width:100%\" name=\"playlist[songs_attributes][" + (rowCount - 1) + "][name]\" type=\"text\" value=\"" + song.name + "\"></td><td><input style=\"width:100%\" name=\"playlist[songs_attributes][" + (rowCount - 1) + "][url]\" type=\"text\" value=\"" + song.url + "\"></td><td>" + playlistSongs_renderActions(playlistId, song) + "<input name=\"playlist[songs_attributes][" + (rowCount - 1) + "][id]\" type=\"hidden\" value=\"" + song.id + "\"/></td></tr>");
}

function playlistSongs_renderActions(playlistId, song) {
    // render the actions for a song

    // TODO: Figure out how to make this link without doing it by hand
    var remove = "<a class=\"btn btn-mini btn-danger\" onClick=\"playlistSongs_deleteSong(" + song.id + ")\" rel=\"nofollow\"><i class=\"icon-remove icon-white\"></i></a>\n";
    return remove;
}

function playlistSongs_renderTableEmptyMessage() {
    var rowCount = $("#" + getSongTableId() + " tbody tr").length;

    // if there is nothing in the table, give a friendly message indicating an empty table
    if (rowCount == 0) {
        $("#" + getSongTableId() + " tbody").append("<tr class=\"empty_row\"><td colspan=\"4\">Song list is empty.</td></tr>");
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
        $("#" + getSongTableId() + " tbody #" + getSongRowId(songId)).remove();

        // update row numbers, since a middle row could have been deleted
        $("#" + getSongTableId() + " tbody tr").each(function() {
            $this = $(this)
            var row = $this[0].rowIndex;
            $this.find("td.row_number").html(row);
        });

        playlistSongs_renderTableEmptyMessage();
    });
}

function getPlaylistPrefix() {
    return "playlist-";
}

function getSongTableId() {
    return "playlist-songs";
}

function getSongRowId(songId) {
    return "playlist-song-" + songId;
}