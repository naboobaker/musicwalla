MusicWalla
==========

MusicWalla is a demo of NFC tag technology, HTML5 audio, and asynchronous
events. It's my first forrway into web technologies.

When an NFC tag is tapped on a pre-configured reader, the reader will do an 
HTTP POST request to /enqueue and send the UUID of the NFC tag as a parameter
named "uuid."

The MusicWalla will then take the UUID and find its associated pre-configured
Playlist.  If there is no Playlist already defined, a Playlist with that UUID
will be created.  Then the Playlist with the UUID (either previously created,
or newly created) will be added to a Playlist Queue.

The MusicWalla's main page contains an HTML5 audio player that grabs the first
Playlists off of the Playlist Queue and plays each song in the Playlist. After
a Playlist is completed, it will grab the next Playlist off of the Playlist
Queue and repeat the process.

Asynchronous events are used when a Playlist is added to the Playlist Queue.
If there are no Playlists currently playing or in the Playlist Queue, the
Playlist added event causes the audio player to immediately start playing
from the Playlist Queue.

Playlists can be created, deleted, enqueued, or deleted on the Manage page.
Playlists on the Playlist Queue can also be deleted on the Manage page.


Examples:
- MusicWalla running on Heroku - http://musicwalla.herokuapp.com


Pre-requisites:
- Faye


Resources:
- Railscast on Faye - http://railscasts.com/episodes/260-messaging-with-faye
- How to use Faye as a middleware rack - https://groups.google.com/forum/#!topic/faye-users/rekbc35JW98