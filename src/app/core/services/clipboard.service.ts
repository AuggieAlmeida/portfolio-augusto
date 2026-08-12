import { Injectable } from '@angular/core';

/**
 * Copiar texto sem depender só da Clipboard API: ela exige contexto seguro e
 * pode ser negada por permissão. Quando falha, o fallback com `execCommand`
 * ainda funciona, e quando nem ele funciona quem chama precisa saber — a UI
 * avisa em vez de fingir que copiou.
 */
@Injectable({ providedIn: 'root' })
export class ClipboardService {
  async copy(value: string): Promise<boolean> {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
        return true;
      }
    } catch {
      // Permissão negada ou contexto inseguro: cai no caminho antigo.
    }

    return this.copyWithExecCommand(value);
  }

  /** Depreciado, mas é o único caminho fora de contexto seguro. */
  private copyWithExecCommand(value: string): boolean {
    const area = document.createElement('textarea');
    area.value = value;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();

    try {
      return document.execCommand('copy');
    } catch {
      return false;
    } finally {
      area.remove();
    }
  }
}
