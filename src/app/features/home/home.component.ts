import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthService } from '../../core/services/auth.service';
import { BubbleTeaItem } from '../../shared/models/bubble-tea.model';
import { ProductCardComponent } from './product-card/product-card.component';

@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatToolbarModule, MatButtonModule, ProductCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  private authService = inject(AuthService);

  protected user = this.authService.currentUser;

  protected products = signal<BubbleTeaItem[]>([
    { name: 'Taro Milk Tea', temperature: 'cold', precio: 4.5, active: true },
    { name: 'Matcha Latte', temperature: 'hot', precio: 5.0, active: true },
    { name: 'Mango Passion', temperature: 'cold', precio: 4.0, active: true },
    { name: 'Brown Sugar Boba', temperature: 'cold', precio: 5.5, active: true },
    { name: 'Oolong Milk Tea', temperature: 'both', precio: 4.5, active: false },
    { name: 'Strawberry Slush', temperature: 'cold', precio: 4.0, active: true },
  ]);

  protected async logout(): Promise<void> {
    await this.authService.signOut();
  }
}
