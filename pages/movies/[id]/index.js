import React from 'react';
import fetch from 'isomorphic-unfetch';
import { Column, Block, Level, Container, Section, Title } from 'rbx';
import { getBaseURL } from '../../../common/helpers';
import Layout from '../../../components/layout';
import VideoBackground from '../../../components/video-background';
import Poster from '../../../components/poster';
import Prices from '../../../components/movie-prices';
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
        <VideoBackground path={`/static/videos/${this.props.trailer}`}/>
        <Section>
          <Column.Group centered>
            <Column size="full">
              <Container>
                <Level className="movie-details">
                  <Column narrow>
                    <Section className="poster">
                      <Poster filename={this.props.poster}/>
                      <Ratings imdb={this.props.imdb} rottenTomatoes={this.props.rottenTomatoes} runtime={this.props.runtime} />
                      <Prices ticketPrice={this.props.ticketPrice} concessionPrice={this.props.concessionPrice}/>
                    </Section>
                  </Column>

                  <Column className="movie-summery" size="one-third">
                    <Title className="has-text-white">{this.props.name}</Title>
                    <Block className="is-size-5">{this.props.summery}</Block>
                  </Column>

                  <Column narrow>
                    {this.props.Showtimes.map(({time}) => {
                      const t = new Date(time);

                      return (<Showtime date={t} key={t}/>)
                    })}
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
