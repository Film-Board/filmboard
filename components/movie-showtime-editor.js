import React from 'react';
import {Field, Button, Table, Icon} from 'rbx';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faMinusCircle, faPlusCircle} from '@fortawesome/free-solid-svg-icons';
import {groupShowtimesByDay} from './lib/dates';

class MovieShowtimeEditor extends React.Component {
  constructor(props) {
    super(props);

    this.addDay = this.addDay.bind(this);
    this.addTime = this.addTime.bind(this);
    this.deleteDay = this.deleteDay.bind(this);
  }

  isDayEqual(d1, d2) {
    return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
  }

  getDatetime(day, time) {
    return new Date(day.getFullYear(), day.getMonth(), day.getDate(), time.getHours(), time.getMinutes(), time.getSeconds());
  }

  updateShowtime(ids, day, time) {
    const toUpdate = [];

    if (ids.length > 1 || time === undefined) {
      this.props.showtimes.filter(({id}) => ids.includes(id)).forEach(t => {
        const datetime = this.getDatetime(day, new Date(t.time));

        toUpdate.push({
          id: t.id,
          time: datetime
        });
      });
    } else {
      toUpdate.push({
        id: ids[0],
        time
      });
    }

    this.props.updateShowtime(toUpdate);
  }

  async addDay() {
    let baseDate = new Date();

    if (this.props.showtimes.length !== 0) {
      // Find latest day in date set
      const sortedTimes = this.props.showtimes.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());

      const latestTime = sortedTimes[sortedTimes.length - 1];
      const dayInMs = 24 * 60 * 60 * 1000;

      baseDate = new Date(new Date(latestTime.time).getTime() + dayInMs);
    }

    const standardTimes = [
      [14, 30],
      [17, 30],
      [20, 30],
      [23, 30]
    ];

    await Promise.all(standardTimes.map(standardTime => {
      const datetime = new Date(baseDate);
      datetime.setHours(standardTime[0]);
      datetime.setMinutes(standardTime[1]);
      datetime.setSeconds(0);

      return this.props.addShowtime(datetime);
    }));
  }

  deleteDay(d) {
    const day = new Date(d);

    const idsToDelete = [];

    this.props.showtimes.forEach(showtime => {
      if (this.isDayEqual(day, new Date(showtime.time))) {
        idsToDelete.push(showtime.id);
      }
    });

    this.props.deleteShowtime(idsToDelete);
  }

  addTime(day) {
    const time = day;

    time.setHours(12);
    time.setMinutes(0);
    time.setSeconds(0);

    this.props.addShowtime(time);
  }

  render() {
    const groupedTimes = groupShowtimesByDay(this.props.showtimes);

    return (
      <div>
        <Field>
          <Button color="info" onClick={this.addDay}>Add Day</Button>
        </Field>

        <Table>
          <Table.Head>
            <Table.Row>
              <Table.Heading>Day</Table.Heading>
              <Table.Heading>Times</Table.Heading>
              <Table.Heading>Remove</Table.Heading>
            </Table.Row>
          </Table.Head>

          <Table.Body>
            {
              groupedTimes.map(showtime => (
                <Table.Row key={showtime.day}>
                  <Table.Cell>
                    <DatePicker selected={showtime.day} className="input" onChange={day => this.updateShowtime((showtime.times.map(time => time.id)), day)}/>
                  </Table.Cell>

                  <Table.Cell>
                    <Table>
                      <Table.Head>
                        <Table.Row>
                          <Table.Heading>
                            <Button color="info" onClick={() => this.addTime(showtime.day)}>
                              <Icon>
                                <FontAwesomeIcon icon={faPlusCircle}/>
                              </Icon>
                            </Button>
                          </Table.Heading>
                          <Table.Heading></Table.Heading>
                        </Table.Row>
                      </Table.Head>
                      <Table.Body>
                        {showtime.times.map(time => (
                          <Table.Row key={time.id}>
                            <Table.Cell>
                              <DatePicker showTimeSelect showTimeSelectOnly className="input" selected={time.time} timeIntervals={15} timeCaption="Time" dateFormat="h:mm aa" onChange={date => this.updateShowtime([time.id], showtime.day, date)}/>
                            </Table.Cell>
                            <Table.Cell>
                              <Button color="danger" onClick={() => this.props.deleteShowtime([time.id])}>
                                <Icon>
                                  <FontAwesomeIcon icon={faMinusCircle}/>
                                </Icon>
                              </Button>
                            </Table.Cell>
                          </Table.Row>
                        ))}
                      </Table.Body>
                    </Table>
                  </Table.Cell>

                  <Table.Cell>
                    <Button color="danger" onClick={() => this.deleteDay(showtime.day)}>
                      <Icon>
                        <FontAwesomeIcon icon={faMinusCircle}/>
                      </Icon>
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))
            }
          </Table.Body>
        </Table>
      </div>
    );
  }
}

export default MovieShowtimeEditor;
