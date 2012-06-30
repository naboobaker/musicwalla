//
// Audio player functions
//

function initAudio() {
    var faye = new Faye.Client("/faye");
    faye.disable("websocket");

    faye.subscribe("/playlist_queues/create", function(data) {
        startPlaying();
    });


    // start playing and render the audio player once the document is loaded/ready
    $(document).ready(function(){
        audioPlayer_renderView();
        startPlaying();
    });
}

function isPlayerActive() {
    return (getAudioPlayer() != null);
}

function getAudioPlayer() {
    return document.getElementById('audio');
}

function audioPlayer_renderView() {
    audioPlayer_resetView();
}

function audioPlayer_resetView() {
    setSongProgress(0);
    setSongTime("--", "--", "--", "--");
    setSongInfo("No Playlist", 0, "No Song");
    setSongMessage("");

    $("#player_controls .icon-play").addClass("icon-pause").removeClass("icon-play");
}


//
// Audio player functions
//

// the flow is a little unclear, since it uses AJAX callbacks to go to the next state:
// 1. check if currently playing a playlist - if not, initiate playing next playlist
// 2. check if there is a playlist on the queue - do this by doing an AJAX GET of all playlist_queues
// 3. if there is at least one playlist queue, start playing the playlist
// 4. AJAX delete the first playlist_queue (same as de-queue playlist)
// 5. with the playlist ID, AJAX GET the playlist
// 6. start playing the playlist, play the first song
// 7. play each song
// 8. initiate playing the next playlist (step 2)

function startPlaying() {
    // if something is already playing, just return, no need to start playing
    // (actually, starting to play when already playing will mess up the queue/player)
    // var now_playing = $("#audio_player audio:first");
    if (isPlayerActive()) {
        return;
    }

    playNextPlaylist();
}

function playNextPlaylist() {
    // play first item on playlist_queue
    getPlaylistQueues(function(data) {
        if (data.length > 0) {
            playPlaylist(data[0].id, data[0].playlist);
        }
    });
}

function playPlaylist(playlistQueueId, playlist) {
    var playlistName = playlist.name;
    var playlistSongs = playlist.songs;

    notifyPlaylistStarting(playlist.id);

    // remove from the queue, then start playing the playlist that was just removed
    deletePlaylistQueue(playlistQueueId, function(data){
        // each song is played one by one, so start with the first song
        playPlaylistSong(playlist, 0);
    });
}

function playPlaylistSong(playlist, songIndex) {
    var playlistId = playlist.id;
    var playlistName = playlist.name;
    var playlistSongs = playlist.songs;

    if (songIndex >= playlistSongs.length) {
        // reached the end of the playlist, so start playing the next playlist
        playNextPlaylist();
    }
    else {
        // do (complicated) setup to play the current song:
        // 1. Init the UI with song loading info
        // 2. Set a timeout, in case song doesn't load
        // 3. Create callback functions
        // 4. Load <audio> tag in HTML
        // 5. Add listeners
        // 6. Play song

        // init UI
        audioPlayer_resetView();
        setSongInfo(playlistName, songIndex + 1, playlistSongs[songIndex].name);
        setSongMessage("Loading...");


        // set a timeout, in case audio player can't load audio file
        timeout = setTimeout(function() {
            audioTimeout(playlist, songIndex);
        }, 5000);


        // define functions used as callbacks/eventlisteners
        // they need values from local variables, so the functions are defined inline here
        audioLoadedmetadata = function() {
            clearTimeout(timeout);
        };

        audioEnded = function() {
            // cleanup and play next song
            audioFinished();
            playPlaylistSong(playlist, songIndex + 1)
        };

        audioPlaying = function() {
            setSongMessage("Playing.");
        };

        playNextSong = function() {
            clearTimeout(timeout);

            playPlaylistSong(playlist, songIndex + 1)
        };


        // load up the HTML5 audio tag with the song to play
        $("#audio_player").append("<audio id='audio'><source src='" + playlistSongs[songIndex].url + "' type='audio/mpeg' /></audio>");
        var audioPlayer = getAudioPlayer();

        // notify that song is starting to play
        notifySongStarting(playlistId, songIndex);

        // add listeners
        audioPlayer.addEventListener("playing", audioPlaying, false);
        audioPlayer.addEventListener("loadedmetadata", audioLoadedmetadata, false);
        audioPlayer.addEventListener("timeupdate", audioTimeupdate, false);
        audioPlayer.addEventListener("ended", audioEnded, false);


        // and finally, what we're here to do - play
        audioPlayer.play();
    }
}

function audioTimeout(playlist, songIndex) {
    // check if the audio player has timed out loading the song
    var audioPlayer = getAudioPlayer();
    if (audioPlayer.networkState == audioPlayer.NETWORK_NO_SOURCE) {
        setSongMessage("Load error.");
    }
    else {
        setSongMessage("Load timeout.");
    }

    audioCleanup();

    // play the next song after 1 second
    setTimeout(function() {
        playPlaylistSong(playlist, songIndex + 1)
    }, 1000);
}

function audioTimeupdate() {
    var audioPlayer = getAudioPlayer();

    // set current time and current progress of song
    var currentMinutes = Math.floor(audioPlayer.currentTime / 60);
    var currentSeconds = Math.round(audioPlayer.currentTime % 60);
    var durationMinutes = Math.floor(audioPlayer.duration / 60);
    var durationSeconds = Math.round(audioPlayer.duration % 60);
    var progress = audioPlayer.currentTime * 100 /audioPlayer.duration;

    setSongProgress(progress);
    setSongTime(currentMinutes, currentSeconds, durationMinutes, durationSeconds);
}

function audioFinished() {
    setSongMessage("Finished.");

    // if the song is loaded, then set the time display and progress bar to 100%
    var audioPlayer = getAudioPlayer();
    if (audioPlayer.readyState != audioPlayer.HAVE_NOTHING) {
        var durationMinutes = Math.floor(audioPlayer.duration / 60);
        var durationSeconds = Math.round(audioPlayer.duration % 60);

        setSongProgress(100);
        setSongTime(durationMinutes, durationSeconds, durationMinutes, durationSeconds);
    }

    audioCleanup();
}

function audioCleanup() {
    // remove callbacks
    var audioPlayer = getAudioPlayer();

    audioPlayer.removeEventListener("playing", audioPlaying, false);
    audioPlayer.removeEventListener("loadedmetadata", audioLoadedmetadata, false);
    audioPlayer.removeEventListener("timeupdate", audioTimeupdate, false);
    audioPlayer.removeEventListener("ended", audioEnded, false);

    $("#audio_player > #audio").remove();
}

//
// Notify methods - these really should be fired events, not direct methods calls to the now_playing__xyz methods
//

function notifyPlaylistStarting(playlistId) {
    nowPlaying_playlistStarting(playlistId);
}

function notifySongStarting(playlistId, songIndex) {
    nowPlaying_songStarting(playlistId, songIndex);
}

//
// Info display methods
//

function setSongProgress(progress) {
    $("#progress_bar").width(progress + "%");
}

function setSongInfo(playlistName, trackNumber, songName) {
    $("#song_info").empty();
    $("#song_info").append("<h2>" + playlistName + " - " + pad(trackNumber) + " - " + songName + "</h2>");
}

function setSongMessage(message) {
    $("#song_message").empty();
    $("#song_message").append("<h3>" + message + "</h3>");
}

function setSongTime(currentMinutes, currentSeconds, durationMinutes, durationSeconds) {
    $("#song_time").empty();
    $("#song_time").append("<h1>" + pad(currentMinutes) + ":" + pad(currentSeconds) + " / " + pad(durationMinutes) + ":" + pad(durationSeconds) + "</h1>");
}

function pad(number) {
    if (number < 10) {
        return "0" + number;
    }
    return number;
}

//
// Player control methods
//

function audioPlayer_playPause() {
    if (!isPlayerActive()) {
        return;
    }

    if (getAudioPlayer().paused) {
        audioPlay();
        setSongMessage("Playing.");
    } else {
        audioPause()
        setSongMessage("Paused.");
    }
}

function audioPlayer_nextSong() {
    if (!isPlayerActive()) {
        return;
    }

    audioPause();
    audioFinished();
    playNextSong();
}

function audioPlayer_nextPlaylist() {
    if (!isPlayerActive()) {
        return;
    }

    clearTimeout(timeout);

    audioPause();
    audioFinished();
    playNextPlaylist();
}

function audioPlay() {
    if (!isPlayerActive()) {
        return;
    }

    $("#player_controls .icon-play").addClass("icon-pause").removeClass("icon-play");

    getAudioPlayer().play();
}

function audioPause() {
    if (!isPlayerActive()) {
        return;
    }

    $("#player_controls .icon-pause").addClass("icon-play").removeClass("icon-pause");
    getAudioPlayer().pause();
}
