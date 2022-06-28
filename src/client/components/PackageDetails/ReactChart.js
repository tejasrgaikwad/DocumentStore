import React from 'react';
import { Bar, Chart as ChartJS } from 'react-chartjs-2';
import './ReactChart.css';
import { fetchSuggestions, getPackageMetaData } from '../../actions/postActions';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';

require('./RoundedCorner')

class ReactChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            metadata: {}
        }
        this.showVersionDetails= this.showVersionDetails.bind(this);
    }

    componentDidMount() {
        this.prepareData();
    }

    prepareData() {
        const dataSource = this.props.metadata;
        const data1 = [];
        const data2 = [];
        const labels = [];

        dataSource && Array.isArray(dataSource) && dataSource.map(element => {
            // labels.push(`Minified ${element.moduleSize}kb | Gzipped ${element.minifiedGzippedSize}kb`);
            labels.push(element.version);
            data1.push(element.moduleSize);
            data2.push(element.minifiedGzippedSize)
        });
        const metadata =
        {
            labels: labels,
            barPercentage: 0.5,
            barThickness: 6,
            maxBarThickness: 8,
            minBarLength: 2,
            datasets: [
                {
                    label: 'Gzipped',
                    backgroundColor: 'rgba(34,68,100,1)',
                    data: data2
                },
                {
                    label: 'Minified',
                    backgroundColor: 'rgba(75,192,192,1)',
                    data: data1
                }
            ]

        }
        this.setState({
            metadata: metadata
        })
    }

    showVersionDetails = (index)=> {
        index && this.props.onBarClick(index);
    }

    onClickEvent=(element)=>
    {
        this.showVersionDetails(element[0]?._index)
    }


    componentDidUpdate(prevProps)
    {
        if(this.props?.metadata[0]?.name !== prevProps?.metadata[0]?.name)
        {
            this.prepareData();
        }
    }

    render() {
        return (
            <div className="ReactChartContainer">
                {this.state.metadata && (<Bar
                    getElementAtEvent={this.onClickEvent}
                    data={this.state.metadata}
                    options={{
                        maintainAspectRatio: false,
                        cornerRadius: 3,
                        scales: {
                            xAxes: [{
                                barThickness: 25,
                                stacked: true,
                                gridLines: {
                                    color: "rgba(1, 1, 1, 0)",
                                    tickMarkLength: 8,
                                    drawOnChartArea: false
                                },
                                ticks: {
                                    display: true
                                }
                            }],
                            yAxes: [{
                                stacked: true,
                                
                                beginAtZero:true,
                                fontColor: '#787878',
                                fontSize: 10,
                                padding: 18,
                                gridLines: {
                                    color: "rgba(0, 0, 0, 0)",
                                    drawOnChartArea: false
                                },
                                ticks: {
                                    display: false,
                                }
                            }]

                        },
                        title: {
                            display: true,
                            text: 'BUNDLE SIZE',
                            fontSize: 20
                        },
                        legend: {
                            display: false,
                        }
                    }}
                />)
                }
            </div>
        );
    }
}

const mapStateToProps = state => ({
    metadata: state.posts.metadata,
    error: state.posts.error
  });
  
  const mapDispatchToProps = ({
    fetchSuggestions: (searchText) => fetchSuggestions(searchText),
    getPackageMetaData: (suggestion) => getPackageMetaData(suggestion)
  });
  
  export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ReactChart));
