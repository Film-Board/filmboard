import React from 'react';
import {Table, Icon, Button, Box, Loader, Level} from 'rbx';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPlusCircle} from '@fortawesome/free-solid-svg-icons';

class Suggestions extends React.Component {
  render() {
    if (this.props.suggestions.length > 0) {
      return (
        <Box>
          <Table striped fullwidth>
            <Table.Body>
              {this.props.suggestions.map(suggestion => (
                <Table.Row key={suggestion.id}>
                  <Table.Cell>
                    <Level>
                      <Level.Item align="left">
                        {suggestion.title}
                      </Level.Item>

                      <Level.Item>
                        {new Date(suggestion.release_date).getFullYear()}
                      </Level.Item>

                      <Level.Item align="right">
                        <Button backgroundColor="success" disabled={this.props.adding !== ''} onClick={() => this.props.onAdd(suggestion)}>
                          {this.props.adding === suggestion.title ? (<Loader/>) : (
                            <Icon>
                              <FontAwesomeIcon icon={faPlusCircle}/>
                            </Icon>
                          )}
                        </Button>
                      </Level.Item>
                    </Level>
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
