import React from 'react';
import YouTube from 'react-youtube';
import './styles/youtube-background.scss';

class YoutubeBackground extends React.Component {
  _onEnd(event) {
    event.target.playVideo();
  }

  render() {
    const videoOptions = {
      playerVars: {
        autoplay: 1,
        controls: 0,
        rel: 0,
        showinfo: 0,
        mute: 1,
        modestbranding: 1
      }
    };

    return (
      <div className="video-background">
        <div className="video-foreground">
          <YouTube
            videoId={this.props.videoId}
            opts={videoOptions}
            className="video-iframe"
            onReady={this._onReady}
            onEnd={this._onEnd}
          />
        </div>
      </div>
    );
  }
}

export default YoutubeBackground;
