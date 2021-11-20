/**
 * Created by Rick on 2018-10-06.
 */

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
  d3.select('#chart-area').selectAll('div').data(dataset).enter()
    .append('div')
      .text(d => d.sepal_length)
      .style('color',d => {
        if(d.sepal_length >= 5.0){
          return 'red';
        }else {
          return 'green';
        }
      });
}).catch((error) => {
  console.log(error);
});
