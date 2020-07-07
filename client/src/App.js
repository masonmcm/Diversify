import React, { Component } from 'react';
import './App.css';
import Spotify from 'spotify-web-api-js';

const spotifywebApi = new Spotify();

class App extends Component {
  constructor(){
    super();
    const params = this.getHashParams();
    this.state={
      loggedIn: params.access_token ? true : false,
      id: '',
      nowPlaying: {
        name: 'Not Checked',
        image: '',
        artistId: '',
        artistName: '',
        uri: ''
      }
    }

    if(params.access_token) {
      spotifywebApi.setAccessToken(params.access_token);
    }
  }

  getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    while ( e = r.exec(q)) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
  }

  // Promise 
  // Console log the response object from the promise! Or look in the network tab!

  getNowPlaying() {
    spotifywebApi.getMyCurrentPlaybackState()
      .then((response => {
        this.setState({
          nowPlaying: {
            name: response.item.name,
            image: response.item.album.images[0].url,
            artistId: response.item.artists[0].id,
            artistName: response.item.artists[0].name,
            uri: response.item.uri
          }
        })
      }))
  }

  async addToNewPlaylist() {
    var playlistInfo = {"name":"Best of " + this.state.nowPlaying.artistName,"description":"Generating a playlist on Spotify using the Diversify App","public":true};
    var userId = await spotifywebApi.getMe().then((response) => {return response.id});
    var playlist = await spotifywebApi.createPlaylist(userId, playlistInfo);
    var topTracks = await spotifywebApi.getArtistTopTracks(this.state.nowPlaying.artistId, "US");
    spotifywebApi.addTracksToPlaylist(playlist.id, topTracks.tracks.map((track) => {return track.uri;}));
  }


  render() {
    return (
    <div className='App'>
      <a href='http://localhost:8888'> Login to Spotify </a>
      <div>Now playing: {this.state.nowPlaying.name} </div>
      <div>
        <img src={this.state.nowPlaying.image } style={{width:100}}/>
      </div>
      <button onClick={() => this.getNowPlaying()}>
        Check Now Playing
      </button>
      <button onClick={() => this.addToNewPlaylist()}>
        Create New Playlist with Now Playing
      </button>
      </div>
    );
  }
}

export default App;
