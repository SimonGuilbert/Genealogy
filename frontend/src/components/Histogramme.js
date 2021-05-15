import React from "react";
import * as d3 from "d3";

export default function Histogramme(data) {
    console.log(data)
    let dataset = []
    Object.keys(data.data).forEach(item => dataset.push(data.data[item]))

    const w = 800;
    const h = 250;

    const svg = d3
      .select("#graph")
      .append("svg")
      .attr("width", w)
      .attr("height", h)
      .attr("class", "bar");

    svg
      .selectAll("rect")
      .data(dataset)
      .enter()
      .append("rect")
      .attr("fill", "black")
      .attr("class", "sBar")
      .attr("x", (d, i) => i * 40)
      .attr("y", (d, i) => {
        return h - 7 * d;
      })
      .attr("width", 30)
      .attr("height", (d, i) => 7 * d)
      .append("title")
      .text(d => d);

    svg
      .selectAll("text")
      .data(dataset)
      .enter()
      .append("text")
      .style("font-size", 18)
      .attr("fill", "red")
      .attr("x", (d, i) => i * 60)
      .attr("y", (d, i) => h - 7 * d - 3)

    const styles = {
      container: {
        display: "grid",
        justifyItems: "center"
      }
    };
    return (
      <div id="graph" style={styles.container}>
          
      </div>
    );
  
}