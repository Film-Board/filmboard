import Layout from '../components/layout';
import fetch from 'isomorphic-unfetch';
import Router from 'next/router';
import DateTimeElement from '../components/date-time';
import {getBaseURL} from '../common/helpers';
import chrono from 'chrono-node';

class EditMovie extends React.Component {
  constructor(props) {
    super(props);

    this.showtimeElements = [];

    this.state = {
      showtimeElements: this.showtimeElements
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.addShowtime = this.addShowtime.bind(this);
  }

  async handleSubmit(event) {
    event.preventDefault();

    const rawData = new FormData(event.target);

    const data = Object.fromEntries(rawData);
    data.showtimes = rawData.getAll('showtime-date').map((showtimeDate, i) => {
      return chrono.parseDate(`${showtimeDate} ${rawData.getAll('showtime-time')[i]}`)
    });

    const res = await fetch(`http://localhost:3000/api/movies/${this.props.id}`, {
      method: 'PUT', headers: {
    'Accept': 'application/json, text/plain, */*',
    'Content-Type': 'application/json'
  }, body: JSON.stringify(data)});
  }

  static async getInitialProps({query, req}) {
    const movie = await fetch(`${getBaseURL(req)}/api/movies/${query.id}`);

    return movie.json();
  }

  componentDidMount() {
    // Add showtime fields
    if (!this.props.showtimes) return;

    this.props.showtimes.forEach(showtime => {
      const time = new Date(showtime);

      this.addShowtime(time);
    })
  }

  addShowtime(time) {
    const thisId = `showtime-${this.showtimeElements.length}`;

    if (time.constructor === Date) {
      const date = `${time.getMonth() + 1}/${time.getDate()}/${time.getFullYear()}`;
      const timeOfDay = `${time.getHours() > 9 ? time.getHours() : '0' + time.getHours()}:${time.getMinutes()}`

      this.showtimeElements.push(<DateTimeElement key={thisId} name='showtime'
      data-date={date} data-time={timeOfDay}/>);
    } else {
      this.showtimeElements.push(<DateTimeElement key={thisId} name='showtime'/>);
    }

    this.setState({
      showtimeElements: this.showtimeElements
    });
  }

  render() {
    return (
      <Layout>
        <h1 className="title">Edit Movie</h1>

        <div className="columns">
          <div className="column">
            <form onSubmit={this.handleSubmit}>
              <div className="field">
                <label className="label">Name</label>
                <input type="text" className="input" name="name" placeholder="Black Panther" defaultValue={this.props.name}/>
              </div>
              <div className="field">
                <label className="label">IMDB</label>
                <input type="number" className="input" name="imdb" placeholder="7.0" defaultValue={this.props.imdb}/>
              </div>
              <div className="field">
                <label className="label">Rotten Tomatoes</label>
                <input type="number" className="input" name="rotten-tomatoes" placeholder="70%" defaultValue={this.props.rottenTomatoes}/>
              </div>
              <div className="field">
                <label className="label">Runtime (minutes)</label>
                <input type="number" className="input" name="runtime" placeholder="104" defaultValue={this.props.runtime}/>
              </div>
              <div className="field">
                <label className="label">Staring</label>
                <input type="text" className="input" name="staring" placeholder="104" defaultValue={this.props.staring}/>
              </div>
              <div className="field">
                <label className="label">Directed by</label>
                <input type="text" className="input" name="directedBy" placeholder="104" defaultValue={this.props.directedBy}/>
              </div>
              <div className="field">
                <label className="label">Summery</label>
                <textarea className="textarea" placeholder="104" name="summery" defaultValue={this.props.summery}/>
              </div>
              <div className="field">
                <label className="label">YouTube Trailer #</label>
                <input type="text" className="input" placeholder="104" name="youtubeTrailerId" defaultValue={this.props.youtubeTrailerId}/>
              </div>
              <h3 className="title">Showtimes</h3>
              <div className="field is-grouped">
                {this.showtimeElements}
              </div>
              <button type="button" className="button is-success" onClick={this.addShowtime}>Add Showtime</button>
              <input type="submit" className="button is-success" value="Save movie"/>
            </form>
          </div>
          <div className="column">
            <img src={"/static/images/posters/" + this.props.poster}/>
          </div>
        </div>
      </Layout>
    );
  }
}

export default EditMovie;
