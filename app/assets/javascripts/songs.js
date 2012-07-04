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
    var playlistId = tbodyId.substring(getPlaylistPrefix().length - 1, tbodyId.length);

    // get the playlist and then add the playlist's songs to the songs table
    getPlaylist(playlistId, function(data){
        playlistSongs_renderTable(data.songs);
    });
}

function playlistSongs_renderTable(songs) {
    // clear the songs table and add everything in the songs[] array to the table
    $("#" + getSongTableId() + " tbody tr").remove();
    for (i = 0; i < songs.length; i++) {
        playlistSongs_renderTableRow(songs[i]);
    }

    playlistSongs_refreshTableData();
    playlistSongs_renderTableEmptyMessage();
}

function playlistSongs_renderTableRow(song) {
    // adding a row to the songs table, so remove the "empty table" message if it exists
    $("#" + getSongTableId() + " tbody tr.empty_row").remove();

    var rowCount = $("#" + getSongTableId() + " tr").length;
    $("#" + getSongTableId() + " tbody" ).append("<tr id=\"" + getSongRowId(song.id) + "\">" + playlistSongs_renderRowNumber() + playlistSongs_renderName(song.name)+ playlistSongs_renderUrl(song.url) + playlistSongs_renderId(song.id) + "</tr>");
}

function playlistSongs_renderRowNumber() {
    return "<td id=\"song-number\"></td>";
}

function playlistSongs_renderName(songName) {
    return "<td id=\"song-name\"><input style=\"width:100%\" type=\"text\" value=\"" + songName + "\"></td>";
}

function playlistSongs_renderUrl(songUrl) {
    return "<td id=\"song-url\"><input style=\"width:100%\" type=\"text\" value=\"" + songUrl + "\"></td>";
}

function playlistSongs_renderId(songId) {
    var id = "<input type=\"hidden\" value=\"" + songId + "\"/>";

    // render the actions for a song
    // TODO: Figure out how to make this link without doing it by hand
    var remove = "<a class=\"btn btn-mini btn-danger\" onClick=\"playlistSongs_deleteSong(" + songId + ")\" rel=\"nofollow\"><i class=\"icon-remove icon-white\"></i></a>\n";

    return "<td id=\"song-id\">" + id + remove + "</td>";
}

function playlistSongs_renderTableEmptyMessage() {
    var rowCount = $("#" + getSongTableId() + " tbody tr").length;

    // if there is nothing in the table, give a friendly message indicating an empty table
    if (rowCount == 0) {
        $("#" + getSongTableId() + " tbody").append("<tr class=\"empty_row\"><td colspan=\"4\">Song list is empty.</td></tr>");
    }
}

function playlistSongs_refreshTableData() {
    // refresh row number-dependent info in table
    $("#" + getSongTableId() + " tbody tr").each(function() {
        $this = $(this)
        var rowNumber = $this[0].rowIndex;
        $this.find("td#song-number").html(rowNumber);

        // these name attributes are used by the rails controller to properly save the Song info sent in the form
        $this.find("td#song-name input").attr("name", playlistSongs_getNameAttribute(rowNumber, "name"));
        $this.find("td#song-url input").attr("name", playlistSongs_getNameAttribute(rowNumber, "url"));
        $this.find("td#song-id input").attr("name", playlistSongs_getNameAttribute(rowNumber, "id"));
    });
}

function playlistSongs_getNameAttribute(rowNumber, type) {
    // this string is set as the name attribute on input elements used in forms - the rails controller uses this name to map to the model's attributes
    return "playlist[songs_attributes][" + (rowNumber - 1) + "][" + type + "]";
}

function playlistSongs_createSong(playlistId) {
    createSong(playlistId, "[NewSong]", "http://www.example.com/song.mp3", function(data){
        // add a row to the songs table
        playlistSongs_renderTableRow(data);
        playlistSongs_refreshTableData();
    });
}

function playlistSongs_deleteSong(songId) {
    deleteSong(songId, function(data){
        // remove deleted song from the table
        $("#" + getSongTableId() + " tbody #" + getSongRowId(songId)).remove();

        playlistSongs_refreshTableData();
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