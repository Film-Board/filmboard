import React from 'react';
import fetch from 'isomorphic-unfetch';
import {Column, Block, Level, Container, Section, Title} from 'rbx';
import {getBaseURL} from '../../../common/helpers';
import VideoBackground from '../../../components/video-background';
import Poster from '../../../components/poster';
import Prices from '../../../components/movie-prices';
import Ratings from '../../../components/movie-ratings';
import Showtime from '../../../components/showtime';
import EditButton from '../../../components/edit-button';
import './styles/show-movie.scss';

class ShowMovie extends React.Component {
  static async getInitialProps(ctx) {
    const movie = await fetch(`${getBaseURL(ctx)}/api/movies/${ctx.query.id}`);

    return movie.json();
  }

  render() {
    return (
      <div>
        <VideoBackground path={`/static/bucket/${this.props.Trailer.File.path}`}/>
        <Section>
          <Column.Group centered>
            <Column size="full">
              <Container>
                <Level className="movie-details">
                  <Column narrow>
                    <Section className="poster">
                      <Poster path={this.props.Poster.path}/>
                      <Ratings imdb={this.props.imdb} rottenTomatoes={this.props.rottenTomatoes} runtime={this.props.runtime} color="white"/>
                      <Prices ticketPrice={this.props.ticketPrice} concessionPrice={this.props.concessionPrice}/>
                    </Section>
                  </Column>

                  <Column className="movie-summery" size="one-third">
                    <Title className="has-text-white">{this.props.name}</Title>
                    <Block className="is-size-5 has-text-grey">{this.props.summery}</Block>
                  </Column>

                  <Column narrow>
                    {this.props.Showtimes.map(({time}) => {
                      const t = new Date(time);

                      return (<Showtime key={t} date={t}/>);
                    })}
                  </Column>
                </Level>
              </Container>
            </Column>
          </Column.Group>
        </Section>
        <EditButton link={`/movies/${this.props.id}/edit`}/>
      </div>
    );
  }
}

export default ShowMovie;
