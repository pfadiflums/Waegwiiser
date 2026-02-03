import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserService } from '../../../../services/user.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { User } from '../../../../models/payload-types/collections/user';
import { BehaviorSubject, switchMap } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { Media } from '../../../../models/payload-types/collections/media';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-list.html',
  styleUrl: './user-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserListComponent {
  private userService = inject(UserService);
  private refresh$ = new BehaviorSubject<void>(undefined);
  apiUrl = environment.apiUrl;

  users = toSignal(
    this.refresh$.pipe(switchMap(() => this.userService.getUsers())),
    { initialValue: [] as User[] }
  );

  getImageUrl(image: string | Media | null | undefined): string {
    if (!image) return 'assets/images/placeholder-avatar.jpg';
    if (typeof image === 'string') return `${this.apiUrl}/media/${image}`;
    return image.url ? (image.url.startsWith('http') ? image.url : `${this.apiUrl}${image.url}`) : 'assets/images/placeholder-avatar.jpg';
  }

  deleteUser(id: string) {
    if (confirm('Bist du sicher, dass du diesen Benutzer löschen möchtest?')) {
       this.userService.deleteUser(id).subscribe(() => {
         this.refresh$.next();
       });
    }
  }
}
