import { DatePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { RandoService } from '../../rando.service';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-rando-profile',
  imports: [RouterLink, MatButtonModule, MatCardModule, MatGridListModule, MatProgressSpinnerModule, MatFormFieldModule, MatInputModule, MatIconModule, MatChipsModule, MatDialogModule],
  templateUrl: './rando-profile.component.html',
  styleUrls: ['./rando-profile.component.css']
})

export class RandoProfileComponent {
  readonly #route = inject(ActivatedRoute);
  readonly #router = inject(Router);
  readonly #randoService = inject(RandoService);
  readonly #randoId = Number(this.#route.snapshot.paramMap.get('id'));

  // 3 cas : requête en cours, requête OK, requête erreur
  readonly #randoResponse = toSignal(
    this.#randoService.getRandoById(this.#randoId).pipe(
      map((rando) => ({ value: rando, error: undefined})),
      catchError((error) => of({ value: undefined, error }))
    )
  );

  readonly loading = computed(() => this.#randoResponse() === undefined);
  readonly error = computed(() => this.#randoResponse()?.error !== undefined); // ? = shining operator -> si le chemin n'existe pas, retourne undefined
  readonly rando = computed(() => this.#randoResponse()?.value);
  readonly #dialog = inject(MatDialog);
  
  deleteRando() {
    this.#randoService.deleteRando(this.#randoId).subscribe(() => {
      this.#router.navigate(['/randos']);
    });
  }

  openDeleteDialog() {
    const dialogRef = this.#dialog.open(ConfirmDialogComponent, {
      height: 'auto',
      width: 'auto',
      data: {
        title: 'Supprimer la Rando',
        message: 'Êtes‑vous sûr de vouloir supprimer cette Rando ?'
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.deleteRando();
      }
    });
  }
}