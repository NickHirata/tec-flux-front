import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app-popup.component.html',
  styleUrls: ['./app-popup.component.scss'],
})
export class PopupComponent {
  @Input() message: string = '';
  @Input() isError: boolean = false;
  @Input() show: boolean = false;

  closePopup() {
    this.show = false;
  }
}
