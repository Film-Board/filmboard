import React from 'react';
import fetch from 'isomorphic-unfetch';
import {Section, Title} from 'rbx';
import {getBaseURL} from '../common/helpers';
import MovieHero from '../components/movie-hero';
import MoviesContainer from '../components/movies-container';
import './styles/index.scss';

class Homepage extends React.Component {
  static async getInitialProps(ctx) {
    const filterPeriod = 14 * 24 * 60 * 60; // In seconds
    const now = new Date();
    const filterCutoff = new Date(now.getTime() + filterPeriod * 1000);

    const movies = await (await fetch(`${getBaseURL(ctx)}/api/movies?limit=5`)).json();

    let upcomingMovies = [];
    const currentMovies = [];

    movies.forEach(movie => {
      if (movie.Showtimes.length === 0) {
        return false;
      }

      // Find min/max showtimes
      let earliestShowtime = new Date(10000000000000);
      let latestShowtime = new Date(0);

      movie.Showtimes.forEach(showtime => {
        const d = new Date(showtime.time);

        if (d < earliestShowtime) {
          earliestShowtime = d;
        }

        if (d > latestShowtime) {
          latestShowtime = d;
        }
      });

      if (earliestShowtime > filterCutoff) {
        return;
      }

      if (latestShowtime < now) {
        return;
      }

      if (earliestShowtime > now) {
        upcomingMovies.push(movie);
      } else {
        currentMovies.push(movie);
      }
    });

    let heroMovie = {};

    if (currentMovies.length === 0 && upcomingMovies.length > 0) {
      heroMovie = upcomingMovies[0];

      upcomingMovies = upcomingMovies.filter(movie => movie.id !== upcomingMovies[0].id);
    } else if (currentMovies.length === 1) {
      heroMovie = currentMovies[0];
    } else if (currentMovies.length > 1) {
      heroMovie = currentMovies[0];
    }

    return {heroMovie, currentMovies, upcomingMovies};
  }

  render() {
    return (
      <div>
        <Section>
          <MovieHero {...this.props.heroMovie}/>
        </Section>
        {
          this.props.currentMovies.length > 0 ? (
            <Section>
              <Title>Now Showing</Title>
              <MoviesContainer movies={this.props.currentMovies}/>
            </Section>
          ) : (<div/>)
        }
        {
          this.props.upcomingMovies.length > 0 ? (
            <Section>
              <Title>Upcoming Movies</Title>
              <MoviesContainer movies={this.props.upcomingMovies}/>
            </Section>
          ) : (<div/>)
        }
      </div>
    );
  }
}

export default Homepage;
