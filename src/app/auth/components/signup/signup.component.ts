import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router ,RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { OverlayModule } from '@angular/cdk/overlay';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, OverlayModule , RouterModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  name = '';
  email = '';
  password = '';
  attemptedSubmitSignup = false;

  isProcessing = false;

  toastMessage = '';
  toastType: 'success' | 'info' = 'success';
  showToast = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  showNotification(message: string, type: 'success' | 'info') {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;

    setTimeout(() => {
      this.showToast = false;
      this.cdr.detectChanges();
    }, 3000);
  }

  onSignup() {
    this.attemptedSubmitSignup = true;

    if (!this.name || !this.email || !this.password) {
      this.showNotification('Please fill all required fields !!', 'info');
      return;
    }

    if (this.isProcessing) return;
    this.isProcessing = true;

    const result = this.authService.signup(this.name, this.email, this.password);

    if (result.success) {
      this.showNotification(result.message, 'success');
      setTimeout(() => {
        this.router.navigate(['/board']);
        this.isProcessing = false;
      }, 1000);
    } else {
      this.showNotification(result.message, 'info');
      this.isProcessing = false;
    }
  }
}