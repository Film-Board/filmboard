import React from 'react';
import fetch from 'isomorphic-unfetch';
import {getBaseURL} from '../../../common/helpers';
import MovieHero from '../../../components/movie-hero';

class ShowMovie extends React.Component {
  static async getInitialProps(ctx) {
    const movie = await fetch(`${getBaseURL(ctx)}/api/movies/${ctx.query.id}`);

    return movie.json();
  }

  render() {
    return (<MovieHero {...this.props}/>);
  }
}

export default ShowMovie;
