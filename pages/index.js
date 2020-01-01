import React from 'react';
import Link from 'next/link';
import fetch from 'isomorphic-unfetch';
import {Section, Title, Column, Container} from 'rbx';
import {getBaseURL} from '../common/helpers';
import MovieHero from '../components/movie-hero';
import Banner from '../components/banner';
import MoviesContainer from '../components/movies-container';
import {getNow} from '../components/lib/dates';

class Homepage extends React.Component {
  static async getInitialProps(ctx) {
    const now = getNow();
    const halfADayMs = 12 * 60 * 60 * 1000;

    const [moviesReq, bannerReq] = await Promise.all([
      fetch(`${getBaseURL(ctx)}/api/movies?limit=5`),
      fetch(`${getBaseURL(ctx)}/api/keystore?name=banner`)
    ]);

    const [movies, banner] = await Promise.all([
      moviesReq.json(),
      bannerReq.json()
    ]);

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

      if (latestShowtime.getTime() < now) {
        return;
      }

      if (earliestShowtime.getTime() - halfADayMs > now) {
        upcomingMovies.push(movie);
      } else {
        currentMovies.push(movie);
      }
    });

    upcomingMovies = upcomingMovies.sort((a, b) => new Date(a.latestShowtime).getTime() - new Date(b.latestShowtime).getTime());

    let heroMovie = {};

    if (currentMovies.length === 0 && upcomingMovies.length > 0 && upcomingMovies[0].specialEvent !== true) {
      heroMovie = upcomingMovies[0];

      upcomingMovies = upcomingMovies.filter(movie => movie.id !== upcomingMovies[0].id);
    } else if (currentMovies.length === 1) {
      heroMovie = currentMovies[0];
    } else if (currentMovies.length > 1) {
      heroMovie = currentMovies[0];
    }

    if (heroMovie.specialEvent === true) {
      heroMovie = {};
    }

    // Set banner
    let bannerContent = '';

    if (banner.value && banner.value.banner) {
      bannerContent = banner.value.banner;
    }

    return {heroMovie, currentMovies, upcomingMovies, bannerContent};
  }

  render() {
    return (
      <div>
        {
          this.props.bannerContent === '' ? (
            <div/>
          ) : (
            <Banner content={this.props.bannerContent} absolutePosition={Object.keys(this.props.heroMovie).length !== 0}/>
          )
        }
        {
          Object.keys(this.props.heroMovie).length === 0 && this.props.currentMovies.length === 0 && this.props.upcomingMovies.length === 0 ? (
            <Section>
              <Column.Group centered>
                <Column size="half" className="has-text-centered">
                  <Title size={3} className="has-text-white">We&#39;re not currently showing any movies.</Title>
                  <Title size={5} className="has-text-white">
                    <Link href="/movies">
                      <a>Here are </a>
                    </Link>

                    some past movies we&#39;ve shown.
                  </Title>
                </Column>
              </Column.Group>
            </Section>
          ) : (
            <div/>
          )
        }
        {
          Object.keys(this.props.heroMovie).length === 0 ? (
            <div/>
          ) : (
            <MovieHero {...this.props.heroMovie} banner={this.props.bannerContent}/>
          )
        }
        {
          this.props.currentMovies.length > 0 ? (
            <Section>
              <Container>
                <Title className="has-text-white">Now Showing</Title>
                <MoviesContainer movies={this.props.currentMovies} color="white"/>
              </Container>
            </Section>
          ) : (<div/>)
        }
        {
          this.props.upcomingMovies.length > 0 ? (
            <Section>
              <Container>
                <Title className="has-text-white">Upcoming Movies</Title>
                <MoviesContainer movies={this.props.upcomingMovies} color="white"/>
              </Container>
            </Section>
          ) : (<div/>)
        }
      </div>
    );
  }
}

Homepage.darkBackground = true;
Homepage.transparentNav = true;

export default Homepage;
