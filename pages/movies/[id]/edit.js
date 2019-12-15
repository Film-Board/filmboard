import React from 'react';
import fetch from 'isomorphic-unfetch';
import Router from 'next/router';
import {Section, Container, Column, Title, Button, Block, Progress} from 'rbx';
import Poster from '../../../components/poster';
import MovieDetailsEditor from '../../../components/movie-details-editor';
import MovieShowtimeEditor from '../../../components/movie-showtime-editor';
import {getBaseURL} from '../../../common/helpers';
import {withAuthSync, fetchWithAuth} from '../../../components/lib/auth';

class EditMovie extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ...props,
      showtimes: []
    };

    this.updateTrailerProgress = this.updateTrailerProgress.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.addShowtime = this.addShowtime.bind(this);
    this.updateField = this.updateField.bind(this);
    this.updateShowtime = this.updateShowtime.bind(this);
    this.deleteShowtime = this.deleteShowtime.bind(this);
  }

  async updateTrailerProgress() {
    if (this.state.Trailer === null || this.state.Trailer.progress === 1) {
      return;
    }

    const movie = await fetchWithAuth(`/api/movies/${this.props.id}`, {});

    this.setState({
      Trailer: movie.Trailer
    });

    if (movie.Trailer.progress !== 1) {
      // Poll again in 2 seconds
      setTimeout(this.updateTrailerProgress, 2000);
    }
  }

  async handleDelete() {
    await fetchWithAuth(`/api/movies/${this.props.id}`, {
      method: 'DELETE'
    });

    Router.push('/');
  }

  static async getInitialProps(ctx) {
    const movie = await (await fetch(`${getBaseURL(ctx)}/api/movies/${ctx.query.id}`)).json();

    movie.showtimes = movie.Showtimes.map(showtime => showtime.time);

    return movie;
  }

  async componentDidMount() {
    // Start polling to see if trailer was downloaded
    await this.updateTrailerProgress();
  }

  async updateField(name, value) {
    this.toggleSaving();

    await fetchWithAuth(`/api/movies/${this.props.id}`, {
      method: 'PUT',
      body: {
        [name]: value
      }
    });

    this.setState({
      [name]: value
    });

    this.toggleSaving();
  }

  async updateShowtime(showtimes) {
    this.toggleSaving();

    const promises = showtimes.map(showtime => fetchWithAuth(`/api/showtimes/${showtime.id}`, {
      method: 'PUT',
      body: {
        time: showtime.time,
        MovieId: this.props.id
      }
    }));

    await Promise.all(promises);

    // Update local state
    this.setState(({Showtimes}) => ({
      Showtimes: Showtimes.map(showtime => {
        if (showtimes.map(t => t.id).includes(showtime.id)) {
          return showtimes.find(t => t.id === showtime.id);
        }

        return showtime;
      })
    }));

    this.toggleSaving();
  }

  async addShowtime(time) {
    this.toggleSaving();

    const showtime = await fetchWithAuth('/api/showtimes', {
      method: 'POST',
      body: {
        time,
        MovieId: this.state.id
      }
    });

    // Update local state
    this.setState(({Showtimes}) => ({
      Showtimes: [...Showtimes, showtime]
    }));

    this.toggleSaving();
  }

  async deleteShowtime(ids) {
    this.toggleSaving();

    await Promise.all(ids.map(id => fetchWithAuth(`/api/showtimes/${id}`, {
      method: 'DELETE'
    })));

    this.setState(({Showtimes}) => ({
      Showtimes: Showtimes.filter(showtime => !ids.includes(showtime.id))
    }));

    this.toggleSaving();
  }

  toggleSaving() {
    this.setState(({saving}) => ({saving: !saving}));
  }

  render() {
    return (
      <Section>
        <Container>
          <Column.Group centered>
            <Column>
              <Title className="has-text-centered">{this.state.saving ? 'Saving...' : 'Edit Movie'}</Title>
            </Column>
          </Column.Group>
          <Column.Group centered>
            <Column size={4}>
              <Title size={4}>Details</Title>

              <Block>
                <MovieDetailsEditor {...this.state} updateField={this.updateField}/>
              </Block>

              <Block>
                <MovieShowtimeEditor showtimes={this.state.Showtimes} updateShowtime={this.updateShowtime} addShowtime={this.addShowtime} deleteShowtime={this.deleteShowtime}/>
              </Block>

              <Block>
                <Button color="danger" onClick={e => {
                  e.preventDefault();
                  this.handleDelete();
                }}
                >Delete Movie
                </Button>
              </Block>
            </Column>
            <Column size={4}>
              <Block>
                <Poster generic={this.props.Poster === null} path={this.props.Poster === null ? '' : this.props.Poster.path}/>
              </Block>

              <TrailerProgress trailer={this.state.Trailer}/>
            </Column>
          </Column.Group>
        </Container>
      </Section>
    );
  }
}

const TrailerProgress = props => {
  if (props.trailer === null) {
    return (
      <Block>
        <Title size={5} className="has-text-centered">No trailer.</Title>
      </Block>
    );
  }

  if (props.trailer && props.trailer.progress === 1) {
    return (
      <Block>
        <Title size={5} className="has-text-centered">Trailer processed.</Title>
      </Block>
    );
  }

  return (
    <Block>
      <Title size={5} className="has-text-centered">Processing trailer...</Title>
      <Progress value={props.trailer.progress * 100} max={100} color="warning"/>
    </Block>
  );
};

export default withAuthSync(EditMovie);
