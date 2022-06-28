
import React, { Component } from 'react';
import Autosuggest from 'react-autosuggest';
import { fetchSuggestions, getPackageMetaData, clearSuggestions } from '../../actions/postActions';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import SearchIcon from '../../icons/search2.svg';
import './style.css';
import PackageDetails from '../PackageDetails';

class SearchBar extends Component {
  constructor() {
    super();
    this.state = {
      value: '',
      suggestions: [],
      isPackageDetailsVisible: false,
      metadata: {},

    };

  }

  escapeRegexCharacters(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  getSuggestions(list, value) {
    const escapedValue = this.escapeRegexCharacters(value.trim());
    if (escapedValue === '') {
      return [];
    }
    return list;
  }

  renderSuggestion(suggestion) {
    return (
      <div className="suggestion_container">
        <div className="suggestion_title">{suggestion.name} {suggestion?.version}</div>
        <div className="suggestion_description">{suggestion.description}</div>
      </div>
    );
  }

  onChange = (_, { newValue, method }) => {
    console.log('calling onchange', method);
    this.setState({
      value: newValue
    });

    if (newValue.length > 1 && method!=='click')
      this.props.fetchSuggestions(newValue);
  };

  showPackageDetails(suggestion) {
    console.log('suggestion = ', suggestion);
    suggestion && this.props.getPackageMetaData(suggestion.suggestion).then(metadata => {
      this.setState({
        metadata,
        isPackageDetailsVisible: true,
      });
    });

  }

  onKeyDown = (event) => {
    if (event.key == 'Enter') {
      event.preventDefault();
      this.state.suggestions && this.showPackageDetails(this.state.suggestions[0]);
    }
    if(!this.state.selected)
    {
      this.setState({selected: false});
    } 
  };

  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: this.getSuggestions(this.props.suggestions ? this.props.suggestions : [], value)
    });
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  onSuggestionSelected = (event, suggestion) => {
    this.setState({suggestions:[], selected:true})
    this.showPackageDetails(suggestion);
  };

  getSuggestionValue(suggestion) {
    return suggestion?.name;
  }

  onSuggestionsUpdateRequested({ value }) {
    console.log('updated value ', value);
    this.loadSuggestions(value);
  }

  randomDelay() {
    return 300 + Math.random() * 1000;
  }

  loadSuggestions(value) {
    this.setState({
      isLoading: true
    });
    
    setTimeout(() => {
      const suggestions = this.getSuggestions(this.props.suggestions ? this.props.suggestions : [], value)

      if (value === this.state.value) {
        this.setState({
          isLoading: false,
          suggestions
        });
      } else { // Ignore suggestions if input value changed
        this.setState({
          isLoading: false
        });
      }
    }, this.randomDelay());
  }

  
  render() {
    const placeholder = 'type package name';
    const { searchSuggestions } = this.props;
    const { value } = this.state;
    const inputProps = {
      placeholder,
      value,
      onChange: this.onChange,
      onKeyDown: this.onKeyDown
    };

    return (
      <div>
        <div className="searchContainer">
          <Autosuggest
            id='cost_of_module'
            suggestions={searchSuggestions}
            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
            onSuggestionsUpdateRequested={this.onSuggestionsUpdateRequested}            
            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
            getSuggestionValue={this.getSuggestionValue}
            renderSuggestion={this.renderSuggestion}
            onSuggestionSelected={this.onSuggestionSelected}
            // onSuggestionsClearRequested={this.onSuggestionsClearRequested}
            inputProps={inputProps}
            
          />
          <img src={SearchIcon} className="searchIcon" alt="Click to see details" onClick={() => { console.log('search details', this.state.value) }} />
        </div>
        <div>
          {
            this.state.isPackageDetailsVisible && <div><PackageDetails metadata={this.state.metadata} /></div>
          }
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  searchSuggestions: state.posts.searchSuggestions,
  error: state.posts.error
});

const mapDispatchToProps = ({
  fetchSuggestions: (searchText) => fetchSuggestions(searchText),
  clearSuggestions: () => clearSuggestions(),
  getPackageMetaData: (suggestion) => getPackageMetaData(suggestion)
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SearchBar));