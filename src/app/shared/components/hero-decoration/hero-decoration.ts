import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/**
 * Deko fuer Public-Hero-Bereiche: Foto oben rechts + Blob dahinter.
 * Positionierung 1:1 wie auf der Home-Seite (Foto 720px, Blob 840px bei 1440px).
 *
 * Voraussetzungen an die Seite:
 *  - der umschliessende `.container` braucht `relative` und
 *    `max-[1900px]:overflow-x-hidden`, damit der Blob nicht horizontal
 *    aus dem Viewport scrollt.
 *  - die Hero-Section darueber braucht `relative z-2` und genug `mb-*`
 *    (Home: `mb-112.5`), damit der Folgeinhalt unter der Deko durchlaeuft.
 *  - der Inhalt nach der Deko braucht `relative z-3`.
 *
 * @example
 * <div class="container bg-app-bg relative flex flex-col gap-37.5 pb-37.5 max-[1900px]:overflow-x-hidden">
 *   <section class="pt-20 mb-112.5 relative z-2 max-md:pt-30">...</section>
 *   <app-hero-decoration />
 *   <section class="relative z-3">...</section>
 * </div>
 */
@Component({
  selector: 'app-hero-decoration',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClass()',
  },
  template: `
    <div class="w-full flex justify-end relative z-2 right-25">
      <img
        [src]="imageSrc()"
        [alt]="imageAlt()"
        class="w-[60%] h-auto object-contain max-md:hidden"
      />
    </div>
    <div class="absolute -bottom-87.5 -right-45 z-1 w-[70%]">
      <img
        src="/assets/elements/blob.svg"
        alt=""
        aria-hidden="true"
        class="w-full h-auto max-md:hidden"
      />
    </div>
  `,
})
export class HeroDecoration {
  /** Foto oben rechts. */
  readonly imageSrc = input('/assets/images/group.png');
  readonly imageAlt = input('Pfadi Gruppe');

  /**
   * Vertikaler Versatz, falls eine Seite einen hoeheren/tieferen Hero hat.
   * Immer beide Werte angeben, z.B. 'top-30 max-md:top-40'.
   */
  readonly topClass = input('top-15 max-md:top-25');

  protected readonly hostClass = computed(
    () =>
      `absolute right-0 w-full max-w-300 z-1 pointer-events-none max-md:opacity-70 ${this.topClass()}`,
  );
}
