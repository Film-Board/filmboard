import React from 'react';
import {Column, Block, Container, Title, Section} from 'rbx';
import VideoBackground from './video-background';
import Poster from './poster';
import Prices from './movie-prices';
import Ratings from './movie-ratings';
import Showtimes from './showtimes';
import EditButton from './edit-button';
import './styles/movie-hero.scss';

class MovieHero extends React.Component {
  render() {
    return (
      <div>
        {this.props.Trailer && this.props.Trailer.progress === 1 ? (
          <VideoBackground path={`/static/bucket/${this.props.Trailer.File.path}`}/>
        ) : (<div/>)}

        {this.props.banner ? (
          <Section className="banner-container">
            <Container breakpoint="tablet">
              <Column.Group centered vcentered>
                <Column narrow className="has-text-centered has-text-white has-background-info is-size-7-mobile banner">
                  <span>{this.props.banner}</span>
                </Column>
              </Column.Group>
            </Container>
          </Section>
        ) : (<div/>)}

        <Section>
          <Container className={`movie-details ${this.props.Trailer ? 'has-trailer' : ''}`}>
            <Column.Group>
              <Column narrow className="poster">
                <Column.Group>
                  <Column>
                    <Poster path={this.props.Poster.path} specialEvent={this.props.specialEvent}/>
                    <Ratings imdb={this.props.imdb} rottenTomatoes={this.props.rottenTomatoes} runtime={this.props.runtime} color="white"/>
                    <Prices ticketPrice={this.props.ticketPrice} concessionPrice={this.props.concessionPrice}/>
                  </Column>
                </Column.Group>
              </Column>

              <Column size="one-third" className="title-summary-container">
                <Title className="default-capitalization has-text-centered-mobile">{this.props.name}</Title>
                <Block className="is-size-5 has-text-grey">{this.props.summary}</Block>

                <div>
                  <div className="has-text-grey"><b className="has-text-white">staring</b>: {this.props.staring}</div>
                  <div className="has-text-grey"><b className="has-text-white">directed by</b>: {this.props.directedBy}</div>
                </div>
              </Column>

              <Column narrow className="showtimes">
                <Showtimes showtimes={this.props.Showtimes}/>
              </Column>
            </Column.Group>
          </Container>
        </Section>

        <EditButton as={`/movies/${this.props.id}/edit`} href="/movies/[id]/edit"/>
      </div>
    );
  }
}

export default MovieHero;
