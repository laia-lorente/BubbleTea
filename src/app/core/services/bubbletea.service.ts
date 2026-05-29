import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { BubbleTeaItem } from '../../shared/models/bubble-tea.model';
import { environment } from '../../../environments/environment';

interface BubbleTeaListResponse {
  bubbleteas: BubbleTeaItem[];
}

@Injectable({ providedIn: 'root' })
export class BubbleTeaService {
  private readonly http = inject(HttpClient);
  private readonly bubbleTeas = signal<BubbleTeaItem[]>([]);
  private readonly apiUrl = environment.apiUrl;

  readonly items = this.bubbleTeas.asReadonly();

  async getAllBubbleTeas(): Promise<BubbleTeaItem[]> {
    const response = await firstValueFrom(
      this.http.get<BubbleTeaListResponse>(`${this.apiUrl}/bubbleteas`),
    );
    this.bubbleTeas.set(response.bubbleteas);
    return response.bubbleteas;
  }

  async getBubbleTeaById(id: number): Promise<BubbleTeaItem> {
    return firstValueFrom(this.http.get<BubbleTeaItem>(`${this.apiUrl}/bubbleteas/${id}`));
  }

  async createBubbleTea(bubbletea: BubbleTeaItem): Promise<BubbleTeaItem> {
    const created = await firstValueFrom(
      this.http.post<BubbleTeaItem>(`${this.apiUrl}/bubbleteas`, bubbletea),
    );
    this.bubbleTeas.update(items => [...items, created]);
    return created;
  }

  async updateBubbleTea(id: number, bubbletea: BubbleTeaItem): Promise<BubbleTeaItem> {
    return firstValueFrom(
      this.http.put<BubbleTeaItem>(`${this.apiUrl}/bubbleteas/${id}`, bubbletea),
    );
  }

  async deleteBubbleTea(id: number): Promise<void> {
    await firstValueFrom(this.http.delete<void>(`${this.apiUrl}/bubbleteas/${id}`));
  }
}
