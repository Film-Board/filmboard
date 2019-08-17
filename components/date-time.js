import React from 'react';
import Cleave from 'cleave.js/react';
import { Table, Button, Icon } from 'rbx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';

export default props => (
  <Table striped fullwidth>
    <Table.Head>
      <Table.Row>
        <Table.Heading>Date</Table.Heading>
        <Table.Heading>Time</Table.Heading>
        <Table.Heading>Delete</Table.Heading>
      </Table.Row>
    </Table.Head>
    <Table.Body>
      {props.showtimes.map(showtime => {
        const { time, id } = showtime;
        let date, timeOfDay;

        if (time.constructor === Date) {
          date = `${time.getMonth() + 1}/${time.getDate()}/${time.getFullYear()}`;
          timeOfDay = `${time.getHours() > 9 ? time.getHours() : '0' + time.getHours()}:${time.getMinutes()}`;
        }

        return (
          <Table.Row key={id}>
            <Table.Cell>
              <Cleave className="input" name={props.name + '-date'} placeholder="mm/dd/yyyy" options={{ date: true, datePattern: ['m', 'd', 'Y'] }} value={date}/>
            </Table.Cell>
            <Table.Cell>
              <Cleave className="input" placeholder="hh::mm" name={props.name + '-time'} options={{ time: true, timePattern: ['h', 'm'] }} value={timeOfDay}/>
            </Table.Cell>
            <Table.Cell>
              <Button color="danger" onClick={() => props.onShowtimeDelete(id)}>
                <Icon>
                  <FontAwesomeIcon icon={faTimesCircle}/>
                </Icon>
              </Button>
            </Table.Cell>
          </Table.Row>
        );
      })}
    </Table.Body>
  </Table>
);
