import React from 'react';
import {Field, Control, Button, Input, Icon, Label, Textarea} from 'rbx';
import './styles/new-movie-search.scss';

class MovieDetailsEditor extends React.Component {
  updateField(field, event) {
    let value = event;

    if (typeof event === 'object') {
      value = event.target.value;
    }

    this.props.updateField(field, value);
  }

  render() {
    return (
      <div>
        <Field>
          <Label>Name</Label>
          <Input placeholder="Black Panther" defaultValue={this.props.name} onBlur={e => this.updateField('name', e)}/>
        </Field>
        <Field>
          <Label>IMDB</Label>
          <Input type="number" placeholder="7.0" defaultValue={this.props.imdb} onBlur={e => this.updateField('imdb', e)}/>
        </Field>
        <Field>
          <Label>Rotten Tomatoes</Label>
          <Input type="number" placeholder="70%" defaultValue={this.props.rottenTomatoes} onBlur={e => this.updateField('rottenTomatoes', e)}/>
        </Field>
        <Field>
          <Label>Runtime (minutes)</Label>
          <Input type="number" placeholder="104" defaultValue={this.props.runtime} onBlur={e => this.updateField('runtime', e)}/>
        </Field>
        <Field>
          <Label>Staring</Label>
          <Input placeholder="Me" defaultValue={this.props.staring} onBlur={e => this.updateField('staring', e)}/>
        </Field>
        <Field>
          <Label>Directed by</Label>
          <Input placeholder="My pet" defaultValue={this.props.directedBy} onBlur={e => this.updateField('directedBy', e)}/>
        </Field>
        <Field>
          <Label>Summary</Label>
          <Textarea placeholder="¯\_(ツ)_/¯" defaultValue={this.props.summary} onBlur={e => this.updateField('summary', e)}/>
        </Field>
        <Field>
          <Label>Tickets</Label>
          <Control iconLeft>
            <Input placeholder="3" defaultValue={this.props.ticketPrice} onBlur={e => this.updateField('ticketPrice', e)}/>
            <Icon size="small" align="left">
            $
            </Icon>
          </Control>
        </Field>
        <Field>
          <Label>Concessions</Label>
          <Control iconLeft>
            <Input placeholder="1" defaultValue={this.props.concessionPrice} onBlur={e => this.updateField('concessionPrice', e)}/>
            <Icon size="small" align="left">
            $
            </Icon>
          </Control>
        </Field>
        <Field>
          <Label>Hidden?</Label>
          <Button onClick={() => this.updateField('hidden', !this.props.hidden)}>{this.props.hidden ? 'Yes' : 'No'}</Button>
        </Field>
        <Field>
          <Label>Special event?</Label>
          <Button onClick={() => this.updateField('specialEvent', !this.props.specialEvent)}>{this.props.specialEvent ? 'Yes' : 'No'}</Button>
        </Field>
      </div>
    );
  }
}

export default MovieDetailsEditor;
