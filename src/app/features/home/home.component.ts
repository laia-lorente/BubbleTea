import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthService } from '../../core/services/auth.service';
import { BubbleTeaService } from '../../core/services/bubbletea.service';
import { BubbleTeaItem } from '../../shared/models/bubble-tea.model';
import { BubbleTeaFormDialogComponent } from '../../shared/components/bubbletea-form-dialog/bubbletea-form-dialog.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { ProductCardComponent } from './product-card/product-card.component';

@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, ProductCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly bubbleTeaService = inject(BubbleTeaService);
  private readonly dialog = inject(MatDialog);

  protected readonly user = this.authService.currentUser;
  protected readonly products = this.bubbleTeaService.items;

  async ngOnInit(): Promise<void> {
    await this.bubbleTeaService.getAllBubbleTeas();
  }

  protected async openCreateDialog(): Promise<void> {
    const result = await firstValueFrom(
      this.dialog.open(BubbleTeaFormDialogComponent, { data: null, width: '420px' }).afterClosed(),
    );
    if (result) {
      await this.bubbleTeaService.createBubbleTea(result);
      await this.bubbleTeaService.getAllBubbleTeas();
    }
  }

  protected async openEditDialog(item: BubbleTeaItem): Promise<void> {
    const result = await firstValueFrom(
      this.dialog.open(BubbleTeaFormDialogComponent, { data: item, width: '420px' }).afterClosed(),
    );
    if (result?.id) {
      await this.bubbleTeaService.updateBubbleTea(result.id, result);
      await this.bubbleTeaService.getAllBubbleTeas();
    }
  }

  protected async openDeleteDialog(item: BubbleTeaItem): Promise<void> {
    const confirmed = await firstValueFrom(
      this.dialog
        .open(ConfirmDialogComponent, {
          data: { message: `¿Eliminar "${item.name}"? Se marcará como no disponible.` },
        })
        .afterClosed(),
    );
    if (confirmed && item.id) {
      await this.bubbleTeaService.deleteBubbleTea(item.id);
      await this.bubbleTeaService.getAllBubbleTeas();
    }
  }

  protected async logout(): Promise<void> {
    await this.authService.signOut();
  }
}
