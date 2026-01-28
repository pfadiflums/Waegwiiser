import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

interface StufeData {
  title: string;
  secondTitle?: string;
  titleColor?: string;
  text: string;
  color?: string;
  image?: string;
}

@Component({
  selector: 'app-stufe',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stufe.html',
  styleUrl: './stufe.scss',
})
export class Stufe implements OnInit {
  stufeName = '';
  data: StufeData = { title: '', text: '' };

  private readonly route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const name = params.get('stufe') ?? 'unbekannt';
      this.stufeName = name;
      this.loadData(name);
    });
  }

  private loadData(stufe: string): void {
    const content: Record<string, StufeData> = {
      biber: {
        title: 'BIBERSTUFE',
        secondTitle: 'MIT FREUDE DABEI',
        titleColor: '#e9bf4a',
        text: 'Die Biber treffen sich ein- bis zweimal pro Monat an einem Samstag und sind gemeinsam mit ihren Leitern draussen unterwegs. Auf spielerische Weise werden sie dazu angeregt ihr Umfeld kennen zu lernen und Neues zu entdecken. Ihre Fantasie und Neugierde führt sie von Abenteuer zu Abenteuer, welche sie als Gruppe erleben.',
      },
      wolf: {
        title: 'WOLFSTUFE',
        secondTitle: 'MIT BESCHT',
        titleColor: '#137fa2',
        text: 'Die Biber treffen sich ein- bis zweimal pro Monat an einem Samstag und sind gemeinsam mit ihren Leitern draussen unterwegs. Auf spielerische Weise werden sie dazu angeregt ihr Umfeld kennen zu lernen und Neues zu entdecken. Ihre Fantasie und Neugierde führt sie von Abenteuer zu Abenteuer, welche sie als Gruppe erleben.',
      },
      pfader: {
        title: 'PFADERSTUFE',
        secondTitle: 'ALLZEIT BEREIT',
        titleColor: '#b68d60',
        text: 'Die Biber treffen sich ein- bis zweimal pro Monat an einem Samstag und sind gemeinsam mit ihren Leitern draussen unterwegs. Auf spielerische Weise werden sie dazu angeregt ihr Umfeld kennen zu lernen und Neues zu entdecken. Ihre Fantasie und Neugierde führt sie von Abenteuer zu Abenteuer, welche sie als Gruppe erleben.',
      },
      pio: {
        title: 'PFADERSTUFE',
        secondTitle: 'JADAS',
        titleColor: '#BF2E26',
        text: 'Die Biber treffen sich ein- bis zweimal pro Monat an einem Samstag und sind gemeinsam mit ihren Leitern draussen unterwegs. Auf spielerische Weise werden sie dazu angeregt ihr Umfeld kennen zu lernen und Neues zu entdecken. Ihre Fantasie und Neugierde führt sie von Abenteuer zu Abenteuer, welche sie als Gruppe erleben.',
      },
      unbekannt: {
        title: 'UNBEKANNTE STUFE',
        secondTitle: 'Nicht gefunden',
        titleColor: '#999',
        text: 'Diese Stufe existiert (noch) nicht.',
      },
    };

    this.data = content[stufe] ?? content['unbekannt'];
  }
}
