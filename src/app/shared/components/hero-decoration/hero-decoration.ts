import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-hero-decoration',
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
  readonly imageSrc = input('/assets/images/group.png');
  readonly imageAlt = input('Pfadi Gruppe');

  readonly topClass = input('top-15 max-md:top-25');

  protected readonly hostClass = computed(
    () =>
      `absolute right-0 w-full max-w-300 z-1 pointer-events-none max-md:opacity-70 ${this.topClass()}`,
  );
}
