import { AfterViewInit, Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Chart from 'chart.js/auto';
import * as d3 from 'd3';
import { DataService } from '../data.service';

@Component({
  selector: 'pb-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements AfterViewInit {

  public data:any[] = []
  public labels:any[] = []
  public dataSource = {
        datasets: [
            {
                data: this.data,
                backgroundColor: ['red','yellow','blue','green','pink','black','cyan','violet']
            }
        ],
        labels: this.labels
  }

  createChart() {
      var ctx = document.getElementById('myChart') as HTMLCanvasElement;
      var myPieChart = new Chart(ctx, {
          type: "pie",
          data: this.dataSource
      });
  }

  constructor(private http: HttpClient, private dataService: DataService) {}

  ngAfterViewInit(): void {
      this.http.get('http://localhost:3000/budget')
      .subscribe((res: any) => {
        for (var i = 0; i < res.myBudget.length; i++) {
          this.dataSource.datasets[0].data[i] = res.myBudget[i].budget;
          this.dataSource.labels[i] = res.myBudget[i].title;
          this.dataSource.datasets[0].backgroundColor[i] = res.myBudget[i].color;
        }
        this.createChart();
      })

      // Fetch and render D3.js data
    this.dataService.getchartData().subscribe((chartData) => {
      this.createBarChart(chartData);
    });

    // Fetch data from API if not already fetched
    this.dataService.fetchchartDataIfNeeded();

  }

  createBarChart(exampleData: any) {
    const budgetData = exampleData.myBudget;

    const margin = { top: 50, right: 30, bottom: 40, left: 40 },
      width = 800 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

    const svg = d3.select('#barChart')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
      .range([0, width])
      .padding(0.4)
      .domain(budgetData.map((d: any) => d.title));

      const y = d3.scaleLinear()
      .range([height, 0])
      .domain([120, 160]);

// Tooltip creation
const tooltip = d3.select('body').append('div')
.attr('class', 'tooltip')
.style('opacity', 0)
.style('position', 'absolute')
.style('background-color', 'white')
.style('border', '1px solid black')
.style('padding', '5px');

svg.selectAll('rect')
  .data(budgetData)
  .enter().append('rect')
  .attr('x', (d: any) => x(d.title)!)
  .attr('y', (d: any) => y(d.budget))
  .attr('width', x.bandwidth())
  .attr('height', (d: any) => height - y(d.budget))
  .attr('fill', (d: any) => d.color)
  // Tooltip events
  .on('mouseover', function (event, d) {
    tooltip.style('opacity', 1);
  })
  .on('mousemove', function (event, d: any) {  // Explicitly typing 'd' as 'any' here
    tooltip.html(`<strong>${d.title}</strong><br>Budget: $${d.budget}`)
      .style('left', (event.pageX + 10) + 'px')
      .style('top', (event.pageY - 30) + 'px');
  })
  .on('mouseout', function () {
    tooltip.style('opacity', 0);
  });

svg.append('g')
.attr('transform', `translate(0,${height})`)
.call(d3.axisBottom(x));

svg.append('g')
.call(d3.axisLeft(y));
}


}
