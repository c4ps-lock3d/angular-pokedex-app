import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
// Angular Material
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-page-not-found',
  imports: [RouterLink, MatCardModule],
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.css']
})
export class PageNotFoundComponent {

}
