import React from 'react';
import fetch from 'isomorphic-unfetch';
import uuidv4 from 'uuid/v4';
import chrono from 'chrono-node';
import Router from 'next/router';
import {Section, Column, Field, Label, Title, Button, Input, Textarea, Block, Progress} from 'rbx';
import {withAuthSync, fetchWithAuth} from '../../utils/auth';
import DateTimeTable from '../../../components/date-time';
import Poster from '../../../components/poster';
import {getBaseURL} from '../../../common/helpers';

class EditMovie extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ...props,
      showtimes: []
    };

    this.updateTrailerProgress = this.updateTrailerProgress.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.addShowtime = this.addShowtime.bind(this);
    this.deleteShowtime = this.deleteShowtime.bind(this);
  }

  async updateTrailerProgress() {
    if (this.state.Trailer.progress === 1) {
      return;
    }

    const movie = await (await fetch(`/api/movies/${this.props.id}`)).json();

    this.setState({
      Trailer: movie.Trailer
    });

    if (movie.Trailer.progress !== 1) {
      // Poll again in 2 seconds
      setTimeout(this.updateTrailerProgress, 2000);
    }
  }

  async handleSubmit(event) {
    event.preventDefault();

    const rawData = new FormData(event.target);

    const data = Object.fromEntries(rawData);
    data.showtimes = rawData.getAll('showtimes-date').map((showtimeDate, i) => {
      return chrono.parseDate(`${showtimeDate} ${rawData.getAll('showtimes-time')[i]}`);
    });

    // Showtimes are in array, this
    // is not relevent.
    delete data['showtimes-date'];
    delete data['showtimes-time'];

    await fetchWithAuth(`/api/movies/${this.props.id}`,
      {
        method: 'PUT',
        body: data
      });

    Router.push(`/movies/${this.props.id}`);
  }

  static async getInitialProps(ctx) {
    const movie = await (await fetch(`${getBaseURL(ctx)}/api/movies/${ctx.query.id}`)).json();

    movie.showtimes = movie.Showtimes.map(showtime => showtime.time);

    return movie;
  }

  async componentDidMount() {
    // Add showtime fields
    if (this.props.showtimes) {
      this.props.showtimes.forEach(showtime => {
        const time = new Date(showtime);

        this.addShowtime(time);
      });
    }

    // Start polling to see if trailer was downloaded
    await this.updateTrailerProgress();
  }

  addShowtime(time) {
    this.setState(state => {
      const showtimes = state.showtimes.concat({
        time,
        id: uuidv4()
      });

      return {
        showtimes
      };
    });
  }

  deleteShowtime(id) {
    this.setState(state => {
      const showtimes = state.showtimes.filter(time => time.id !== id);

      return {
        showtimes
      };
    });
  }

  render() {
    return (
      <Section>
        <Column.Group centered>
          <Title>Edit Movie</Title>
        </Column.Group>
        <Column.Group centered>
          <Column size={4}>
            <form onSubmit={this.handleSubmit}>
              <Field>
                <Label>Name</Label>
                <Input name="name" placeholder="Black Panther" defaultValue={this.props.name}/>
              </Field>
              <Field>
                <Label>IMDB</Label>
                <Input type="number" name="imdb" placeholder="7.0" defaultValue={this.props.imdb}/>
              </Field>
              <Field>
                <Label>Rotten Tomatoes</Label>
                <Input type="number" name="rotten-tomatoes" placeholder="70%" defaultValue={this.props.rottenTomatoes}/>
              </Field>
              <Field>
                <Label>Runtime (minutes)</Label>
                <Input type="number" name="runtime" placeholder="104" defaultValue={this.props.runtime}/>
              </Field>
              <Field>
                <Label>Staring</Label>
                <Input name="staring" placeholder="104" defaultValue={this.props.staring}/>
              </Field>
              <Field>
                <Label>Directed by</Label>
                <Input name="directedBy" placeholder="104" defaultValue={this.props.directedBy}/>
              </Field>
              <Field>
                <Label>Summery</Label>
                <Textarea placeholder="104" name="summery" defaultValue={this.props.summery}/>
              </Field>

              <Title size={3}>Showtimes</Title>
              <Block>
                <Button color="success" onClick={this.addShowtime}>Add Showtime</Button>
              </Block>
              <DateTimeTable showtimes={this.state.showtimes} name="showtimes" onShowtimeDelete={this.deleteShowtime}/>

              <Block>
                <Button fullwidth type="submit" color="success">Save Movie</Button>
              </Block>
            </form>
          </Column>
          <Column size={4}>
            <Block>
              <Poster path={this.props.Poster.path}/>
            </Block>

            {this.state.Trailer.progress === 1 ? (
              <Block>
                <Title size={5} className="has-text-centered">Trailer processed.</Title>
              </Block>
            ) : (
              <Block>
                <Title size={5} className="has-text-centered">Processing trailer...</Title>
                <Progress value={this.state.Trailer.progress * 100} max={100} color="warning"/>
              </Block>
            )}
          </Column>
        </Column.Group>
      </Section>
    );
  }
}

export default withAuthSync(EditMovie);
