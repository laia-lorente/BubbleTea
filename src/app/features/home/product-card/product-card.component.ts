import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BubbleTeaItem } from '../../../shared/models/bubble-tea.model';

@Component({
  selector: 'app-product-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatCardModule, MatChipsModule, CurrencyPipe, MatIconButton, MatIconModule, MatTooltipModule],
  styles: [
    `
      .card {
        height: 100%;
        transition:
          transform 0.2s ease,
          box-shadow 0.2s ease;
      }
      .card:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(255, 107, 53, 0.15);
      }
      .price {
        font-size: 1.5rem;
        font-weight: 700;
        color: #ff6b35;
        margin: 0.5rem 0 0;
      }
      .temp {
        font-size: 0.875rem;
      }
      .chip-available {
        --mdc-chip-elevated-container-color: #fff0e6;
        --mdc-chip-label-text-color: #d94f00;
      }
      .chip-unavailable {
        --mdc-chip-elevated-container-color: #f3f4f6;
        --mdc-chip-label-text-color: #6b7280;
      }
      .actions-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
      }
      .icon-actions {
        display: flex;
        gap: 0.25rem;
      }
    `,
  ],
  template: `
    <mat-card class="card">
      <mat-card-header>
        <mat-card-title>{{ item().name }}</mat-card-title>
        <mat-card-subtitle>
          <span class="temp">
            @if (item().temperature === 'hot') {
              ☕ Caliente
            } @else if (item().temperature === 'cold') {
              🧊 Frío
            } @else {
              ☀️ Templado
            }
          </span>
        </mat-card-subtitle>
      </mat-card-header>
      <mat-card-content>
        <p class="price">{{ item().precio | currency: 'EUR' }}</p>
      </mat-card-content>
      <mat-card-actions>
        <div class="actions-row">
          <mat-chip-set aria-label="Disponibilidad del producto">
            <mat-chip [class]="item().active ? 'chip-available' : 'chip-unavailable'">
              {{ item().active ? 'Disponible' : 'No disponible' }}
            </mat-chip>
          </mat-chip-set>
          <div class="icon-actions">
            <button
              mat-icon-button
              aria-label="Editar producto"
              matTooltip="Editar"
              (click)="editClicked.emit(item())"
            >
              <mat-icon>edit</mat-icon>
            </button>
            <button
              mat-icon-button
              aria-label="Eliminar producto"
              matTooltip="Eliminar"
              (click)="deleteClicked.emit(item())"
            >
              <mat-icon>delete</mat-icon>
            </button>
          </div>
        </div>
      </mat-card-actions>
    </mat-card>
  `,
})
export class ProductCardComponent {
  readonly item = input.required<BubbleTeaItem>();
  readonly editClicked = output<BubbleTeaItem>();
  readonly deleteClicked = output<BubbleTeaItem>();
}
