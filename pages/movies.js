import React from 'react';
import fetch from 'isomorphic-unfetch';
import {Section} from 'rbx';
import {getBaseURL} from '../common/helpers';
import UpcomingMovies from '../components/movies-upcoming';
import ArchivedMovies from '../components/movies-archived';
import './styles/all-movies.scss';

class AllMovies extends React.Component {
  static async getInitialProps({req}) {
    const movies = await (await fetch(`${getBaseURL(req)}/api/movies?limit=20`)).json();

    const upcoming = [];
    const archived = [];

    const now = new Date();

    movies.forEach(movie => {
      let isStillShowing = false;

      movie.Showtimes.forEach(showtime => {
        if (new Date(showtime.time).getTime() > now.getTime()) {
          isStillShowing = true;
        }
      });

      if (isStillShowing) {
        upcoming.push(movie);
      } else {
        archived.push(movie);
      }
    });

    return {movies, upcoming, archived};
  }

  render() {
    return (
      <div>
        <Section>
          {this.props.upcoming.length > 0 ? (<UpcomingMovies movies={this.props.upcoming}/>) : ''}
        </Section>
        <Section>
          {this.props.archived.length > 0 ? (<ArchivedMovies movies={this.props.archived}/>) : ''}
        </Section>
      </div>
    );
  }
}

export default AllMovies;
