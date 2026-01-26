import { Component, ViewChild, ViewEncapsulation, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common'; 
import { DashboardService } from '@services/dashboard/dashboard.service';
import { SummaryResponseDto } from '@interfaces/dashboard/summary-response-dto';
import { SnackbarService } from '@services/snackbar.service';
import { RecentTransactionsDto } from '@interfaces/dashboard/recent-transactions-dto';

export type ChartOptions = {
  series: any;
  chart: any;
  xaxis: any;
  dataLabels: any;
  grid: any;
  stroke: any;
  title: any;
  tooltip: any;
};

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent {
  @ViewChild('chart') chart: any;
  public chartOptions!: Partial<ChartOptions>;
  public isBrowser: boolean = false;
  title = 'Dashboard';
  summaryData: SummaryResponseDto | null = null;
  recentTransactionData: RecentTransactionsDto[] = [];

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
    this.getYTDIncome();
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

  async getYTDIncome(): Promise<void> {
    this.dashboardService.getYTDIncome().subscribe(async response => {
      const incomeData = response.data;

      console.log(incomeData);

      // Ensure ApexCharts is only initialized in the browser
      if (this.isBrowser) {
        const { ChartComponent } = await import('ng-apexcharts'); // Dynamically import the library

        this.chartOptions = {
          series: [{ name: 'YTD Income', data: incomeData.map(item => item.totalIncome) }],
          chart: { type: 'line', height: 350 },
          dataLabels: { enabled: false },
          stroke: { curve: 'smooth' },
          title: { text: 'Year To Date Income', align: 'left' },
          grid: { row: { colors: ['#f3f3f3', 'transparent'], opacity: 0.5 } },
          xaxis: { categories: incomeData.map(item => item.month) },
          tooltip: {
            y: {
              formatter: (val: number | 0) => `₱${val.toLocaleString()}`
            }
          }
        };
      }
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
      'Income': 'badge-success',
      'Savings': 'badge-info',
      'Fixed Expenses': 'badge-warning',
      'Other Expenses': 'badge-danger',
    }

    return [icon[budgetCategoryName], color[budgetCategoryName]];
  }
}
