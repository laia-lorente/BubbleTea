import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BubbleTeaItem } from '../../../shared/models/bubble-tea.model';

export function buildBubbleTeaForm(fb: FormBuilder, data: BubbleTeaItem | null) {
  return fb.group({
    name: [data?.name ?? '', Validators.required],
    temperature: [data?.temperature ?? 'cold', Validators.required],
    precio: [data?.precio ?? 0, [Validators.required, Validators.min(0.01)]],
    active: [data?.active ?? true],
  });
}

@Component({
  selector: 'app-bubbletea-form-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
  ],
  templateUrl: './bubbletea-form-dialog.component.html',
})
export class BubbleTeaFormDialogComponent {
  private dialogRef = inject(MatDialogRef<BubbleTeaFormDialogComponent>);
  readonly data: BubbleTeaItem | null = inject(MAT_DIALOG_DATA);
  private fb = inject(FormBuilder);

  readonly form = buildBubbleTeaForm(this.fb, this.data);
  readonly isEdit = !!this.data?.id;

  submit(): void {
    if (this.form.invalid) return;
    this.dialogRef.close({ ...this.form.value, id: this.data?.id });
  }

  cancel(): void {
    this.dialogRef.close(null);
  }
}
