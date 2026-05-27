import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { BubbleTeaItem } from '../../../shared/models/bubble-tea.model';

@Component({
  selector: 'app-product-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatCardModule, MatChipsModule, CurrencyPipe],
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
        box-shadow: 0 8px 24px rgba(59, 91, 219, 0.15);
      }
      .price {
        font-size: 1.5rem;
        font-weight: 700;
        color: #3b5bdb;
        margin: 0.5rem 0 0;
      }
      .temp {
        font-size: 0.875rem;
      }
      .chip-available {
        --mdc-chip-elevated-container-color: #d1fae5;
        --mdc-chip-label-text-color: #065f46;
      }
      .chip-unavailable {
        --mdc-chip-elevated-container-color: #f3f4f6;
        --mdc-chip-label-text-color: #6b7280;
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
              ☀️ Caliente/Frío
            }
          </span>
        </mat-card-subtitle>
      </mat-card-header>
      <mat-card-content>
        <p class="price">{{ item().precio | currency: 'EUR' }}</p>
      </mat-card-content>
      <mat-card-actions>
        <mat-chip-set aria-label="Disponibilidad del producto">
          <mat-chip [class]="item().active ? 'chip-available' : 'chip-unavailable'">
            {{ item().active ? 'Disponible' : 'No disponible' }}
          </mat-chip>
        </mat-chip-set>
      </mat-card-actions>
    </mat-card>
  `,
})
export class ProductCardComponent {
  readonly item = input.required<BubbleTeaItem>();
}
