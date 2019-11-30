import React from 'react';
import {Column, Block, Level, Container, Title} from 'rbx';
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

        <Container breakpoint="tablet" className="movie-details">
          <Column.Group centered>
            <Column size="full">
              <Level>
                <Column narrow className="poster">
                  <Column.Group>
                    <Column>
                      <Poster path={this.props.Poster.path}/>
                      <Ratings imdb={this.props.imdb} rottenTomatoes={this.props.rottenTomatoes} runtime={this.props.runtime} color="white"/>
                      <Prices ticketPrice={this.props.ticketPrice} concessionPrice={this.props.concessionPrice}/>
                    </Column>
                  </Column.Group>
                </Column>

                <Column className="movie-summery" size="one-third">
                  <Title className="has-text-white default-capitalization has-text-centered-mobile">{this.props.name}</Title>
                  <Block className="is-size-5 has-text-grey">{this.props.summery}</Block>
                  <div className="has-text-grey"><b className="has-text-white">staring</b>: {this.props.staring}</div>
                  <div className="has-text-grey"><b className="has-text-white">directed by</b>: {this.props.directedBy}</div>
                </Column>

                <Column narrow>
                  {this.props.Showtimes.map(({time}) => {
                    const t = new Date(time);

                    return (<Showtime key={t} date={t}/>);
                  })}
                </Column>
              </Level>
            </Column>
          </Column.Group>
        </Container>

        <EditButton as={`/movies/${this.props.id}/edit`} href="/movies/[id]/edit"/>
      </div>
    );
  }
}

export default MovieHero;
