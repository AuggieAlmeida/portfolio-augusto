import { Injectable } from '@angular/core';

/** Evita que um overlay libere a rolagem enquanto outro ainda está aberto. */
@Injectable({ providedIn: 'root' })
export class ScrollLockService {
  private readonly owners = new Set<string>();
  private previousOverflow = '';

  lock(owner: string): void {
    if (!this.owners.size) this.previousOverflow = document.body.style.overflow;
    this.owners.add(owner);
    document.body.style.overflow = 'hidden';
  }

  unlock(owner: string): void {
    this.owners.delete(owner);
    if (!this.owners.size) document.body.style.overflow = this.previousOverflow;
  }
}
