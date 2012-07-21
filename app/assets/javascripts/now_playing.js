//
// Now Playing functions
//

// all changes are done via model, table will automatically reflect model changes
var nowPlayingModel;

function initNowPlaying() {
    // render now playing once the document is loaded/ready
    $(document).ready(function(){
        nowPlaying_renderView();
    });
}

function nowPlaying_renderView() {
    $("li#home_nav").addClass("active");

    nowPlayingModel = new MusicWallaTableModel(["Track Name"]);
    var table = new MusicWallaTable(nowPlayingModel, getPlayingTableId(), function(id) { return ""}, "No current playlist.");
}

function nowPlaying_createTable(playlist) {
    // clear previous playlist from model
    while (nowPlayingModel.getRowCount() > 0) {
        var id = nowPlayingModel.getIdAt(0);
        nowPlayingModel.removeRow(id);
    }

    // add new playlist to model
    for (var i = 0; i < playlist.songs.length; i++) {
        nowPlayingModel.addRow(playlist.songs[i].id, [playlist.songs[i].name]);
    }
}

function nowPlaying_playlistStarting(playlistId) {
    getPlaylist(playlistId, nowPlaying_createTable);
}

function nowPlaying_songStarting(playlistId, songId) {
    // tood - fix:
    // occaisionally, the call to nowPlaying_createTable(...) occurs after this function is called
    // this is probably due to the aysnchoronous nature of these function calls
    // as a result, the current track does highlight properly, since the table does not yet exist

    // highlight the row - set text to bold
    $("#" + getPlayingTableId() + " tbody tr td").css("font-weight", "");
    $("#" + getPlayingTableId() + " tbody tr#" + getPlayingTableId() + "-row-" + songId + " td").css("font-weight", "bold");
}

function getPlayingTableId() {
    return "now-playing";
}