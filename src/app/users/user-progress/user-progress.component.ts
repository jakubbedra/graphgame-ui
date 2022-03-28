import {Component, OnInit} from '@angular/core';
import {Chart, registerables} from 'chart.js';
import {TaskService} from "../../tasks/task.service";
import {UserStatsService} from "../user-stats.service";
import {UserStats} from "../user-stats.model";
import {TaskType} from "../../tasks/task-type.model";
import {UserStatsList} from "../usr-stats-list.model";

Chart.register(...registerables);

@Component({
  selector: 'app-user-progress',
  templateUrl: './user-progress.component.html',
  styleUrls: ['./user-progress.component.css']
})
export class UserProgressComponent implements OnInit {

  specificTimePeriodInLinearChart: boolean;
  startDateLinear: string;
  endDateLinear: string;
  selectedTaskId: number;

  specificTimePeriodInBarChart: boolean;
  startDateBar: string;
  endDateBar: string;
  selectedTaskIds: number[] = [];

  mockUserId: number; //todo: ONLY FOR TEST, REMOVE THIS SHIT LATER ON!!!!!!!!!!

  tasks: TaskType[] = [];
  overallStats: Map<number, UserStats>;
  linearChartStats: UserStatsList;

  linearChart: Chart;
  barChart: Chart;

  constructor(
    private taskService: TaskService,
    private userStatsService: UserStatsService
  ) {
  }

  ngOnInit(): void {
    this.selectedTaskId = -1;
    this.specificTimePeriodInLinearChart = false;
    this.specificTimePeriodInBarChart = false;
    this.overallStats = new Map<number, UserStats>();
    this.mockUserId = 1;
    this.fetchTaskTypes();
    this.updateLinearChart();
  }

  fetchTaskTypes() {
    this.taskService.getAllTasks().subscribe(respData => {
      this.tasks = respData.tasks;
      this.fetchBarChartStats();
      this.fetchLinearChartStats();
    });
  }

  fetchBarChartStats() {
    if (!this.specificTimePeriodInBarChart) {
      for (let task of this.tasks) {
        this.userStatsService.getUserStatsTask(
          this.mockUserId, task.id
        ).subscribe(respData => {
          this.overallStats[task.id] = respData;
          this.updateBarChart();
        });
      }
    } else {
      for (let task of this.tasks) {
        this.userStatsService.getUserStatsTask(
          this.mockUserId, task.id, this.startDateBar, this.endDateBar
        ).subscribe(respData => {
          this.overallStats[task.id] = respData;
          this.updateBarChart();
        });
      }
    }
  }

  fetchLinearChartStats() {
    if (!this.specificTimePeriodInLinearChart) {
      this.fetchLinearChartStatsNoDates();
    } else {
      this.fetchLinearChartStatsDates();
    }
  }

  private fetchLinearChartStatsNoDates() {
    if (this.selectedTaskId == -1) {
      this.userStatsService.getUserStatsListOverall(
        this.mockUserId,
      ).subscribe(respData => {
        this.linearChartStats = respData;
        this.updateLinearChart();
      });
    } else {
      this.userStatsService.getUserStatsListTask(
        this.mockUserId, this.selectedTaskId
      ).subscribe(respData => {
        this.linearChartStats = respData;
        this.updateLinearChart();
      });
    }
  }

  private fetchLinearChartStatsDates() {
    if (this.selectedTaskId == -1) {
      this.userStatsService.getUserStatsListOverall(
        this.mockUserId, this.startDateLinear, this.endDateLinear
      ).subscribe(respData => {
        this.linearChartStats = respData;
        this.updateLinearChart();
      });
    } else {
      this.userStatsService.getUserStatsListTask(
        this.mockUserId, this.selectedTaskId, this.startDateLinear, this.endDateLinear
      ).subscribe(respData => {
        this.linearChartStats = respData;
        this.updateLinearChart();
      });
    }
  }

  onSpecificTimePeriodLinear() {
    this.specificTimePeriodInLinearChart = !this.specificTimePeriodInLinearChart;
    this.fetchLinearChartStats();
  }

  onSpecificTimePeriodBar() {
    this.specificTimePeriodInBarChart = !this.specificTimePeriodInBarChart;
    this.fetchBarChartStats();
  }

  onChangeDateLinear() {
    console.log(this.startDateLinear);
    console.log(this.endDateLinear);
    if (this.endDateLinear != undefined && this.startDateLinear != undefined) {
      this.fetchLinearChartStats();
    }
  }

  /*
  *
  * todo: UPDATE BAR CHART METHOD!!!
  *
  * */
  onChangeDateBar() {
    this.fetchBarChartStats();
  }

  private getBarChartLabels() {
    let labels = [];
    for (let task of this.tasks) {
      labels.push(task.name);
    }
    return labels;
  }

  private getBarChartScores(type: string) {
    let scores = [];
    if (type == 'correct answers') {
      for (let task of this.tasks) {
        scores.push(this.overallStats[task.id].correct);
      }
    } else {
      for (let task of this.tasks) {
        scores.push(this.overallStats[task.id].wrong);
      }
    }
    return scores;
  }

  private updateBarChart() {
    if (this.barChart === undefined) {
      this.barChart = new Chart("myChart", {
        type: 'bar',
        data: {
          labels: this.getBarChartLabels(),
          datasets: [{
            label: 'correct answers',
            data: this.getBarChartScores('correct answers'),
            backgroundColor: '#BB86FC',
            borderColor: '#000000',
            borderWidth: 2,
            borderRadius: 4
          }, {
            label: 'wrong answers',
            data: this.getBarChartScores('wrong answers'),
            backgroundColor: '#52057B',
            borderColor: '#000000',
            borderWidth: 2,
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                color: "#F5F7FA",
                font: {
                  size: 24
                }
              }
            },
            x: {
              ticks: {
                color: "#F5F7FA",
                font: {
                  size: 24
                }
              }
            }
          },
          plugins: {
            legend: {
              labels: {
                font: {
                  size: 24
                },
                color: "#F5F7FA"
              }
            }
          }
        }
      });
    } else {
      this.barChart.data.labels = this.getBarChartLabels();
      this.barChart.data.datasets[0].data = this.getBarChartScores('correct answers');
      this.barChart.data.datasets[1].data = this.getBarChartScores('wrong answers');
      this.barChart.update();
    }
  }

  private getLinearChartLabels() {
    let labels = [];
    for (let stats of this.linearChartStats.statsList) {
      labels.push(stats.date);
    }
    return labels;
  }

  private getLinearChartScores(type: string) {
    let scores = [];
    if (type == 'correct answers') {
      for (let stats of this.linearChartStats.statsList) {
        scores.push(stats.correct);
      }
    } else {
      for (let stats of this.linearChartStats.statsList) {
        scores.push(stats.wrong);
      }
    }
    return scores;
  }

  private updateLinearChart() {
    if (this.linearChart == undefined) {
      this.linearChart = new Chart("linearChart", {
        type: 'line',
        data: {
          labels: this.getLinearChartLabels(),
          datasets: [{
            label: 'correct answers',
            data: this.getLinearChartScores('correct answers'),
            backgroundColor: '#000000',
            borderColor: '#BB86FC',
            borderWidth: 3
          }, {
            label: 'wrong answers',
            data: this.getLinearChartScores('wrong answers'),
            backgroundColor: '#000000',
            borderColor: '#52057B',
            borderWidth: 3
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                color: "#F5F7FA",
                font: {
                  size: 14
                }
              }
            },
            x: {
              ticks: {
                color: "#F5F7FA",
                font: {
                  size: 14
                }
              }
            }
          },
          plugins: {
            legend: {
              labels: {
                font: {
                  size: 24
                },
                color: "#F5F7FA"
              }
            }
          }
        }
      });
    } else {
      this.linearChart.data.labels = this.getLinearChartLabels();
      this.linearChart.data.datasets[0].data = this.getLinearChartScores('correct answers');
      this.linearChart.data.datasets[1].data = this.getLinearChartScores('wrong answers');
      this.linearChart.update();
    }
  }


}
