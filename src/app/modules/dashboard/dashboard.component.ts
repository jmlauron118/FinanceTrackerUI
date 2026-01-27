import { Component, ViewChild, ViewEncapsulation, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common'; 
import { DashboardService } from '@services/dashboard/dashboard.service';
import { SummaryResponseDto } from '@interfaces/dashboard/summary-response-dto';
import { SnackbarService } from '@services/snackbar.service';
import { RecentTransactionsDto } from '@interfaces/dashboard/recent-transactions-dto';
import { ApexChartModule } from 'app/shared/apex-chart/apex-chart.module';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexNonAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexYAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexStroke,
  ApexGrid,
  ApexTooltip,
  ApexPlotOptions,
  ApexLegend
} from "ng-apexcharts";
import { YtdIncomeResponseDto } from '@interfaces/dashboard/ytd-income-response-dto';
import { MonthlyBudgetDto } from '@interfaces/dashboard/monthly-budget-dto';
import { ExpensesByCategoryDto } from '@interfaces/dashboard/expenses-by-category-dto';

export type YTDIncomeChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
  tooltip: ApexTooltip;
  colors: string[];
};

export type MonthlyBudgetChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  plotOptions: ApexPlotOptions;
  labels: any;
  legend: ApexLegend,
  tooltip: ApexTooltip;
  colors: string[];
};

export type ExpensesByCategoryChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  plotOptions: ApexPlotOptions;
  labels: any;
  legend: ApexLegend,
  tooltip: ApexTooltip;
  colors: string[];
};

export type ActivityChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
  colors: string[];
};

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, ApexChartModule],
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent {
  @ViewChild("ytdMonthlyChart") ytdMonthlyChart!: ChartComponent;
  @ViewChild("monthlyBudgetChart") monthlyBudgetChart!: ChartComponent;
  @ViewChild("expensesByCategoryChart") expensesByCategoryChart!: ChartComponent;
  @ViewChild("activityChart") activityChart!: ChartComponent;

  public ytdIncomeChartOptions!: Partial<YTDIncomeChartOptions>;
  public monthlyBudgetChartOptions!: Partial<MonthlyBudgetChartOptions>;
  public expensesByCategoryChartOptions!: Partial<ExpensesByCategoryChartOptions>;
  public activityChartOptions!: Partial<ActivityChartOptions>;
  public isBrowser: boolean = false;

  title = 'Dashboard';
  summaryData: SummaryResponseDto | null = null;
  recentTransactionData: RecentTransactionsDto[] = [];
  monthlyBudgetData: MonthlyBudgetDto | null = null;

  constructor(
    private dashboardService: DashboardService,
    private snackbar: SnackbarService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { 
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    this.getSummary();
    this.getRecentTransactions();
    if (this.isBrowser) {
      this.getYTDIncome();
      this.getMonthlyBudget();
      this.getExpensesByCategory();
    }
    this.getActivity();
  }

  getSummary(): void { 
    this.dashboardService.getSummary().subscribe({
      next: (response) => {
        this.summaryData = response.data;
      },
      error: (error) => {
        this.snackbar.danger(error, 5000);
      }
    });
  }

  getRecentTransactions(): void {
    this.dashboardService.getRecentTransactions().subscribe({
      next: (response) => {
        this.recentTransactionData = response.data;
      },
      error: (error) => {
        this.snackbar.danger(error, 5000);
      }
    });
  }

  getYTDIncome(): void {
    this.dashboardService.getYTDIncome().subscribe(async response => {
      const incomeData = response.data;

      this.ytdIncomeChartOptions = {
        series: [{ name: 'YTD Income', data: incomeData.map((item: YtdIncomeResponseDto) => item.totalIncome) }],
        chart: { type: 'line', height: 350, zoom: { enabled: false } },
        colors: ['#2b6777'],
        stroke: { curve: 'straight' },
        title: { text: 'Year-to-Date Income', align: 'left' },
        xaxis: { categories: incomeData.map((item: YtdIncomeResponseDto) => item.month)},
        yaxis: {
          labels: { 
            formatter: (val: number) => `₱${val.toLocaleString()}`
          }
        },
        tooltip: {
          y: { formatter: (val: number) => `₱${val.toLocaleString()}` }
        }
      };
    });
  }

  getMonthlyBudget(): void {
    this.dashboardService.getMonthlyBudget().subscribe(response => {
      const budgetData = response.data;

      this.monthlyBudgetData = budgetData;

      this.monthlyBudgetChartOptions = {
        series: [budgetData.totalIncome, budgetData.totalSavings, budgetData.totalExpenses],
        chart: { type: 'donut' },
        legend: {
          position: "bottom"
        },
        tooltip: {
          theme: "light",
          y: { formatter: (val: number) => `₱${val.toLocaleString()}` },
          fillSeriesColor: false
        },
        plotOptions: {
          pie: {
            donut: {
              labels: {
                show: true,
                name: {
                  show: true,
                  fontSize: '14px',
                },
                value: {
                  show: true,
                  fontSize: '16px',
                  fontWeight: 600,
                  formatter: (val) => {
                    const num = parseFloat(val);
                    return `₱${num.toLocaleString()}`;
                  }
                },
                total: {
                  show: true,
                  label: 'Current Balance',
                  formatter: () => `₱${budgetData.currentBalance.toLocaleString()}`
                }
              }
            }
          }
        },
        labels: ['Income', 'Savings', 'Expenses'],
        colors: ['#2b6777', '#52ab98', '#c8d8e4']
      };
    });
  }

  getExpensesByCategory(): void {
    this.dashboardService.getExpensesByCategory().subscribe(response => {
      const expensesByCategoryData = response.data;

      this.expensesByCategoryChartOptions = {
        series: expensesByCategoryData.map((item: ExpensesByCategoryDto) => item.amount),
        chart: { type: 'pie' },
        legend: {
          position: "bottom"
        },
        tooltip: {
          theme: "light",
          y: { formatter: (val: number) => `₱${val.toLocaleString()}` },
          fillSeriesColor: false
        },
        labels: expensesByCategoryData.map((item: ExpensesByCategoryDto) => item.expenseCategoryName),
        colors: ['#2b6777', '#52ab98', '#c8d8e4', '#1a3e47']
      };
    });
  }

  getActivity(): void {
    this.dashboardService.getActivity().subscribe(response => {
      const activityData = response.data;

      let income = activityData.filter(item => item.category == "Income").sort((a, b) => b.month.localeCompare(a.month)).map(item => item.amount);
      let expenses = activityData.filter(item => item.category == "Expenses").sort((a, b) => b.month.localeCompare(a.month)).map(item => item.amount);
      let monthList = [...new Set(activityData.map(item => new Date(item.month).toLocaleString("en-US", { month: "short" })))];

      this.activityChartOptions = {
        series: [
          {
            name: 'Income',
            data: income
          },
          {
            name: 'Expenses',
            data: expenses
          }
        ],
        chart: {
          type: 'bar',
          height: 500
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '55%',
            borderRadius: 10,
            borderRadiusApplication: 'end'
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          show: true,
          width: 2,
          colors: ["transparent"]
        },
        xaxis: {
          categories: monthList
        },
        fill: {
          opacity: 1
        },
        tooltip: {
          y: { formatter: (val: number) => `₱${val.toLocaleString()}` }
        },
        colors: ['#2b6777', '#52ab98']
      };
    });
  }

  getTransactionIcon(budgetCategoryName: string): string[] {
    const icon: Record<string, string> = {
      'Income': 'fa-money-bill-transfer',
      'Savings': 'fa-piggy-bank',
      'Fixed Expenses': 'fa-list-check',
      'Other Expenses': 'fa-receipt',
    }

    const color: Record<string, string> = {
      'Income': 'bg-main-dark-color',
      'Savings': 'bg-primary-color',
      'Fixed Expenses': 'bg-secondary-color',
      'Other Expenses': 'bg-tertiary-color',
    }

    return [icon[budgetCategoryName], color[budgetCategoryName]];
  }
}
