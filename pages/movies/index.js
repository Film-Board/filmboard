import React from 'react';
import {Section} from 'rbx';
import {optimisticAuthFetch} from '../../components/lib/auth';
import {getNow} from '../../components/lib/dates';
import UpcomingMovies from '../../components/movies-upcoming';
import ArchivedMovies from '../../components/movies-archived';

class AllMovies extends React.Component {
  static async getInitialProps(ctx) {
    const movies = await optimisticAuthFetch('/api/movies?limit=10', {}, ctx);

    const upcoming = [];
    const archived = [];

    const now = getNow();

    movies.forEach(movie => {
      let isStillShowing = false;

      movie.Showtimes.forEach(showtime => {
        if (new Date(showtime.time).getTime() > now) {
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
