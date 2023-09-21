import { Component, OnInit, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart } from 'chart.js/auto';
import * as d3 from 'd3';



// declare var d3: any;

@Component({
  selector: 'pb-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit, AfterViewInit {
  public dataSource: {
    datasets: {
      data: any[];
      backgroundColor: string[];
    }[];
    labels: string[];
  } = {
    datasets: [
      {
        data: [],
        backgroundColor: [
          '#ffcd56',
          '#ff6384',
          '#36a2eb',
          '#fd6b19',
        ],
      }
    ],
    labels: []
  };

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get('http://localhost:3000/budget')
      .subscribe((res: any) => {
        console.log(res);
        for (var i = 0; i < res.myBudget.length; i++) {
          this.dataSource.datasets[0].data[i] = res.myBudget[i].budget;
          this.dataSource.labels[i] = res.myBudget[i].title;
        }
        this.createChart();
      });
  }

  ngAfterViewInit(): void {
    this.getSecondBudget();
  }

  createChart() {
    var ctx = document.getElementById('firstChart') as HTMLCanvasElement;
    
    // Check if a chart instance exists on this canvas
    var existingChart = Chart.getChart(ctx);

    // If an existing chart is found, destroy it before creating a new one
    if (existingChart) {
      existingChart.destroy();
    }

    var myPieChart = new Chart(ctx, {
      type: 'pie',
      data: this.dataSource
    });
  }

  createSecondChart(data: any[]) {
    const budgetValues = data.map((d: any) => d.budget);
    const width = 700;
    const height = 500;
    const radius = Math.min(width, height) / 2;

    const svg = d3.select("#secondChart")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    const color = d3.scaleOrdinal<string, string>() // Specify types for the scale
      .domain(data.map((d: any) => d.title))
      .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

    const pie = d3.pie<number>() // Specify the data type for pie
      .sort(null)
      .value((d, i) => budgetValues[i]);

    const arc = d3.arc<any, d3.DefaultArcObject>() // Update the type definition here
      .outerRadius(radius * 0.8)
      .innerRadius(radius * 0.4);

    const outerArc = d3.arc<any, d3.DefaultArcObject>() // Update the type definition here
      .innerRadius(radius * 0.9)
      .outerRadius(radius * 0.9);

    const arcs = svg.selectAll(".arc")
      .data(pie(data))
      .enter()
      .append("g")
      .attr("class", "arc");

      arcs.append("path")
      .attr("d", (d: any) => {
        if (typeof d === 'object' && 'startAngle' in d && 'endAngle' in d) {
          return arc(d);
        }
        return ''; // Return an empty string as a fallback
      })
      .style("fill", (d: any) => color(d.data.title))
      .attr("class", "slice");
    

    const text = svg.selectAll(".labels")
      .data(pie(data))
      .enter()
      .append("text")
      .attr("dy", ".35em")
      .text(function (d: any) {
        return d.data.title;
      });

    function midAngle(d: { startAngle: number; endAngle: number; }) {
      return d.startAngle + (d.endAngle - d.startAngle) / 2;
    }

    text.transition().duration(1000)
      .attr("transform", function (d: any) {
        var pos = outerArc.centroid(d);
        pos[0] = radius * 1.002 * (midAngle(d) < Math.PI ? 1 : -1);
        return `translate(${pos[0]},${pos[1]})`; // Updated the transformation
      })
      .style("text-anchor", function (d: any) {
        return midAngle(d) < Math.PI ? "start" : "end";
      });

    const polyline = svg.selectAll(".lines")
      .data(pie(data))
      .enter()
      .append("polyline");

    polyline.transition().duration(1000)
      .attr("points", function (d: any) {
        var pos = outerArc.centroid(d);
        pos[0] = radius * 1 * (midAngle(d) < Math.PI ? 1 : -1);
        return `${arc.centroid(d)},${outerArc.centroid(d)},${pos[0]},${pos[1]}`; // Updated the points
      });
  }

  getSecondBudget() {
    this.http.get('http://localhost:3000/budget-data')
      .subscribe((data: any) => {
        this.createSecondChart(data.myBudget);
      });
  }
}
