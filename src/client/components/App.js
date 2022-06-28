import React, { Component } from 'react';
import  SearchBar  from './SearchBar';


import './App.css';
import { showError } from '../actions/postActions';
import { connect } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import Dashboard from './Dashboard';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      validated: false,
      message:''
    };
    this.myform = {
      email: React.createRef(),
      message:React.createRef()
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  
  componentDidMount()
  {
    // this.props.fetchPosts();
  }

  validateForm()
  {
    
    if(!this.myform.email.current.value
      || !this.myform.message.current.value
      || this.state.message.length>=500)
    {
      return false;
    }
    return true;
  }

  handleChange(event)
  {
      this.setState({
        message: event.target.value
      })
      if(event.target.value?.length >= 500)
      {
          this.props.showError('Maximum message limit is 500 characters');
          return;
      }
      else if (this.props.error?.length>0)
      {
        this.props.showError('');
        this.setState({validated:false})
      }
  }

  handleSubmit(event) {
    event.preventDefault();
    
    if(!this.validateForm())
    {
      return false;
    }

    const post = {
      email: this.myform.email.current.value,
      message: this.myform.message.current.value
    }
  }

  render() {
    return (
      <div className="App">          
        <Dashboard />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  items: state.posts.items,
  searchSuggestions: state.posts.searchSuggestions,
  error: state.posts.error
});

const mapDispatchToProps = ({
  showError: payload => showError(payload),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);

