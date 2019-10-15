import React from 'react';
import { Icon, Field, Control, Input, Label, Select, Button, Column } from 'rbx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faSearch } from '@fortawesome/free-solid-svg-icons';

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

    this.updateFromDate = this.updateFromDate.bind(this);
    this.updateToDate = this.updateToDate.bind(this);
    this.updateLimit = this.updateLimit.bind(this);
    this.updateSearch = this.updateSearch.bind(this);
  }

  updateFromDate(event) {
    this.setState({ fromDate: new Date(event.target.value) });
  }

  updateToDate(event) {
    this.setState({ toDate: new Date(event.target.value) });
  }

  updateLimit(event) {
    let limit;

    if (event.target.value === 'All') {
      limit = Infinity;
    } else {
      limit = Number(event.target.value);
    }

    this.setState({ limit });
  }

  updateSearch(event) {
    this.setState({ search: event.target.value });
  }

  render() {
    return (
      <form onSubmit={() => this.props.onSubmit(event, this.state)}>
        <Column.Group vcentered>
          <Column>
            <Column.Group>
              <Column>
                <Field>
                  <Label>From</Label>
                  <Control>
                    <Input type="date" onChange={this.updateFromDate}/>
                  </Control>
                </Field>
              </Column>
              <Column>
                <Field>
                  <Label>To</Label>
                  <Control>
                    <Input type="date" onChange={this.updateToDate}/>
                  </Control>
                </Field>
              </Column>
              <Column>
                <Field>
                  <Label># to show</Label>
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
            <Column.Group centered>
              <Column>
                <Field expanded>
                  <Control iconLeft>
                    <Input placeholder="Search" onChange={this.updateSearch}/>
                    <Icon size="small" align="left">
                      <FontAwesomeIcon icon={faSearch} />
                    </Icon>
                  </Control>
                </Field>
              </Column>
            </Column.Group>
          </Column>
          <Column>
            <Field>
              <Control>
                <Button size="large" color="black">
                  <Icon color="warning">
                    <FontAwesomeIcon icon={faFilter}/>
                  </Icon>
                </Button>
              </Control>
            </Field>
          </Column>
        </Column.Group>
      </form>
    );
  }
}

export default MoviesFilter;
