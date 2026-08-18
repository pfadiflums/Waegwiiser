import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AbteilungPageComponent } from '../abteilung-page/abteilung-page';
import { AbteilungPageContent } from '../abteilung-page/abteilung-page.model';

@Component({
  selector: 'app-altpfader',
  imports: [AbteilungPageComponent],
  templateUrl: './altpfader.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AltpfaderComponent {
  // TODO: Platzhaltertext aus dem Design — echten Altpfader-Text nachliefern lassen.
  protected readonly content: AbteilungPageContent = {
    titleLines: ['ALTPFADER'],
    description:
      'Das Abteilungskomitee ist im Gegensatz zur Abteilungsleitung strategisch tätig und berät die Abteilungsleitung. Die zwei Schlüsselfunktionen des Abteilungskomitees sind Beratung und Ansprechperson für Eltern.',
    aufgaben: [
      'Verfolgt das Geschehen in der Abteilung und stellt die Qualität im Pfadibetrieb sicher.',
      'Ist die Ansprechstelle für Pfadieltern und Eltern, die sich für den Pfadibetrieb interessieren (im Sinne von Eltern-zu-Eltern-Fragen).',
      'Ist an Abteilungsanlässen präsent und hilft je nach dem mit',
      'Ist strategisch tätig und klärt die Aufgaben innerhalb der Abteilung (Coach, Abteilungsleitung, Abteilungskomitee, Kasse, Revision, Bekleidungsstelle etc. Die operative Leitung liegt bei der Abteilungsleitung.',
      'Erhalt des Jahresberichtes',
      'Jährlicher Austausch und Infos im Rahmen des Abteilungskomitee Treffen (inkl. Heimvereine) aller Abteilungen im Kanton SG/AR/AI',
      'Kommunikation im Bad News Fall',
    ],
    members: [
      { pfadiName: 'PINOCCIO', roles: [] },
      { pfadiName: 'ZAPPLI', roles: [] },
    ],
  };
}
