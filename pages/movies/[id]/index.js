import React from 'react';
import {NextSeo} from 'next-seo';
import fetch from 'isomorphic-unfetch';
import {getBaseURL} from '../../../common/helpers';
import MovieHero from '../../../components/movie-hero';

class ShowMovie extends React.Component {
  static async getInitialProps(ctx) {
    const movie = await fetch(`${getBaseURL(ctx)}/api/movies/${ctx.query.id}`);

    return movie.json();
  }

  render() {
    return (
      <>
        <MovieHero {...this.props}/>
        <NextSeo
          title={this.props.name}
          description={this.props.summary}
          openGraph={{
            images: this.props.Poster ? [
              {
                url: `/static/bucket/${this.props.Poster.path}`
              }
            ] : []
          }}/>
      </>
    );
  }
}

ShowMovie.darkBackground = true;
ShowMovie.transparentNav = true;

export default ShowMovie;
