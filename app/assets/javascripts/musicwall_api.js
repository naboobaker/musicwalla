
//
// MusicWalla API - JSON API for playlists, queues, and songs
//

//
// Playlist methods
//

function getPlaylists(ajaxCallback) {
    jQuery.ajax({
        url: "/playlists/",
        type: "GET",
        dataType: "json",
        success: ajaxCallback
    });
}

function getPlaylist(playlistId, ajaxCallback) {
    jQuery.ajax({
        url: "/playlists/" + playlistId,
        type: "GET",
        dataType: "json",
        success: ajaxCallback
    });
}

function createPlaylist(playlistName, ajaxCallback) {
    jQuery.ajax({
        url: "/playlists/", 
        type: "POST",
        data: { name: playlistName },
        dataType: "json",
        success: ajaxCallback
    });
}

function deletePlaylist(playlistId, ajaxCallback) {
    jQuery.ajax({
        url: "/playlists/" + playlistId,
        type: "DELETE",
        dataType: "json",
        success: ajaxCallback
    });
}

function enqueuePlaylist(playlistId) {
    jQuery.ajax({
        url: "/enqueue",
        type: "POST",
        data: {playlist_id: playlistId},
        dataType: "json"
    });
}


//
// Playlist Queues methods
//

function getPlaylistQueues(ajaxCallback) {
    jQuery.ajax({
        url: "/playlist_queues/",
        type: "GET",
        dataType: "json",
        success: ajaxCallback
    });
}

function getPlaylistQueue(playlistQueueId, ajaxCallback) {
    jQuery.ajax({
        url: "/playlist_queues/" + playlistQueueId,
        type: "GET",
        dataType: "json",
        success: function(data){
            ajaxCallback(playlistQueueId, data.playlist);
        }        
    });
}

function deletePlaylistQueue(playlistQueueId, ajaxCallback) {
    jQuery.ajax({
        url: "/playlist_queues/" + playlistQueueId,
        type: "DELETE",
        dataType: "json",
        success: ajaxCallback
    });
}


//
// Song methods
//

function getSong(songId, ajaxCallback) {
    jQuery.ajax({
        url: "/songs/" + songId,
        type: "GET",
        dataType: "json",
        success: ajaxCallback
    });
}

function createSong(playlistId, songName, songUrl, ajaxCallback) {
    jQuery.ajax({
        url: "/songs/", 
        type: "POST",
        data: {
            name: songName,
            url: songUrl, 
            playlist_id: playlistId
        },
        dataType: "json",
        success: ajaxCallback
    });
}

function deleteSong(songId, ajaxCallback) {
    jQuery.ajax({
        url: "/songs/" + songId,
        type: "DELETE",
        dataType: "json",
        success: ajaxCallback
    });
}
