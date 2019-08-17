import React from 'react';
import fetch from 'isomorphic-unfetch';
import { Column, Block, Level, Container, Section, Title } from 'rbx';
import { getBaseURL } from '../../../common/helpers';
import Layout from '../../../components/layout';
import Poster from '../../../components/poster';
import Ratings from '../../../components/movie-ratings';
import Showtime from '../../../components/showtime';
import './styles/show-movie.scss';

class ShowMovie extends React.Component {
  static async getInitialProps({ query, req }) {
    const movie = await fetch(`${getBaseURL(req)}/api/movies/${query.id}`);

    return movie.json();
  }

  render() {
    return (
      <Layout>
        <video autoPlay muted loop className="trailer-background">
          <source src={`/static/videos/${this.props.trailer}?autoplay=1`} type="video/mp4"/>
           Your browser does not support the video tag.
        </video>
        <Section>
          <Column.Group centered>
            <Column size="full">
              <Container>
                <Level className="movie-details">
                  <Column narrow>
                    <Section className="poster">
                      <Poster filename={this.props.poster}/>
                      <Ratings imdb={this.props.imdb} rottenTomatoes={this.props.rottenTomatoes} runtime={this.props.runtime} />
                    </Section>
                  </Column>

                  <Column narrow className="movie-summery" size="one-third">
                    <Title className="has-text-white">{this.props.name}</Title>
                    <Block className="is-size-5">{this.props.summery}</Block>
                  </Column>

                  <Column narrow>
                    <Showtime>9:30 PM, this Friday</Showtime>
                    <Showtime>9:30 PM, this Friday</Showtime>
                    <Showtime>9:30 PM, this Friday</Showtime>
                    <Showtime>9:30 PM, this Friday</Showtime>
                    <Showtime active>9:30 PM, this Friday</Showtime>
                    <Showtime active>9:30 PM, this Friday</Showtime>
                  </Column>
                </Level>
              </Container>
            </Column>
          </Column.Group>
        </Section>
      </Layout>
    );
  }
}

export default ShowMovie;
