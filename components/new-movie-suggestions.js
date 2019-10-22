import React from 'react';
import { Table, Icon, Button, Box } from 'rbx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';

class Suggestions extends React.Component {
  render() {
    if (this.props.suggestions.length > 0) {
      return (
        <Box>
          <Table striped>
            <Table.Body>
              {this.props.suggestions.map((suggestion, i) => (
                <Table.Row key={i}>
                  <Table.Cell>{suggestion.title}</Table.Cell>
                  <Table.Cell>{new Date(suggestion.release_date).getFullYear()}</Table.Cell>
                  <Table.Cell>
                    <Button backgroundColor="success" onClick={() => this.props.onAdd(suggestion)}>
                      <Icon>
                        <FontAwesomeIcon icon={faPlusCircle}/>
                      </Icon>
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Box>
      );
    }

    return null;
  }
}

export default Suggestions;
