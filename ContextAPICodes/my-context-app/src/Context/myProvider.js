import React, { Component } from 'react';
import MyContext from './myContext';

class myProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: '',
    };
  }
  render() {
    return (
      <MyContext.Provider>
        {this.props.children}
      </MyContext.Provider>
    );
  }
}

export default myProvider;
