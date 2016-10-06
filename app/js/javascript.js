$( document ).ready(function(){
  const w = 600;
  const h = 600;
  const margin = {
    top: 90,
    bottom: 90,
    left: 90,
    right: 90
  }

  function title(){
  }
  function render(data){

    const width = w - (margin.left + margin.right);
    const height = h - (margin.up + margin.down);

    let svg = d3.select("#canvas")
                  .append("svg")
                  .attr("id","chart")
                  .attr("width", w)
                  .attr("height", h)

    let chart = svg.append("g")
                    .classed("display", true)
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    let simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function(d,i) {
          return i;
          }))
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(width / 2, height / 2))

    let link = chart.append("g")
            .classed("links",true)
            .selectAll("line")
            .data(data.links)
            .enter()
              .append("line")

    let node = chart.append("g")
            .classed("nodes",true)
            .selectAll("circle")
            .data(data.nodes)
            .enter()
              .append("circle")
              .attr("r", 2.5)
              .call(d3.drag()
              .on("start", dragstarted)
              .on("drag", dragged)
              .on("end", dragended)
              );

    node.append("title")
    .text(function(d) { return d.country; });

    simulation
        .nodes(data.nodes)
        // .on("tick", ticked);

    simulation.force("link")
        .links(data.links);

    //functions provided by D3.js
    //
    function ticked() {
        link
            .attr("x1", function(d) {
              return d.source.x;
            })
            .attr("y1", function(d) {
              return d.source.y;
            })
            .attr("x2", function(d) {
              return d.target.x;
            })
            .attr("y2", function(d) {
              return d.target.y;
            });

        node
            .attr("cx", function(d) {
              return d.x;
             })
            .attr("cy", function(d) {
              return d.y;
             });
      }

    function dragstarted(d) {
      if (!d3.event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }

    function dragended(d) {
      if (!d3.event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
  }
  const url = 'https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json';
  $.ajax({
    type: "GET",
    dataType: "json",
    url: url,
    beforeSend: ()=>{
    },
    complete: () =>{
    },
    success: data =>{
      render(data)
    },
    fail: () =>{
      console.log('failure!')
    },
    error: () =>{
    }
  });
});
