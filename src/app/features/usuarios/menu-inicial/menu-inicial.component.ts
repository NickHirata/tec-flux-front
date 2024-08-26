import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-menu-inicial',
  standalone: true,
  imports: [RouterLink, RouterLinkActive  ],
  templateUrl: './menu-inicial.component.html',
  styleUrl: './menu-inicial.component.scss'
})
export class MenuInicialComponent {

}
