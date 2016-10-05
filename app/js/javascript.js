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

    const svg = d3.select("#canvas")
                  .append("svg")
                  .attr("id","chart")
                  .attr("width", w)
                  .attr("height", h)

    const chart = svg.append("g")
                    .classed("display", true)
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    console.log(data)
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
