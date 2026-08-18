import { Injectable, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';

const SITE_NAME = 'Pfadi St. Justus Flums';

/**
 * Haengt den Seitennamen an den Routentitel an, damit jede Seite einen eigenen
 * `document.title` hat (WCAG 2.4.2). Die Routen tragen dadurch nur den kurzen
 * Titel, z.B. `title: 'Pfadihaus'` -> "Pfadihaus · Pfadi St. Justus Flums".
 *
 * Wird ueber das `TitleStrategy`-Token bereitgestellt, ist also bewusst kein
 * `@Service`-Singleton.
 */
@Injectable()
export class AppTitleStrategy extends TitleStrategy {
  private readonly title = inject(Title);

  override updateTitle(snapshot: RouterStateSnapshot): void {
    const page = this.buildTitle(snapshot);
    this.title.setTitle(page ? `${page} · ${SITE_NAME}` : SITE_NAME);
  }
}
