import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CarouselModule } from 'primeng/carousel';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CarouselModule, ButtonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  getSeverity(status: string): string {
    return status === 'Disponível' ? 'success' : 'danger';
  }

}
