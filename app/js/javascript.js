$( document ).ready(function(){
  const w = 1100;
  const h = 800;
  const margin = {
    top: 5,
    bottom: 5,
    left: 5,
    right: 5
  }

  const radius = 9;

  function title(){
    console.log('title')
  }
  function render(data){
    //adding tooltip
    const tooltip = d3.select("#canvas")
                      .append("div")
                      .classed("tooltip", true)
                      .style("opacity", 0)

    const width = w - (margin.left + margin.right);
    const height = h - (margin.top + margin.bottom);

    let flagNodes = d3.select("#canvas")
                      .append("div")
                      .classed("flag-nodes",true)


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
        .force("charge", d3.forceManyBody().strength(-10).distanceMax(60).distanceMin(20))
        .force("center", d3.forceCenter(width/2, height/2))
        .force("collision", d3.forceCollide().radius(22).strength(1))


    let link = chart.append("g")
            .classed("links",true)
            .selectAll("line")
            .data(data.links)
            .enter()
              .append("line")


    simulation
        .nodes(data.nodes)
        .on("tick", ticked);

    simulation
        .force("link")
        .links(data.links);

    let node = flagNodes.selectAll(".flag-nodes")
            .data(data.nodes)
            .enter()
              .append("div")
              .attr("class", function(d,i){
                return `flag flag-${d.code}`
              })
              .call(d3.drag()
              .on("start", dragstarted)
              .on("drag", dragged)
              .on("end", dragended)
            )
            .on("mouseover",function(d,i){
              tooltip.transition()
                .style("opacity", 0.8)
              tooltip.html(d.country)
                .style("left", d3.event.pageX + "px")
                .style("top", d3.event.pageY + "px")
            })
            .on("mouseout",function(d,i){
              tooltip.transition()
                .style("opacity", 0)
            })

    node.append("title")
    .text(function(d) { return d.country; });
    //functions provided by d3.js
    //
    function ticked() {
        node
            .style("left", function(d) {
              let xlimit = Math.max(radius, Math.min(width - radius, d.x))
              return (xlimit) + 'px'
            })
            .style("top", function(d) {
              let ylimit = Math.max(radius, Math.min(height - radius, d.y))
              return (ylimit - 2) + 'px'
            });
        link
            .attr("x1", function(d) {
              let x1 = Math.max(radius, Math.min(width - radius, d.source.x))
              return x1;
            })
            .attr("y1", function(d) {
              let y1 = Math.max(radius, Math.min(height - radius, d.source.y))
              return y1
            })
            .attr("x2", function(d) {
              let x2 = Math.max(radius, Math.min(width - radius, d.target.x))
              return x2;
            })
            .attr("y2", function(d) {
              let y2 = Math.max(radius, Math.min(height - radius, d.target.y))
              return y2
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
      title()
      render(data)
    },
    fail: () =>{
      console.log('failure!')
    },
    error: () =>{
    }
  });
});
