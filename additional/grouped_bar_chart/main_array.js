/**
 * Created by Rick on 2018-10-14.
 */

'use strict';
const svg = d3.select('svg');
const svg_width = +svg.attr('width');
const svg_height = +svg.attr('height');

const margin = {top: 20, right: 20, bottom: 30, left: 60};
const chart_width = svg_width - margin.left - margin.right;
const chart_height = svg_height - margin.top - margin.bottom;
const chart_g = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`);
const color_scale = ['#98abc5', '#8a89a6', '#7b6888', '#6b486b', '#a05d56', '#d0743c', '#ff8c00'];

const chart_data = [
  ['State','Under 5 Years','5 to 13 Years','14 to 17 Years','18 to 24 Years','25 to 44 Years','45 to 64 Years','65 Years and Over'],
  ['CA',2704659,4499890,2159981,3853788,10604510,8819342,4114496],
  ['TX',2027307,3277946,1420518,2454721,7017731,5656528,2472223],
  ['NY',1208495,2141490,1058031,1999120,5355235,5120254,2607672],
  ['FL',1140516,1938695,925060,1607297,4782119,4746856,3187797],
  ['IL',894368,1558919,725973,1311479,3596343,3239173,1575308],
  ['PA',737462,1345341,679201,1203944,3157759,3414001,1910571]
];
let outer_categories = [];
let inner_categories = null;
let data_max = 0;
const data_ar = [];
for(const[index,row] of chart_data.entries()){
  if(index === 0){
    inner_categories = row.slice(1);
  }else {
    outer_categories.push(row[0]);
    const data_row = row.slice(1);
    data_ar.push(data_row);
    const row_max = d3.max(data_row);
    if(row_max > data_max){
      data_max = row_max;
    }
  }
}

//define scaling domains/ranges
const outer_scale = d3.scaleBand()
  .rangeRound([0, chart_width])
  .paddingInner(0.1);
outer_scale.domain(outer_categories);

const inner_scale = d3.scaleBand()
  .rangeRound([0,outer_scale.bandwidth()])
  .paddingInner(0.05);
inner_scale.domain(inner_categories);

const y_scale = d3.scaleLinear()
  .rangeRound([chart_height, 0]);
y_scale.domain([0, data_max]).nice();

//draw bars
chart_g.append('g')
  .selectAll('g').data(outer_categories).enter()
  .append('g')
    .attr('transform',d => {
      return `translate(${outer_scale(d)},0)`;
    })
  .selectAll('rect').data(function(d,i){
    return data_ar[i];
  })
  .enter()
  .append('rect')
    .attr('x',(d,i) => {
      return inner_scale(inner_categories[i]);
    })
    .attr('y',d => {
      return y_scale(d);
    })
    .attr('width',inner_scale.bandwidth())
    .attr('height',d => {
      return chart_height - y_scale(d);
    })
    .attr('fill',(d,i) => {
      return color_scale[i];
    });
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
    .attr('fill','black')
    .text('Population');

//draw legend
const legend = chart_g.append('g')
  .attr('font-family', 'Verdana')
  .attr('font-size', 10)
  .attr('text-anchor', 'end')
  .selectAll('g')
  .data(inner_categories.reverse())
  .enter()
  .append('g')
  .attr('transform', (d, i) => `translate(0,${i * 20})`);

legend.append('rect')
  .attr('x', chart_width - 19)
  .attr('width', 19)
  .attr('height', 19)
  .attr('fill', (d,i) => color_scale[i]);

legend.append('text')
  .attr('x', chart_width - 24)
  .attr('y', 9.5)
  .attr('dy', '0.32em')
  .text(d => d);
