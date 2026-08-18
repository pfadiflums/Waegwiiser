import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AbteilungPageComponent } from '../abteilung-page/abteilung-page';
import { AbteilungPageContent } from '../abteilung-page/abteilung-page.model';

@Component({
  selector: 'app-abteilungsleitung',
  imports: [AbteilungPageComponent],
  templateUrl: './abteilungsleitung.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AbteilungsleitungComponent {
  protected readonly content: AbteilungPageContent = {
    titleLines: ['ABTEILUNGS', 'LEITUNG'],
    description:
      'Die Abteilungsleiter haben viele unterschiedliche Aufgaben in der Abteilung und im Leiterteam. Sie sind verantwortlich für administrative Aufgaben, für den Teamzusammenhalt und -koordination, sie sind das Bindeglied zu anderen Abteilungen, zum Kantonverband und auch zum Bund, sie haben die Übersicht über die Abteilung und noch vieles mehr.',
    members: [
      { pfadiName: 'PINOCCIO', roles: [] },
      { pfadiName: 'ZAPPLI', roles: [] },
    ],
  };
}
