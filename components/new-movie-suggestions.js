import React from 'react';
import {Table, Icon, Button, Box, Loader} from 'rbx';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPlusCircle} from '@fortawesome/free-solid-svg-icons';

class Suggestions extends React.Component {
  render() {
    if (this.props.suggestions.length > 0) {
      return (
        <Box>
          <Table striped>
            <Table.Body>
              {this.props.suggestions.map(suggestion => (
                <Table.Row key={suggestion.title}>
                  <Table.Cell>{suggestion.title}</Table.Cell>
                  <Table.Cell>{new Date(suggestion.release_date).getFullYear()}</Table.Cell>
                  <Table.Cell>
                    <Button backgroundColor="success" disabled={this.props.adding !== ''} onClick={() => this.props.onAdd(suggestion)}>
                      {this.props.adding === suggestion.title ? (<Loader/>) : (
                        <Icon>
                          <FontAwesomeIcon icon={faPlusCircle}/>
                        </Icon>
                      )}
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
