/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import React, { PureComponent, createRef } from 'react';
import { styled } from '@superset-ui/core';
import {
  PluginChartHelloWorldProps,
  PluginChartHelloWorldStylesProps,
} from './types';
import Chart from 'react-google-charts';
import * as _ from 'lodash';

// The following Styles component is a <div> element, which has been styled using Emotion
// For docs, visit https://emotion.sh/docs/styled

// Theming variables are provided for your use via a ThemeProvider
// imported from @superset-ui/core. For variables available, please visit
// https://github.com/apache-superset/superset-ui/blob/master/packages/superset-ui-core/src/style/index.ts

const Styles = styled.div<PluginChartHelloWorldStylesProps>`
  background-color: ${({ theme }) => theme.colors.secondary.light2};
  padding: ${({ theme }) => theme.gridUnit * 4}px;
  border-radius: ${({ theme }) => theme.gridUnit * 2}px;
  height: ${({ height }) => height};
  width: ${({ width }) => width};
  overflow-y: scroll;

  h3 {
    /* You can use your props to control CSS! */
    font-size: ${({ theme, headerFontSize }) =>
      theme.typography.sizes[headerFontSize]};
    font-weight: ${({ theme, boldText }) =>
      theme.typography.weights[boldText ? 'bold' : 'normal']};
  }
`;

/**
 * ******************* WHAT YOU CAN BUILD HERE *******************
 *  In essence, a chart is given a few key ingredients to work with:
 *  * Data: provided via `props.data`
 *  * A DOM element
 *  * FormData (your controls!) provided as props by transformProps.ts
 */

export default class PluginChartHelloWorld extends PureComponent<PluginChartHelloWorldProps> {
  // Often, you just want to get a hold of the DOM and go nuts.
  // Here, you can do that with createRef, and componentDidMount.

  rootElem = createRef<HTMLDivElement>();

  componentDidMount() {
    const root = this.rootElem.current as HTMLElement;
    console.log('Plugin element', root);
  }

  render() {
    // height and width are the height and width of the DOM element as it exists in the dashboard.
    // There is also a `data` prop, which is, of course, your DATA 🎉
    console.log('Approach 1 props', this.props);
    const { data, height, width } = this.props;

    console.log('Plugin props', this.props);

    let chartData = _.map(data, c => {
      // c.task_type != 'user.quality.photo' &&
      // c.task_type != 'user.regular.basic' &&
      // c.task_type != 'internal.fetch.var' &&
      // c.task_type != 'user.quality.checklist'
      const task = (c.task_type + '').split('.');
      const taskType = `${task[0]}.${task[1]}`;
      const taskName = `${task[2]}`;
      return [
        taskType + taskName,
        taskName,
        taskType,
        new Date(c.case_start),
        new Date(c.case_complete),
        null,
        100,
        null,
      ];
    });
    chartData = _.compact(chartData);
    chartData.unshift([
      { type: 'string', label: 'Task ID' },
      { type: 'string', label: 'Task Name' },
      { type: 'string', label: 'Resource' },
      { type: 'date', label: 'Start Date' },
      { type: 'date', label: 'End Date' },
      { type: 'number', label: 'Duration' },
      { type: 'number', label: 'Percent Complete' },
      { type: 'string', label: 'Dependencies' },
    ]);

    return (
      <>
        <Styles
          ref={this.rootElem}
          boldText={this.props.boldText}
          headerFontSize={this.props.headerFontSize}
          height={height}
          width={width}
        >
          <Chart
            width={`${width - 50}px`}
            height={`${height - 50}px`}
            chartType="Gantt"
            loader={<div>Loading Chart</div>}
            data={chartData}
            options={{
              height: 400,
              gantt: {
                trackHeight: 30,
              },
            }}
            rootProps={{ 'data-testid': '2' }}
          />
        </Styles>
      </>
    );
  }
}
