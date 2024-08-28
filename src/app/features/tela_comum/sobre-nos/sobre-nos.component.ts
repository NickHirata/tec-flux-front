import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CarouselModule } from 'primeng/carousel';

@Component({
  selector: 'app-sobre-nos',
  standalone: true,
  imports: [CarouselModule, ButtonModule, RouterModule],
  templateUrl: './sobre-nos.component.html',
  styleUrl: './sobre-nos.component.scss'
})
export class SobreNosComponent {

}
