//
// Now Playing functions
//

function initNowPlaying() {
    // render now playing once the document is loaded/ready
    $(document).ready(function(){
        nowPlaying_renderView();
    });
}

function nowPlaying_renderView() {
    $("li#home_nav").addClass("active");

    nowPlaying_renderTableEmptyMessage();
}

function nowPlaying_renderTable(playlist) {
    var playlistName = playlist.name;
    var playlistSongs = playlist.songs;

    $("#now_playing tbody tr").remove();

    for (i = 0; i < playlistSongs.length; i++) {
        nowPlaying_renderTableRow(playlistSongs[i]);
    }

    nowPlaying_renderTableEmptyMessage();
}

function nowPlayling_resetTable() {
    $("#now_playing tbody tr").remove();
    nowPlaying_renderTableEmptyMessage();
}

function nowPlaying_renderTableRow(playlistSong) {
    $("#now_playing tbody tr.empty_row").remove();

    var rowCount = $("#now_playing tbody tr").length;
    $("#now_playing tbody").append("<tr id=\"" + rowCount +"\"><td class=\"row_number\">" + (rowCount + 1) + "</td><td class=\"song_name\">" + playlistSong.name + "</td></tr>");
}

function nowPlaying_renderTableEmptyMessage() {
    var rowCount = $("#now_playing tbody tr").length;

    if (rowCount == 0) {
        $("#now_playing tbody").append("<tr class=\"empty_row\"><td colspan=\"2\">No current playlist.</td></tr>");
    }
}

function nowPlaying_playlistStarting(playlistId) {
    getPlaylist(playlistId, nowPlaying_renderTable);
}

function nowPlaying_songStarting(playlistId, songIndex) {
    // highlight the row - set text to bold
    $("#now_playing tbody tr td").css("font-weight", "");
    $("#now_playing tbody tr#" + songIndex + " td").css("font-weight", "bold");
}
