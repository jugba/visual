import React from 'react';

import axios from 'axios';
import * as d3 from 'd3';
let width = 960
let height = 500;
let root;

let force = d3.forceSimulation(root)
    .force('center', d3.forceCenter(width/2, height/2))
    .on("tick", tick)

let svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)

let  link = svg.selectAll(".link"),
    node = svg.selectAll(".node");

class Catalog extends React.Component{
  
  constructor(props){
    super(props)
    this.state = {diseases: []}
   
  }
  componentDidMount(){
    let url = process.env.REACT_APP_BASE_URL;
    console.log(url)
    axios.get(url)
      .then(res =>{
        const diseases = res.data;
        this.setState({diseases});
        root = {name: 'all', children: diseases}
        update()
      })
    d3.select(this.refs.app).style("background-color", "blue")


  }
  render(){
    return <div >
      <h1>Disease Directory</h1>
      <div ref='app'> whadfdfd</div>
      <ul>
      {this.state.diseases.map((disease)=><li key={disease.name}>{disease.name}</li>)}
      </ul>    
    </div>
  }
}

function update() {
  let nodes = flatten(root);
  let  links = d3.tree(nodes);

  // Restart the force layout.
  force = d3.forceSimulation(root).force('center', d3.forceCenter(width/2, height/2))
  .on("tick", tick).restart()
      

  // Update the links…
  link = link.data(links, function(d) { return d.target.id; });

  // Exit any old links.
  link.exit().remove();

  // Enter any new links.
  link.enter().insert("line", ".node")
      .attr("class", "link")
      .attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

  // Update the nodes…
  node = node.data(nodes, function(d) { return d.id; }).style("fill", color);

  // Exit any old nodes.
  node.exit().remove();

  // Enter any new nodes.
  node.enter().append("circle")
      .attr("class", "node")
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; })
      .attr("r", function(d) { return Math.sqrt(d.size) / 10 || 4.5; })
      .style("fill", color)
      .on("click", click)
      .call(force.drag);
}

function tick() {
  link.attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

  node.attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; });
}

// Color leaf nodes orange, and packages white or blue.
function color(d) {
  return d._children ? "#3182bd" : d.children ? "#c6dbef" : "#fd8d3c";
}

// Toggle children on click.
function click(d) {
  if (!d3.event.defaultPrevented) {
    if (d.children) {
      d._children = d.children;
      d.children = null;
    } else {
      d.children = d._children;
      d._children = null;
    }
    update();
  }
}

// Returns a list of all nodes under the root.
function flatten(root) {
  var nodes = [], i = 0;

  function recurse(node) {
    if (node.children) node.children.forEach(recurse);
    if (!node.id) node.id = ++i;
    nodes.push(node);
  }

  recurse(root);
  return nodes;
}

export default Catalog;