/**
 * Created by Rick on 2018-10-11.
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

d3.csv('../iris_data.csv',row_converter).then((data, error) => {
  dataset = data;
  console.log(`Data array length: ${data.length}`);
  console.log(`Column names: ${data.columns}`);

  //create svg element
  const svg = d3.select('#svg-area')
    .append('svg')
    .attr('width', svg_width)
    .attr('height', svg_height);

  //set scaling
  const x_scale = d3.scaleLinear()
    .domain([
      d3.min(dataset,(d) => {return d.sepal_length;}),
      d3.max(dataset,(d) => {return d.sepal_length;})])
    .range([padding,svg_width - padding])
    .nice();

  const y_scale = d3.scaleLinear()
    .domain([
      d3.min(dataset,(d) => {return d.petal_length;}),
      d3.max(dataset,(d) => {return d.petal_length;})])
    .range([svg_height - padding,padding])
    .nice();

  //plot points
  const all_points = svg.selectAll('circle')
    .data(dataset)
    .enter()
    .append('circle')
    .attr('cx', (d) => {
      return x_scale(d.sepal_length);
    })
    .attr('cy', (d) => {
      return (y_scale(d.petal_length));
    })
    .attr('r', 3);

  //define axis'
  const x_axis = d3.axisBottom()
    .scale(x_scale);
  const y_axis = d3.axisLeft()
    .scale(y_scale);

  //create axis'
  svg.append('g')
    .attr('class','axis')
    .attr('transform',`translate(0,${svg_height - padding})`)
    .call(x_axis);

  svg.append('g')
    .attr('class','axis')
    .attr('transform',`translate(${padding},0)`)
    .call(y_axis);

  //respond to radio events
  d3.selectAll('input').on('click', function(){
    const selected_class = d3.select(this).node().value;
    /*
    //logical test to fill points
    //reset all points to 'black' fill
    all_points.attr('fill','black');
    all_points.attr('fill',(d) => {
      if(d.class === selected_class){
        return 'green';
      }
    });
    */
    //using filter
    //all points start out with fill 'black'
    all_points.attr('fill','black')
      .filter((d) => {
        return d.class === selected_class;
      })
      .attr('fill','green');
  });
}).catch(er => {
  console.log(er);
});