import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CarouselModule } from 'primeng/carousel';

@Component({
  selector: 'app-trabalhe-conosco',
  standalone: true,
  imports: [CarouselModule, ButtonModule, RouterModule],
  templateUrl: './trabalhe-conosco.component.html',
  styleUrl: './trabalhe-conosco.component.scss'
})
export class TrabalheConoscoComponent {

}
