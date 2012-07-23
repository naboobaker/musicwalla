//
// Playlist songs functions
//

// all changes are done via model, table will automatically reflect model changes
var songModel;

function initPlaylistSongs(playlistId) {
    // render the songs once the document is loaded/ready
    $(document).ready(function(){
        playlistSongs_renderView(playlistId);
    });
}

function playlistSongs_renderView(playlistId) {
    // get the playlist and then add the playlist's songs to the songs table
    getPlaylist(playlistId, function(data){
        playlistSongs_createTable(data.songs);
    });
}

function playlistSongs_createTable(songs) {
    songModel = new MusicWallaTableModel(["Name", "URL"]);
    for (i = 0; i < songs.length; i++) {
        playlistSongs_addRow(songs[i]);
    }

    var renderers = {
        actionRenderer: playlistSongs_renderActions,
        cellRenderer: playlistSongs_renderCell
    };
    var table = new MusicWallaTable(songModel, getSongTableId(), "Song list is empty.", renderers);
    playlistSongs_refreshTableData();
}

function playlistSongs_addRow(song) {
    songModel.addRow(song.id, [song.name, song.url])
}

function playlistSongs_renderCell(columnNumber, cellData) {
    var id = "song-url";
    if (columnNumber == 0) {
        id = "song-name";
    }
    return "<input id=\"" + id + "\" style=\"width:100%\" type=\"text\" value=\"" + cellData + "\">";
}

function playlistSongs_renderActions(songId) {
    // render the actions for a song
    // TODO: Figure out how to make this link without doing it by hand
    var remove = "<a class=\"btn btn-mini btn-danger\" onClick=\"playlistSongs_deleteSong(" + songId + ")\" rel=\"nofollow\"><i class=\"icon-remove icon-white\"></i></a>\n";

    // add the hidden songId input
    var id = "<input id=\"song-id\" type=\"hidden\" value=\"" + songId + "\"/>";
    return id + remove;
}

function playlistSongs_refreshTableData() {
    // refresh row number-dependent info in table
    $("#" + getSongTableId() + " tbody tr").each(function() {
        $this = $(this)
        var rowNumber = $this[0].rowIndex;

        // these name attributes are used by the rails controller to properly save the Song info sent in the form
        $this.find("td input#song-name").attr("name", playlistSongs_getNameAttribute(rowNumber, "name"));
        $this.find("td input#song-url").attr("name", playlistSongs_getNameAttribute(rowNumber, "url"));
        $this.find("td input#song-id").attr("name", playlistSongs_getNameAttribute(rowNumber, "id"));
    });
}

function playlistSongs_getNameAttribute(rowNumber, type) {
    // this string is set as the name attribute on input elements used in forms - the rails controller uses this name to map to the model's attributes
    return "playlist[songs_attributes][" + (rowNumber - 1) + "][" + type + "]";
}

function playlistSongs_createSong(playlistId) {
    createSong(playlistId, "[NewSong]", "http://www.example.com/song.mp3", function(data){
        playlistSongs_addRow(data);
        playlistSongs_refreshTableData();
    });
}

function playlistSongs_deleteSong(songId) {
    deleteSong(songId, function(data){
        songModel.removeRow(songId);
        playlistSongs_refreshTableData();
    });
}

function getSongTableId() {
    return "playlist-songs";
}