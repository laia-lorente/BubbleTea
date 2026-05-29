import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthService } from '../../core/services/auth.service';
import { BubbleTeaService } from '../../core/services/bubbletea.service';
import { ProductCardComponent } from './product-card/product-card.component';

@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatToolbarModule, MatButtonModule, ProductCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly bubbleTeaService = inject(BubbleTeaService);

  protected user = this.authService.currentUser;
  protected products = this.bubbleTeaService.items;

  async ngOnInit(): Promise<void> {
    await this.bubbleTeaService.getAllBubbleTeas();
  }

  protected async logout(): Promise<void> {
    await this.authService.signOut();
  }
}
