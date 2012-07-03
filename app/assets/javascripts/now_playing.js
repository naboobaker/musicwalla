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

    $("#" + getPlayingTableId() + " tbody tr").remove();

    for (i = 0; i < playlistSongs.length; i++) {
        nowPlaying_renderTableRow(playlistSongs[i]);
    }

    nowPlaying_renderTableEmptyMessage();
}

function nowPlayling_resetTable() {
    $("#" + getPlayingTableId() + " tbody tr").remove();
    nowPlaying_renderTableEmptyMessage();
}

function nowPlaying_renderTableRow(playlistSong) {
    $("#" + getPlayingTableId() + " tbody tr.empty_row").remove();

    var rowCount = $("#" + getPlayingTableId() + " tbody tr").length;
    $("#" + getPlayingTableId() + " tbody").append("<tr id=\"" + getPlayingRowId(rowCount) +"\"><td class=\"row_number\">" + (rowCount + 1) + "</td><td class=\"song_name\">" + playlistSong.name + "</td></tr>");
}

function nowPlaying_renderTableEmptyMessage() {
    var rowCount = $("#" + getPlayingTableId() + " tbody tr").length;

    if (rowCount == 0) {
        $("#" + getPlayingTableId() + " tbody").append("<tr class=\"empty_row\"><td colspan=\"2\">No current playlist.</td></tr>");
    }
}

function nowPlaying_playlistStarting(playlistId) {
    getPlaylist(playlistId, nowPlaying_renderTable);
}

function nowPlaying_songStarting(playlistId, songIndex) {
    // highlight the row - set text to bold
    $("#" + getPlayingTableId() + " tbody tr td").css("font-weight", "");
    $("#" + getPlayingTableId() + " tbody tr#" + getPlayingRowId(songIndex) + " td").css("font-weight", "bold");
}

function getPlayingTableId() {
    return "now-playing";
}

function getPlayingRowId(row) {
    return "now-playing-" + row;
}