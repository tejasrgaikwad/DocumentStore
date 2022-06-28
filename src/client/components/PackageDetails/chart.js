import React from 'react';

import { Chart, Series, CommonSeriesSettings, Legend, Export, Tooltip, Title } from 'devextreme-react/chart';


class ModuleChart extends React.Component {
  customizeTooltip(arg) {
    console.log('argument', arg);
    return {
      text: `${arg} kb`
    };
  }
  render() {
    const { dataSource } = this.props;
    console.log('dataSource=', dataSource);
    return (
      <Chart
        id="chart"
        dataSource={dataSource}
      >
        <Title
          text="Cost of module"
          subtitle="Size of node module to be included"
        />
        <CommonSeriesSettings argumentField="version" type="fullstackedbar" />
        <Series valueField="minifiedGzippedSize" name="Gzipped" />
        <Series valueField="moduleSize" name="Module Size" />

        <Legend verticalAlignment="top"
          horizontalAlignment="center"
          itemTextPosition="right"
        />
        <Export enabled={true} />
        <Tooltip
          enabled={true}
          customizeTooltip={this.customizeTooltip}
        />
      </Chart>
    );
  }
}

export default ModuleChart;
