import React from 'react';
import './styles/video-background.scss';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPlay} from '@fortawesome/free-solid-svg-icons';
import {isMobileDevice} from './lib/device-os';

class VideoBackground extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hover: '',
      fullscreen: ''
    };

    this.showButton = this.showButton.bind(this);
    this.hideButton = this.hideButton.bind(this);
    this.fullscreen = this.fullscreen.bind(this);
    this.onFullScreenChange = this.onFullScreenChange.bind(this);
  }

  componentDidMount() {
    document.addEventListener('fullscreenchange', this.onFullScreenChange, false);
    document.addEventListener('webkitfullscreenchange', this.onFullScreenChange, false);
    document.addEventListener('mozfullscreenchange', this.onFullScreenChange, false);

    const video = document.querySelector('#video-background');

    video.addEventListener('webkitendfullscreen', this.onFullScreenChange, false);
  }

  componentWillUnmount() {
    document.removeEventListener('fullscreenchange', this.onFullScreenChange, false);
    document.removeEventListener('webkitfullscreenchange', this.onFullScreenChange, false);
    document.removeEventListener('mozfullscreenchange', this.onFullScreenChange, false);

    const video = document.querySelector('#video-background');

    video.removeEventListener('webkitendfullscreen', this.onFullScreenChange, false);
  }

  showButton() {
    this.setState({
      hover: 'hover'
    });

    if (!this.hideButtonTimeout) {
      this.hideButtonTimeout = setTimeout(this.hideButton, 2000);
    }
  }

  hideButton() {
    this.setState({
      hover: ''
    });

    delete this.hideButtonTimeout;
  }

  async fullscreen() {
    if (this.state.fullscreen) {
      return;
    }

    const video = document.querySelector('#video-background');

    video.muted = false;
    video.currentTime = 0;
    video.controls = true;

    if (video.requestFullscreen) {
      await video.requestFullscreen();
      await video.play();
      return;
    }

    if (video.mozRequestFullScreen) {
      await video.mozRequestFullScreen();
      await video.play();
      return;
    }

    if (video.webkitRequestFullscreen) {
      await video.webkitRequestFullscreen();
      await video.play();
      return;
    }

    if (video.msRequestFullscreen) {
      await video.msRequestFullscreen();
      await video.play();
      return;
    }

    if (video.enterFullscreen) {
      await video.enterFullscreen();
      await video.play();
    } else if (video.webkitEnterFullscreen) {
      await video.webkitEnterFullscreen();
      await video.play();
    }
  }

  async onFullScreenChange() {
    const fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;
    const isFull = fullscreenElement !== null && fullscreenElement !== undefined;

    this.setState({
      fullscreen: isFull
    });

    if (!isFull) {
      const video = document.querySelector('#video-background');

      video.muted = true;
      video.controls = false;

      if (!isMobileDevice()) {
        await video.play();
      }
    }
  }

  render() {
    return (
      <div className={`video-background ${this.state.hover} ${this.state.fullscreen ? 'fullscreen' : ''}`} onMouseEnter={this.showButton}>
        <FontAwesomeIcon icon={faPlay} className="play-button" onClick={this.fullscreen}/>
        <video autoPlay muted loop id="video-background" onClick={this.fullscreen}>
          <source src={this.props.path} type="video/mp4"/>
           Your browser does not support the video tag.
        </video>
      </div>
    );
  }
}

export default VideoBackground;
