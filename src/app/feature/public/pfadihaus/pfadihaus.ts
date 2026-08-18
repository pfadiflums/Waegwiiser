import { Component, inject, computed, ChangeDetectionStrategy } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';

interface GalleryImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

interface PfadihausAddress {
  name: string;
  street: string;
  zip: string;
  city: string;
}

interface PfadihausContact {
  email: string;
  phone: string;
  abteilung: string;
  vermietung: string;
}

@Component({
  selector: 'app-pfadihaus',
  imports: [NgOptimizedImage],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './pfadihaus.html',
})
export class PfadihausComponent {
  private readonly sanitizer = inject(DomSanitizer);

  protected readonly heroImage: GalleryImage = {
    src: '/assets/images/pfadihaus/hero.png',
    alt: 'Aussenansicht des Pfadihauses St. Justus mit Wiese im Vordergrund',
    width: 1264,
    height: 641,
  };

  protected readonly galleryImages: GalleryImage[] = [
    { src: '/assets/images/pfadihaus/gallery-1.png', alt: 'Essraum mit langen Tischreihen', width: 410, height: 273 },
    { src: '/assets/images/pfadihaus/gallery-2.png', alt: 'Gang mit Zimmertüren', width: 410, height: 273 },
    { src: '/assets/images/pfadihaus/gallery-3.png', alt: 'Küche mit Arbeitsfläche und Spüle', width: 410, height: 273 },
    { src: '/assets/images/pfadihaus/gallery-4.png', alt: 'Schlafzimmer mit Stockbetten', width: 410, height: 273 },
    { src: '/assets/images/pfadihaus/gallery-4.png', alt: 'Schlafzimmer mit Stockbetten, andere Ansicht', width: 410, height: 273 },
    { src: '/assets/images/pfadihaus/gallery-4.png', alt: 'Weiteres Schlafzimmer mit Stockbetten', width: 410, height: 273 },
  ];

  protected readonly address: PfadihausAddress = {
    name: 'Pfadihaus St. Justus',
    street: 'Gimsastrasse',
    zip: '8890',
    city: 'Flums',
  };

  protected readonly contact: PfadihausContact = {
    email: 'pfadihaus@st-justus.ch',
    phone: '+41 79 284 98 25',
    abteilung: 'Pfadfinderabteilung St. Justus',
    vermietung: 'Pfadihaus Vermietung',
  };

  protected readonly mapUrl = computed(() => {
    const query = encodeURIComponent(
      `${this.address.name}, ${this.address.street}, ${this.address.zip} ${this.address.city}`,
    );
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.google.com/maps?q=${query}&output=embed`,
    );
  });
}