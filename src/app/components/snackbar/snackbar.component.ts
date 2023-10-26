import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-snackbar',
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.scss']
})
export class SnackbarComponent implements OnInit {
  @Input() data: string = 'Error';
  @Input() type: 'success' | 'warning' | 'error' = 'warning';
  public show: boolean = false;

  constructor() {
  }

  ngOnInit(): void {
  }

  public close(): void {
    this.show = false;
  }

  public open(data: string, type: 'success' | 'warning' | 'error'): void {
    console.log('open');
    this.data = data;
    this.type = type;
    
    this.show = true;
    setTimeout(() => {
      this.close();
    }, 5000);
  }
}
