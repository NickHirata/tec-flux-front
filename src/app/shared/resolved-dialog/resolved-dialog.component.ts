import { Component } from '@angular/core';


@Component({
  selector: 'app-resolved-dialog',
  templateUrl: './resolved-dialog.component.html',
  styleUrls: ['./resolved-dialog.component.scss']
})
export class ResolvedDialogComponent {
  resolutionText: string = '';
  image: any = null;

  constructor() {}

  // Método para salvar a resolução
  saveResolution() {
    console.log('Resolução:', this.resolutionText);
    // Lógica para salvar a resolução
  }
}