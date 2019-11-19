import React from 'react';
import {Column, Block, Level, Container, Section, Title} from 'rbx';
import VideoBackground from './video-background';
import Poster from './poster';
import Prices from './movie-prices';
import Ratings from './movie-ratings';
import Showtime from './showtime';
import EditButton from './edit-button';
import './styles/movie-hero.scss';

class MovieHero extends React.Component {
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
                    <div className="has-text-grey"><b className="has-text-white">Staring</b>: {this.props.staring}</div>
                    <div className="has-text-grey"><b className="has-text-white">Directed by</b>: {this.props.directedBy}</div>
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

export default MovieHero;
