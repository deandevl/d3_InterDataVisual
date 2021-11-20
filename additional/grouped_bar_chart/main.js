/**
 * Created by Rick on 2018-10-14.
 */

'use strict';
const svg = d3.select('svg');
const svg_width = +svg.attr('width');
const svg_height = +svg.attr('height');

const margin = {top: 20, right: 20, bottom: 30, left: 40};
const chart_width = svg_width - margin.left - margin.right;
const chart_height = svg_height - margin.top - margin.bottom;
const chart_g = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`);

//define scaling ranges
const outer_scale = d3.scaleBand()
  .rangeRound([0, chart_width])
  .paddingInner(0.1);

const inner_scale = d3.scaleBand()
  .padding(0.05);

const y_scale = d3.scaleLinear()
  .rangeRound([chart_height, 0]);

const color_scale = d3.scaleOrdinal()
  .range(['#98abc5', '#8a89a6', '#7b6888', '#6b486b', '#a05d56', '#d0743c', '#ff8c00']);

//define row_converter
const row_converter = (row_obj,irow,columns) => {
  for(let i=1; i<columns.length; i++) {
    row_obj[columns[i]] = +row_obj[columns[i]];
  }
  return row_obj;
};

//read csv data file
d3.csv('data.csv',row_converter).then((chart_data) => {
  const keys = chart_data.columns.slice(1);
  //define scaling domains
  outer_scale.domain(chart_data.map(d => d.State));
  inner_scale.domain(keys).rangeRound([0, outer_scale.bandwidth()]);
  y_scale.domain([0, d3.max(chart_data, d => d3.max(keys, key => d[key]))]).nice();

  //draw bars
  chart_g.append('g') //put all inner groups in a svg group
    .selectAll('g').data(chart_data).enter() //bind outer chart data (States)
    .append('g') //put all rect's of an inner group in a svg group
      .attr('transform', d => `translate(${outer_scale(d.State)},0)`)
    .selectAll('rect')
    .data(function(d) {
      return keys.map(function(key) {
        return {key: key, value: d[key]};
      });
    })
    .enter() //bind inner chart data (Years)
    .append('rect')
      .attr('x', d => inner_scale(d.key))
      .attr('y', d => y_scale(d.value))
      .attr('width', inner_scale.bandwidth())
      .attr('height', d => chart_height - y_scale(d.value))
      .attr('fill', d => color_scale(d.key));

  //draw bottom axis
  chart_g.append('g')
      .attr('class', 'axis')
      .attr('transform', `translate(0,${chart_height})`)
      .call(d3.axisBottom(outer_scale));

  //draw left axis
  chart_g.append('g')
      .attr('class', 'axis')
      .call(d3.axisLeft(y_scale).ticks(null, 's'))
    .append('text')
      .attr('x', 2)
      .attr('y', y_scale(y_scale.ticks().pop()) + 0.5)
      .attr('dy', '0.32em')
      .attr('text-anchor', 'start')
      .text('Population');

  //draw legend
  const legend = chart_g.append('g')
    .attr('font-family', 'Verdana')
    .attr('font-size', 10)
    .attr('text-anchor', 'end')
    .selectAll('g')
    .data(keys.slice().reverse())
    .enter() //bind to inner keys
    .append('g')
    .attr('transform', (d, i) => `translate(0,${i * 20})`);

  legend.append('rect')
    .attr('x', chart_width - 19)
    .attr('width', 19)
    .attr('height', 19)
    .attr('fill', color_scale);

  legend.append('text')
    .attr('x', chart_width - 24)
    .attr('y', 9.5)
    .attr('dy', '0.32em')
    .text(d => d);
}).catch(er => {
  console.log(er);
});


