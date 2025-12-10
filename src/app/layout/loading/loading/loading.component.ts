import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingService } from '@services/loading.service';

@Component({
  selector: 'app-loading',
  imports: [CommonModule],
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LoadingComponent {
  loading$!: any;

  constructor (
    private loadingService: LoadingService
  ) {
    this.loading$ = this.loadingService.loading$;
  }
}
