import { Component } from '@angular/core';

@Component({
  selector: 'app-loadingspinner',
  styleUrls: ['./loading-spinner.component.css'],
  template: `<div class="lds-roller">
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>`,
})
export class LoadingSpinnerComponent {}
