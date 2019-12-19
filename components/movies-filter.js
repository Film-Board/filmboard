import React from 'react';
import {Icon, Field, Control, Input, Select, Button, Column} from 'rbx';
import DatePicker from 'react-datepicker';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faFilter, faSearch} from '@fortawesome/free-solid-svg-icons';

import './styles/movies-filter.scss';

class MoviesFilter extends React.Component {
  constructor() {
    super();

    this.state = {
      fromDate: undefined,
      toDate: undefined,
      limit: 10,
      search: ''
    };

    this.updateLimit = this.updateLimit.bind(this);
    this.updateSearch = this.updateSearch.bind(this);
  }

  updateLimit(event) {
    let limit;

    if (event.target.value === 'All') {
      limit = Infinity;
    } else {
      limit = Number(event.target.value);
    }

    this.setState({limit});
  }

  updateSearch(event) {
    this.setState({search: event.target.value});
  }

  render() {
    return (
      <form onSubmit={e => this.props.onSubmit(e, this.state)}>
        <Column.Group vcentered>
          <Column>
            <Column.Group centered vcentered>
              <Column>
                <Field kind="addons">
                  <Control>
                    <Button static>
                      <Icon size="small" align="left">
                        <FontAwesomeIcon icon={faSearch}/>
                      </Icon>
                    </Button>
                  </Control>
                  <Control expanded>
                    <Input placeholder="search" onChange={this.updateSearch}/>
                  </Control>
                </Field>
              </Column>
              <Column>
                <Field kind="addons">
                  <Control>
                    <Button static>limit to</Button>
                  </Control>
                  <Control>
                    <Select.Container>
                      <Select onChange={this.updateLimit}>
                        <Select.Option>10</Select.Option>
                        <Select.Option>20</Select.Option>
                        <Select.Option>50</Select.Option>
                        <Select.Option>All</Select.Option>
                      </Select>
                    </Select.Container>
                  </Control>
                </Field>
              </Column>
            </Column.Group>
            <Column.Group centered vcentered>
              <Column>
                <Field kind="addons">
                  <Control>
                    <Button static>from</Button>
                  </Control>
                  <Control>
                    <DatePicker selected={this.state.fromDate} className="input" onChange={day => this.setState({fromDate: day})}/>
                  </Control>
                </Field>
              </Column>
              <Column>
                <Field kind="addons">
                  <Control>
                    <Button static>to</Button>
                  </Control>
                  <Control>
                    <DatePicker selected={this.state.toDate} className="input" onChange={day => this.setState({toDate: day})}/>
                  </Control>
                </Field>
              </Column>
            </Column.Group>
          </Column>
          <Column narrow>
            <Button size="large" color="black">
              <Icon color="warning">
                <FontAwesomeIcon icon={faFilter}/>
              </Icon>
            </Button>
          </Column>
        </Column.Group>
      </form>
    );
  }
}

export default MoviesFilter;
