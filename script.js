let educationURL =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";
let countyURL =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";

let canvas = d3.select("#canvas").attr("height", 600).attr("width", 1000);
let tooltip = d3.select("#tooltip");

let drawMap = (dataset, educationData) => {
  canvas
    .selectAll("path")
    .data(dataset)
    .enter()
    .append("path")
    .attr("d", d3.geoPath())
    .attr("class", "county")
    .attr("fill", (d) => {
      let id = d.id;
      let county = educationData.find((item) => {
        return item.fips === id;
      });
      let percentage = county.bachelorsOrHigher;
      if (percentage <= 15) {
        return "tomato";
      } else if (percentage <= 30) {
        return "orange";
      } else if (percentage <= 45) {
        return "lightgreen";
      } else {
        return "limegreen";
      }
    })
    .attr("data-fips", (d) => d.id)
    .attr("data-education", (d) => {
      let id = d.id;
      let county = educationData.find((item) => {
        return item.fips === id;
      });
      let percentage = county.bachelorsOrHigher;
      return percentage;
    })
    .on("mouseover", (e, d) => {
      tooltip.transition().style("visibility", "visible");
      let id = d.id;
      let county = educationData.find((item) => {
        return item.fips === id;
      });

      tooltip.text(
        county.fips +
          " - " +
          county.area_name +
          ", " +
          county.state +
          " : " +
          county.bachelorsOrHigher +
          " %"
      );

      tooltip.attr("data-education", county.bachelorsOrHigher);
    })
    .on("mouseleave", () => {
      tooltip.style("visibility", "hidden");
    });
};

d3.json(countyURL).then((data, error) => {
  if (error) {
    console.log(error);
  } else {
    countyData = topojson.feature(data, data.objects.counties).features;

    d3.json(educationURL).then((data, error) => {
      if (error) {
        console.log(error);
      } else {
        educationData = data;
        drawMap(countyData, educationData);
        console.log(educationData);
      }
    });
  }
});
