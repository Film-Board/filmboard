import React from 'react';
import './styles/video-background.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';

class VideoBackground extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hover: '',
      fullscreen: ''
    }

    this.showButton = this.showButton.bind(this);
    this.hideButton = this.hideButton.bind(this);
    this.fullscreen = this.fullscreen.bind(this);
    this.onFullScreenChange = this.onFullScreenChange.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this)
  }

  componentDidMount() {
    document.addEventListener("fullscreenchange", this.onFullScreenChange, false);
    document.addEventListener("webkitfullscreenchange", this.onFullScreenChange, false);
    document.addEventListener("mozfullscreenchange", this.onFullScreenChange, false);
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
    })

    delete this.hideButtonTimeout;
  }

  fullscreen() {
    const video = document.getElementById("video-background");
    if (video.requestFullscreen) {
      video.requestFullscreen();
    } else if (video.mozRequestFullScreen) {
      video.mozRequestFullScreen();
    } else if (video.webkitRequestFullscreen) {
      video.webkitRequestFullscreen();
    } else if (video.msRequestFullscreen) {
      video.msRequestFullscreen();
    }

    video.muted = false;
    video.currentTime = 0;
    video.controls = true
  }

  onFullScreenChange() {
    const fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;

    const isFull = fullscreenElement !== undefined;

    this.setState({
      fullscreen: (isFull ? 'fullscreen' : '')
    });

    if (!isFull) {
      const video = document.getElementById("video-background");

      video.muted = true;
      video.controls = false;
    }
  }

  render () {
    return (
      <div className={`video-background ${this.state.hover} ${this.state.fullscreen}`} onMouseEnter={this.showButton} onClick={this.fullscreen}>
        <FontAwesomeIcon icon={faPlay} className='play-button'/>
        <video id="video-background" autoPlay muted loop>
          <source src={this.props.path} type="video/mp4"/>
           Your browser does not support the video tag.
        </video>
      </div>
    );
  }
}

export default VideoBackground;
