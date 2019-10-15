import React from 'react';
import fetch from 'isomorphic-unfetch';
import uuidv4 from 'uuid/v4';
import chrono from 'chrono-node';
import Router from 'next/router';
import { Section, Column, Field, Label, Title, Button, Input, Textarea, Icon, Level, Block } from 'rbx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import DateTimeTable from '../../../components/date-time';
import Poster from '../../../components/poster';
import { getBaseURL } from '../../../common/helpers';

class EditMovie extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showtimes: [],
      isTrailerDownloaded: this.props.trailer
    };

    this.updateProps = this.updateProps.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.addShowtime = this.addShowtime.bind(this);
    this.deleteShowtime = this.deleteShowtime.bind(this);
  }

  async updateProps() {
    if (this.props.trailer) return;

    const movie = await (await fetch(`/movies/${this.props.id}`)).json();

    this.props = {
      ...this.props,
      ...movie
    };

    if (movie.trailer) {
      this.setState({
        isTrailerDownloaded: true
      });
    } else {
      // Poll again in 2 seconds
      setTimeout(this.updateProps, 2000);
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

    await fetch(`/api/movies/${this.props.id}`,
      {
        method: 'put',
        headers: {
          "Accept": 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

    Router.push(`/movies/${this.props.id}`);
  }

  static async getInitialProps({ query, req }) {
    const movie = await (await fetch(`${getBaseURL(req)}/api/movies/${query.id}`)).json();

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
    await this.updateProps();
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
                <Button fullwidth type="submit" color={this.state.isTrailerDownloaded ? 'success' : 'grey'} disabled={!this.state.isTrailerDownloaded}>
                  {this.state.isTrailerDownloaded ? 'Save Movie' : (
                    <Level>
                      <Icon>
                        <FontAwesomeIcon icon={faCircleNotch} spin/>
                      </Icon>
                      <span>
                    Waiting for trailer to download...
                      </span>
                    </Level>
                  )}
                </Button>
              </Block>
            </form>
          </Column>
          <Column size={4}>
            <Poster filename={this.props.poster}/>
          </Column>
        </Column.Group>
      </Section>
    );
  }
}

export default EditMovie;
