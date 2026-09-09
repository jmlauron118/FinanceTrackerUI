import { Component, ViewChild, ViewEncapsulation, Inject, PLATFORM_ID } from '@angular/core';
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
  ApexLegend,
  ApexMarkers,
  ApexTheme
} from "ng-apexcharts";
import { YtdIncomeResponseDto } from '@interfaces/dashboard/ytd-income-response-dto';
import { MonthlyBudgetDto } from '@interfaces/dashboard/monthly-budget-dto';
import { ExpensesByCategoryDto } from '@interfaces/dashboard/expenses-by-category-dto';
import { YtdSavingsResponseDto } from '@interfaces/dashboard/ytd-savings-response.dto';
import { SavingsService } from '@services/savings/savings.service';
import { SavingsSummaryResponseDto } from '@interfaces/savings/savings-transaction/savings-summary-response-dto';
import { ThemeService } from '@services/theme.service';
import { ActivityDto } from '@interfaces/dashboard/activity-dto';
import { finalize } from 'rxjs';

export type ChartOptions = {
  series: ApexAxisChartSeries | ApexNonAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  theme: ApexTheme;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
  tooltip: ApexTooltip;
  colors: string[];
  plotOptions: ApexPlotOptions;
  labels: any;
  legend: ApexLegend;
  markers: ApexMarkers;
  fill: ApexFill;
}

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
  @ViewChild("ytdSavingsChart") ytdSavingsChart!: ChartComponent;
  @ViewChild("savingsChart") savingsChart!: ChartComponent;

  public ytdIncomeChartOptions!: Partial<ChartOptions>;
  public monthlyBudgetChartOptions!: Partial<ChartOptions>;
  public expensesByCategoryChartOptions!: Partial<ChartOptions>;
  public activityChartOptions!: Partial<ChartOptions>;
  public ytdSavingsChartOptions!: Partial<ChartOptions>;
  public savingsChartOptions!: Partial<ChartOptions>;
  public isBrowser: boolean = false;

  title = 'Dashboard';
  currentTheme = 'light';
  ytdIncomeData: YtdIncomeResponseDto[] = [];
  summaryData: SummaryResponseDto | null = null;
  recentTransactionData: RecentTransactionsDto[] = [];
  monthlyBudgetData: MonthlyBudgetDto | null = null;
  expensesByCategoryData: ExpensesByCategoryDto[] = [];
  ytdSavingsData: YtdSavingsResponseDto[] = [];
  savingSummaryData: SavingsSummaryResponseDto | null = null;
  activityData: ActivityDto[] = [];
  isSummaryLoading = false;
  isRecentTransactionsLoading = false;
  isYtdIncomeLoading = false;
  isMonthlyBudgetLoading = false;
  isExpensesByCategoryLoading = false;
  isYtdSavingsLoading = false;
  isSavingsSummaryLoading = false;
  isActivityLoading = false;

  constructor(
    private dashboardService: DashboardService,
    private snackbar: SnackbarService,
    private savingsService: SavingsService,
    private theme: ThemeService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { 
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    this.theme.theme$.subscribe(theme => {
      this.currentTheme = theme;

      if (this.ytdIncomeData.length) {
        this.buildYtdIncomeChart(theme);
      }

      if (this.monthlyBudgetData) {
        this.buildMonthlyBudgetChart(theme);
      }

      if (this.expensesByCategoryData.length) {
        this.buildExpensesByCategoryChart(theme);
      }

      if (this.ytdSavingsData.length) {
        this.buildYTDSavingsChart(theme);
      }

      if(this.savingSummaryData) {
        this.buildSavingsSummaryChart(theme);
      }

      if(this.activityData.length) {
        this.buildActivityChart(theme);
      }
    });

    this.getSummary();

    if (this.isBrowser) {
      this.getYTDIncome();
      this.getMonthlyBudget();
      this.getRecentTransactions();
      this.getExpensesByCategory();
      this.getYTDSavings();
      this.getSavingsSummary();
    }

    this.getActivity();
  }

  getSummary(): void { 
    this.isSummaryLoading = true;
    this.dashboardService.getSummary().pipe(finalize(() => this.isSummaryLoading = false)).subscribe({
      next: (response) => {
        this.summaryData = response.data;
      },
      error: (error) => {
        this.snackbar.danger(error, 5000);
      }
    });
  }

  getRecentTransactions(): void {
    this.isRecentTransactionsLoading = true;
    this.dashboardService.getRecentTransactions().pipe(finalize(() => this.isRecentTransactionsLoading = false)).subscribe({
      next: (response) => {
        this.recentTransactionData = response.data;
      },
      error: (error) => {
        this.snackbar.danger(error, 5000);
      }
    });
  }

  private buildYtdIncomeChart(theme: string): void {
    const isDarkMode = theme === 'dark';

    this.ytdIncomeChartOptions = {
      series: [
        {
          name: 'YTD Income',
          data: this.ytdIncomeData.map(x => x.totalIncome)
        }
      ],
      chart: {
        type: 'line',
        height: 350,
        zoom: { enabled: false },
        foreColor: isDarkMode ? '#fff' : '#000'
      },
      colors: ['#2b6777'],
      stroke: { curve: 'straight' },
      theme: {
        mode: isDarkMode ? 'dark' : 'light',
        palette: 'palette1'
      },
      title: {
        text: 'Year-to-Date Income',
        align: 'left'
      },
      xaxis: {
        categories: this.ytdIncomeData.map(x => x.month)
      },
      yaxis: {
        labels: {
          formatter: (val: number) => `₱${val.toLocaleString()}`
        }
      },
      tooltip: {
        theme: isDarkMode ? 'dark' : 'light',
        y: {
          formatter: (val: number) => `₱${val.toLocaleString()}`
        }
      }
    };
  }

  private buildMonthlyBudgetChart(theme: string): void {
    const isDarkMode = theme === 'dark';
    
    this.monthlyBudgetChartOptions = {
        series: [this.monthlyBudgetData?.currentBalance ?? 0, this.monthlyBudgetData?.totalSavings ?? 0, this.monthlyBudgetData?.totalExpenses ?? 0],
        chart: { 
          foreColor: isDarkMode ? '#fff' : '#000', 
          type: 'donut' 
        },
        theme: {
          mode: isDarkMode ? 'dark' : 'light',
          palette: 'palette1'
        },
        legend: {
          position: "bottom"
        },
        tooltip: {
          theme: isDarkMode ? 'dark' : 'light',
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
                  label: 'Total Income',
                  formatter: () => `₱${this.monthlyBudgetData?.totalIncome?.toLocaleString()}`
                }
              }
            }
          }
        },
        labels: ['Current Balance', 'Savings', 'Expenses'],
        colors: ['#2b6777', '#52ab98', '#c8d8e4']
      };
  }

  private buildExpensesByCategoryChart(theme: string): void {
    const isDarkMode = theme === 'dark';

    this.expensesByCategoryChartOptions = {
        series: this.expensesByCategoryData.map((item: ExpensesByCategoryDto) => item.amount),
        chart: { 
          type: 'pie',
          foreColor: isDarkMode ? '#fff' : '#000'
         },
        theme: {
          mode: isDarkMode ? 'dark' : 'light',
          palette: 'palette1'
        },
        legend: {
          position: "bottom"
        },
        tooltip: {
          theme: isDarkMode ? 'dark' : 'light',
          y: { formatter: (val: number) => `₱${val.toLocaleString()}` },
          fillSeriesColor: false
        },
        labels: this.expensesByCategoryData.map((item: ExpensesByCategoryDto) => item.expenseCategoryName),
        colors: ['#2b6777', '#52ab98', '#c8d8e4', '#1a3e47']
      };
  }

  private buildYTDSavingsChart(theme: string): void {
    const isDarkMode = theme === 'dark';

    this.ytdSavingsChartOptions = {
      series: [{
        name: 'YTD Savings', 
        data: this.ytdSavingsData.map((item: YtdSavingsResponseDto) => item.totalSavings)
      }],
      chart: { 
        type: 'line',
        foreColor: isDarkMode ? '#fff' : '#000', 
        height: 350, 
        zoom: { enabled: false }
      },
      theme: {
        mode: isDarkMode ? 'dark' : 'light',
        palette: 'palette1'
      },
      markers: {
        size: 6,
        hover: {
          size: 10
        }
      },
      colors: ['#2b6777'],
      stroke: { curve: 'straight' },
      xaxis: { categories: this.ytdSavingsData.map((item: YtdSavingsResponseDto) => item.month)},
      yaxis: {
        labels: { 
          formatter: (val: number) => `₱${val.toLocaleString()}`
        }
      },
      tooltip: {
        theme: isDarkMode ? 'dark' : 'light',
      }
    };
  }

  private buildSavingsSummaryChart(theme: string): void {
    const isDarkMode = theme === 'dark';

    this.savingsChartOptions = {
      series: [this.savingSummaryData?.remainingSavings ?? 0, this.savingSummaryData?.totalExpenses ?? 0, this.savingSummaryData?.totalInvestment ?? 0, this.savingSummaryData?.totalGains ?? 0],
      chart: { 
        type: 'donut',
        foreColor: isDarkMode ? '#fff' : '#000',
       },
      theme: {
        mode: isDarkMode ? 'dark' : 'light',
        palette: 'palette1' 
      },
      legend: {
        position: "bottom"
      },
      tooltip: {
        theme: isDarkMode ? 'dark' : 'light',
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
                label: 'Total Savings',
                formatter: () => `₱${this.savingSummaryData?.totalSavings?.toLocaleString() ?? 0}`
              }
            }
          }
        }
      },
      labels: ['Current Savings', 'Expenses', 'Investments', 'Earnings'],
      colors: ['#344038', '#2b6777', '#52ab98', '#c8d8e4']
    };
  }

  private buildActivityChart(theme: string): void {
    const isDarkMode = theme === 'dark';

    let income = this.activityData.filter(item => item.category == "Income").sort((a, b) => a.month.localeCompare(b.month)).map(item => item.amount);
    let expenses = this.activityData.filter(item => item.category == "Expenses").sort((a, b) => a.month.localeCompare(b.month)).map(item => item.amount);
    let monthList = [...new Set(this.activityData.map(item => new Date(item.month).toLocaleString("en-US", { month: "short" })))];

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
        foreColor: isDarkMode ? '#fff' : '#000',
        height: 500
      },
      theme: {
        mode: isDarkMode ? 'dark' : 'light',
        palette: 'palette1'
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
      yaxis: {
        labels: { 
          formatter: (val: number) => `₱${val.toLocaleString()}`
        }
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        theme: isDarkMode ? 'dark' : 'light'
      },
      colors: ['#2b6777', '#52ab98']
    };
  }

  getYTDIncome(): void {
    this.isYtdIncomeLoading = true;
    this.dashboardService.getYTDIncome().pipe(finalize(() => this.isYtdIncomeLoading = false)).subscribe({
      next: response => {
        this.ytdIncomeData = response.data;
        this.buildYtdIncomeChart(this.theme.currentTheme);
      },
      error: error => this.snackbar.danger(error, 5000)
    });
  }

  getMonthlyBudget(): void {
    this.isMonthlyBudgetLoading = true;
    this.dashboardService.getMonthlyBudget().pipe(finalize(() => this.isMonthlyBudgetLoading = false)).subscribe({
      next: response => {
        this.monthlyBudgetData = response.data;
        this.buildMonthlyBudgetChart(this.theme.currentTheme);
      },
      error: error => this.snackbar.danger(error, 5000)
    });
  }

  getExpensesByCategory(): void {
    this.isExpensesByCategoryLoading = true;
    this.dashboardService.getExpensesByCategory().pipe(finalize(() => this.isExpensesByCategoryLoading = false)).subscribe({
      next: response => {
        this.expensesByCategoryData = response.data;
        this.buildExpensesByCategoryChart(this.theme.currentTheme);
      },
      error: error => this.snackbar.danger(error, 5000)
    });
  }

  getYTDSavings(): void {
    this.isYtdSavingsLoading = true;
    this.dashboardService.getYTDSavings().pipe(finalize(() => this.isYtdSavingsLoading = false)).subscribe({
      next: response => {
        this.ytdSavingsData = response.data;
        this.buildYTDSavingsChart(this.theme.currentTheme);
      },
      error: error => this.snackbar.danger(error, 5000)
    });
  }

  getSavingsSummary(): void {
    this.isSavingsSummaryLoading = true;
    this.savingsService.getSavingsSummary().pipe(finalize(() => this.isSavingsSummaryLoading = false)).subscribe({
      next: response => {
        this.savingSummaryData = response.data;
        this.buildSavingsSummaryChart(this.theme.currentTheme);
      },
      error: error => this.snackbar.danger(error, 5000)
    });
  }

  getActivity(): void {
    this.isActivityLoading = true;
    this.dashboardService.getActivity().pipe(finalize(() => this.isActivityLoading = false)).subscribe({
      next: response => {
        this.activityData = response.data;
        this.buildActivityChart(this.theme.currentTheme);
      },
      error: error => this.snackbar.danger(error, 5000)
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
