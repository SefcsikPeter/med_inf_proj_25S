import { Component } from '@angular/core';
import { ResetService } from '../../service/reset.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {

  constructor(private resetService: ResetService) {}

  resetAllProgress() {
    this.resetService.resetProgress().subscribe({
      next: (res) => {
        console.log(res.message);
        alert('Progress has been reset!');
      },
      error: (err) => {
        console.error('Error resetting progress:', err);
        alert('Failed to reset progress.');
      }
    });
  }
}
