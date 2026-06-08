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
      @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap');

      :host {
        --bg-card: #1c2a1f;
        --accent-green: #a8e063;
        --accent-gold: #c9a84c;
        --text-primary: #e8f0e9;
        --text-secondary: #7a9c7e;
        --border: rgba(168, 224, 99, 0.12);
      }

      .card {
        height: 100%;
        background: var(--bg-card) !important;
        border: 1px solid var(--border) !important;
        border-radius: 12px !important;
        box-shadow: none !important;
        transition:
          transform 0.25s ease,
          border-color 0.25s ease,
          box-shadow 0.25s ease;
        color: var(--text-primary) !important;
        font-family: 'DM Sans', sans-serif;
      }

      .card:hover {
        transform: translateY(-3px);
        border-color: rgba(168, 224, 99, 0.3) !important;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(168, 224, 99, 0.08) !important;
      }

      .price {
        font-family: 'DM Serif Display', serif;
        font-size: 1.75rem;
        font-weight: 400;
        font-style: italic;
        color: var(--accent-green);
        margin: 0.75rem 0 0;
        letter-spacing: -0.01em;
      }

      .temp {
        font-size: 0.78rem;
        font-weight: 300;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        color: var(--text-secondary);
      }

      .chip-available {
        --mdc-chip-elevated-container-color: rgba(168, 224, 99, 0.1);
        --mdc-chip-label-text-color: #a8e063;
        border: 1px solid rgba(168, 224, 99, 0.25) !important;
        font-size: 0.72rem !important;
        letter-spacing: 0.05em;
      }

      .chip-unavailable {
        --mdc-chip-elevated-container-color: rgba(255, 255, 255, 0.04);
        --mdc-chip-label-text-color: #4a6350;
        border: 1px solid rgba(255, 255, 255, 0.06) !important;
        font-size: 0.72rem !important;
        letter-spacing: 0.05em;
      }

      .actions-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        padding-top: 0.25rem;
        border-top: 1px solid var(--border);
        margin-top: 0.25rem;
      }

      .icon-actions {
        display: flex;
        gap: 0.1rem;
      }

      .icon-actions button {
        color: var(--text-secondary) !important;
        transition: color 0.15s ease !important;
      }

      .icon-actions button:hover {
        color: var(--accent-green) !important;
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
