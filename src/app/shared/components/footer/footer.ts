import { Component, ChangeDetectionStrategy } from "@angular/core";
import {RouterLink} from '@angular/router';

@Component({
  selector: "app-footer",
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./footer.html",
})
export class Footer {
  currentYear: number = new Date().getFullYear();
}
