import React, { Component } from 'react';

export default class ServiceForm extends Component {
  constructor() {
    super();
    this.state = {
      name: '',
      url: ''
    }
  }

  onSubmit(e) {
    e.preventDefault();
    this.props.onSubmit(this.state);
    this.setState({ name: '', url: ''});
  }

  updateName(e) {
    this.setState({name: e.target.value});
  }

  updateUrl(e) {
    this.setState({url: e.target.value});
  }

  render() {
    return (
      <form onSubmit={this.onSubmit.bind(this)}>
        <input type='text' placeholder='name' onChange={this.updateName.bind(this)} value={this.state.name}/>
        <input type='text' placeholder='url' onChange={this.updateUrl.bind(this)} value={this.state.url}/>
        <button type='submit'>Add</button>
      </form>
    )
  }
}
