import { FormBuilder } from '@angular/forms';
import { describe, expect, it } from 'vitest';
import { buildBubbleTeaForm } from './bubbletea-form-dialog.component';

const fb = new FormBuilder();

describe('buildBubbleTeaForm', () => {
  it('is invalid when name is empty', () => {
    const form = buildBubbleTeaForm(fb, null);
    form.controls.name.setValue('');
    expect(form.controls.name.invalid).toBe(true);
  });

  it('is invalid when precio is 0', () => {
    const form = buildBubbleTeaForm(fb, null);
    form.controls.precio.setValue(0);
    expect(form.controls.precio.invalid).toBe(true);
  });

  it('is valid with all required fields filled', () => {
    const form = buildBubbleTeaForm(fb, null);
    form.controls.name.setValue('Taro Milk Tea');
    form.controls.precio.setValue(4.5);
    expect(form.valid).toBe(true);
  });

  it('pre-fills values from existing item', () => {
    const item = { id: 1, name: 'Matcha', temperature: 'hot' as const, precio: 5, active: false };
    const form = buildBubbleTeaForm(fb, item);
    expect(form.controls.name.value).toBe('Matcha');
    expect(form.controls.temperature.value).toBe('hot');
    expect(form.controls.active.value).toBe(false);
  });
});
