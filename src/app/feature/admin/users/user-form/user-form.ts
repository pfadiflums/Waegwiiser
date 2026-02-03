import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserService } from '../../../../services/user.service';
import { User } from '../../../../models/payload-types/collections/user';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './user-form.html',
  styleUrl: './user-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  userForm: FormGroup;
  isEditMode = signal(false);
  userId: string | null = null;

  constructor() {
    this.userForm = this.fb.group({
      pfadiname: [''],
      vorname: ['', Validators.required],
      nachname: ['', Validators.required],
      funktion: [''],
      email: ['', [Validators.required, Validators.email]],
      password: [''],
      role: ['leader', Validators.required],
      stufe: [''],
    });
  }

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('id');
    if (this.userId) {
      this.isEditMode.set(true);
      this.userForm.get('password')?.clearValidators();
      this.userService.getUser(this.userId).subscribe((user: User) => {
        const roleId = typeof user.role === 'object' ? user.role.id : user.role;
        this.userForm.patchValue({
          ...user,
          role: roleId
        });
      });
    } else {
      this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    }
  }

  onSubmit() {
    if (this.userForm.valid) {
      const userData = { ...this.userForm.value };
      if (!userData.password) {
        delete userData.password;
      }

      if (this.isEditMode() && this.userId) {
        this.userService.updateUser(this.userId, userData).subscribe(() => {
          this.router.navigate(['/admin/users']);
        });
      } else {
        this.userService.createUser(userData).subscribe(() => {
          this.router.navigate(['/admin/users']);
        });
      }
    }
  }
}
