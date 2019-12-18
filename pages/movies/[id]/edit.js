import React from 'react';
import fetch from 'isomorphic-unfetch';
import Router from 'next/router';
import Link from 'next/link';
import {Section, Container, Column, Title, Button} from 'rbx';
import MovieDetailsEditor from '../../../components/movie-details-editor';
import MovieShowtimeEditor from '../../../components/movie-showtime-editor';
import MovieMediaEditor from '../../../components/movie-media-editor';
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
    this.changePoster = this.changePoster.bind(this);
    this.changeTrailer = this.changeTrailer.bind(this);
    this.removeTrailer = this.removeTrailer.bind(this);
  }

  async updateTrailerProgress() {
    if (this.state.Trailer && this.state.Trailer.progress === 1) {
      return;
    }

    const movie = await fetchWithAuth(`/api/movies/${this.props.id}`, {});

    this.setState({
      Trailer: movie.Trailer
    });

    if (movie.Trailer === null || movie.Trailer.progress !== 1) {
      // Poll again in 2 seconds
      setTimeout(this.updateTrailerProgress, 2000);
    }
  }

  async handleDelete() {
    await fetchWithAuth(`/api/movies/${this.props.id}`, {
      method: 'DELETE'
    });

    Router.push('/movies');
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

  async changePoster(formData) {
    this.toggleSaving();

    const poster = await fetchWithAuth('/api/files/upload?type=poster', {
      method: 'POST',
      body: formData,
      rawBody: true
    });

    await this.updateField('PosterId', poster.id);

    this.setState({Poster: poster, PosterId: poster.id});

    this.toggleSaving();
  }

  async changeTrailer(url) {
    await fetchWithAuth(`/api/movies/${this.state.id}/trailer`, {
      method: 'PUT',
      body: {url}
    });

    this.setState({TrailerId: null, Trailer: null}, this.updateTrailerProgress);
  }

  async removeTrailer() {
    await this.updateField('TrailerId', null);

    this.setState({TrailerId: null, Trailer: null});
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
              <Title className="has-text-centered">
                {this.state.saving ? 'Saving...' : (
                  <span>
                Edit <Link passHref href="/movies/[id]" as={`/movies/${this.state.id}`}>Movie</Link>
                  </span>
                )}
              </Title>
            </Column>
          </Column.Group>
          <Column.Group>
            <Column size={6}>
              <Title size={4}>Details</Title>

              <MovieDetailsEditor {...this.state} updateField={this.updateField}/>

              <Title size={4}>Showtimes</Title>
              <MovieShowtimeEditor showtimes={this.state.Showtimes} updateShowtime={this.updateShowtime} addShowtime={this.addShowtime} deleteShowtime={this.deleteShowtime}/>

            </Column>
            <Column size={4} offset={2}>
              <Title size={4}>Media</Title>
              <MovieMediaEditor poster={this.state.Poster} trailer={this.state.Trailer} changePoster={this.changePoster} changeTrailer={this.changeTrailer} removeTrailer={this.removeTrailer}/>
            </Column>
          </Column.Group>

          <Column.Group>
            <Column size={6}>
              <Button color="danger" onClick={e => {
                e.preventDefault();
                this.handleDelete();
              }}
              >Delete Movie
              </Button>
            </Column>
          </Column.Group>
        </Container>
      </Section>
    );
  }
}

export default withAuthSync(EditMovie);
