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
        uri: ''
      }
    }

    if(params.access_token) {
      spotifywebApi.setAccessToken(params.access_token);
    }
  }
  
   establishUser() {
    const userId = spotifywebApi.getMe().then((response) => {return response.id});
    return userId;
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
            uri: response.item.uri
          }
        })
      }))
  }

  async addToNewPlaylist() {
    var playlistInfo = {"name":this.state.nowPlaying.name,"description":"Generating a playlist on Spotify using the Diversify App","public":true};
    const userId = await this.establishUser();
    spotifywebApi.createPlaylist(userId, playlistInfo)
      .then((response => {
        console.log(response);
        console.log(response.id);
        console.log(this.state.nowPlaying.uri);
        spotifywebApi.addTracksToPlaylist(response.id, [this.state.nowPlaying.uri]);
      }));
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
