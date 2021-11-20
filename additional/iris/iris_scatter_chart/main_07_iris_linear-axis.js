/**
 * Created by Rick on 2018-10-07.
 */
'use strict';
const svg_width = 1000;
const svg_height = 600;
const padding = 60;
let dataset = null; //global data from iris_data.csv
const row_converter = (row) => {
  return {
    sepal_length: parseFloat(row.sepal_length),
    sepal_width: parseFloat(row.sepal_width),
    petal_length: parseFloat(row.petal_length),
    petal_width: parseFloat(row.petal_width),
    class: row.class
  };
};

d3.csv('../iris_data.csv',row_converter).then((data) => {
  dataset = data;
  console.log(`Data array length: ${data.length}`);
  console.log(`Column names: ${data.columns}`);

  const svg = d3.select('#chart-area')
    .append('svg')
      .attr('width',svg_width)
      .attr('height',svg_height);

  const x_scale = d3.scaleLinear()
    .domain([
      d3.min(dataset,d => d.sepal_length),
      d3.max(dataset,d => d.sepal_length)]).nice()
    .range([padding,svg_width - padding]);

  const y_scale = d3.scaleLinear()
    .domain([
      d3.min(dataset,d => d.petal_length),
      d3.max(dataset,d => d.petal_length)]).nice()
    .range([svg_height - padding,padding]);

  const x_axis = d3.axisBottom(x_scale);
  const y_axis = d3.axisLeft(y_scale);

  svg.selectAll('circle').data(dataset).enter()
    .append('circle')
      .attr('cx', d => x_scale(d.sepal_length))
      .attr('cy', d => y_scale(d.petal_length))
      .attr('r', 2);

  svg.append('g')
    .attr('class','axis')
    .attr('transform',`translate(0,${svg_height - padding})`)
    .call(x_axis);

  svg.append('g')
    .attr('class','axis')
    .attr('transform',`translate(${padding},0)`)
    .call(y_axis);
}).catch(er => {
  console.log(er);
});



