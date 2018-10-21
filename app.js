// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 660;

// Define the chart's margins as an object
var chartMargin = { top: 20, right: 20, bottom: 80, left: 40 };

var width = svgWidth - chartMargin.left - chartMargin.right;
var height = svgHeight - chartMargin.top - chartMargin.bottom;

// Create an svg wrapper
var svg_object = d3.select("#scatter")
                    .append("svg")
                    .attr("height", svgHeight)
                    .attr("width", svgWidth);

var chartGroup = svg_object.append("g")
        .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

// Import csv file
d3.csv("data.csv", function(error, healthData) {
        if (error) throw error;
 
    healthData.forEach(function(d) {
    d.poverty = +d.poverty;
    d.healthcare = +d.healthcare;
  });

  var xLinearScale = d3.scaleLinear().range([0, width]);
  var yLinearScale = d3.scaleLinear().range([height, 0]);

  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

        xLinearScale.domain([0, d3.max(healthData, function(data){
                return +data.poverty;
   })]);

        yLinearScale.domain([0, d3.max(healthData,function(data){
                return +data.healthStatus;
   })]);


  chartGroup.append("g")
          .attr("transform", `translate(0, ${height})`)
          .call(bottomAxis);

  chartGroup.append("g")
          .call(leftAxis);

  var circles = chartGroup.selectAll("circle")
            .data(healthData)
            .enter()
            .append("circle")
            .attr("cx", d => xLinearScale(d.poverty))
            .attr("cy", d => yLinearScale(d.healthcare))
            .attr("r", "15")
            .attr("fill", "lightblue")
            .attr("opacity", "1")
            .classed("add_labels",true)
            
  var labels =  chartGroup.selectAll("add_labels")
            .data(healthData)
            .enter()
            .append("text")
            .attr("x", d => xLinearScale(d.poverty))
            .attr("y",d => yLinearScale(d.healthcare))
            .text(function(d){return d.abbr})
            .attr("text-anchor","middle")
            .attr("alignment-baseline","middle")
            .attr("stroke","#a3a3a3");

    // Create axes labels
    chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - chartMargin.left - 5 )
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Lacks Healthcare (%)");

  chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + chartMargin.top + 20})`)
    .attr("class", "axisText")
    .text("In Poverty (%)");

})