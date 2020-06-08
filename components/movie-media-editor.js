import React from 'react';
import {Button, File, Field, Control, Input, Title, Progress} from 'rbx';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faUpload} from '@fortawesome/free-solid-svg-icons';
import Poster from './poster';

class MovieMediaEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showTrailerInput: false,
      trailerInput: '',
      errorMessage: ''
    };

    this.handleTrailerButton = this.handleTrailerButton.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
  }

  handleTrailerButton() {
    if (this.state.showTrailerInput) {
      const url = this.state.trailerInput.trim();

      if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
        return this.setState({errorMessage: 'Not a YouTube URL'});
      }

      if (url.match(/https?:\/\/(www\.)?[-\w@:%.+~#=]{1,256}\.[a-z\d()]{1,6}\b([-\w()@:%+.~#?&/=]*)/gi)) {
        this.props.changeTrailer(url);
        this.setState({errorMessage: '', showTrailerInput: false});
      } else {
        this.setState({errorMessage: 'Invalid URL'});
      }
    } else {
      this.setState({showTrailerInput: true});
    }
  }

  handleFileChange(e) {
    const selectedFile = e.target.files[0];

    const data = new FormData();

    data.append('file', selectedFile, selectedFile.name);

    this.props.changePoster(data);
  }

  render() {
    const isTrailerProcessing = this.props.trailer !== null && this.props.trailer.progress !== 1;

    return (
      <div>
        <Field>
          <Poster generic={this.props.poster === null} path={this.props.poster === null ? '' : this.props.poster.path}/>
        </Field>

        <Field>
          <File color="info">
            <File.Label>
              <File.Input accept="image/*" onChange={this.handleFileChange}/>
              <File.CTA>
                <File.Icon>
                  <FontAwesomeIcon icon={faUpload}/>
                </File.Icon>
                <File.Label as="span">Change poster</File.Label>
              </File.CTA>
            </File.Label>
          </File>
        </Field>

        <TrailerProgress trailer={this.props.trailer}/>

        {
          isTrailerProcessing || this.props.trailer === null ? (
            <div/>
          ) : (
            <video controls>
              <source src={`/static/bucket/${this.props.trailer.File.path}`} type="video/mp4"/>
            </video>
          )
        }

        <span>{this.state.errorMessage}</span>

        <Field kind={this.state.showTrailerInput ? 'addons' : ''}>
          {this.state.showTrailerInput ? (
            <Control>
              <Input type="url" placeholder="YouTube URL" value={this.state.trailerInput} disabled={isTrailerProcessing} onChange={e => this.setState({trailerInput: e.target.value})}/>
            </Control>
          ) : (<div/>)}
          <Control>
            <Button color="black" disabled={isTrailerProcessing} onClick={this.handleTrailerButton}>Change trailer</Button>
          </Control>
        </Field>

        <Field>
          <Control>
            <Button color="danger" disabled={isTrailerProcessing} onClick={this.props.removeTrailer}>Remove trailer</Button>
          </Control>
        </Field>
      </div>
    );
  }
}

const TrailerProgress = props => {
  if (props.trailer === null) {
    return (
      <Title size={5} className="has-text-centered">No trailer.</Title>
    );
  }

  if (props.trailer.progress !== 1) {
    return (
      <Field>
        <Title size={5}>Processing trailer...</Title>

        <Progress value={props.trailer.progress * 100} max={100} color="warning"/>
      </Field>
    );
  }

  return (<div/>);
};

export default MovieMediaEditor;
