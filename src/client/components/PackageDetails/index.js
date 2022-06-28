import { React, Component } from 'react';
import { connect } from 'react-redux';
import { fetchSuggestions, getPackageMetaData } from '../../actions/postActions';
import { withRouter } from "react-router-dom";
import ModuleChart from './chart';
import ReactChart from './ReactChart';
import './style.css';

class PackageDetails extends Component {
  constructor() {
    super();
    this.state = {
      value: '',
      suggestions: [],
      metadata: {},
      selectedVersionDetails: {}
    };
    this.onClick = this.onClick.bind(this);
  }

  componentDidMount(){
    const { metadata } = this.props;
    this.setState({
      metadata,
      selectedVersionDetails : metadata[3]
    })
  }
  componentDidUpdate(prevProps)
  {

      if(this.props?.metadata[0]?.name !== prevProps?.metadata[0]?.name)
      {
        const { metadata } = this.props;
        this.setState({
          metadata,
          selectedVersionDetails : metadata[3]
        })
      }
  }
  onClick = (index) =>{
    this.setState({
      selectedVersionDetails: this.state.metadata[index]
    })
  }

  getDisplayText(size)
  {
    if(size>500)
    {
      return (<span>{(this.state.selectedVersionDetails.moduleSize/1024).toFixed(2)}&nbsp;<span className="grayLabel">mB</span></span>)
    }
    return (<span>{size}&nbsp;<span className="grayLabel">kB</span></span>)
  }

  render() {
    const ismb_module = this.state?.selectedVersionDetails?.moduleSize > 500;
    const ismb_minified=this.state?.selectedVersionDetails?.minifiedGzippedSize > 500;
    return (<div className="packageDetailsContainer">
      <div className="packageInfoContainer">
        <div><label>BUNDLE SIZE</label></div>
        <div className="packageInfo">
          <div>
            <span className="blackBoldLabel">{this.getDisplayText(this.state?.selectedVersionDetails?.moduleSize)}</span>
            <span className="grayLabel">MINIFIED</span>
          </div>
          <div>
            <span className="blackBoldLabel">{this.getDisplayText(this.state?.selectedVersionDetails?.minifiedGzippedSize)}</span>
            <span className="grayLabel">MINIFIED + GZIPPED</span>
          </div>
        </div>
      </div>
      <ReactChart dataSource={this.state.metadata} onBarClick={this.onClick}/>
    </div>)
  }
}

const mapStateToProps = state => ({
  searchSuggestions: state.posts.searchSuggestions,
  error: state.posts.error
});

const mapDispatchToProps = ({
  fetchSuggestions: (searchText) => fetchSuggestions(searchText),
  getPackageMetaData: (suggestion) => getPackageMetaData(suggestion)
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PackageDetails));