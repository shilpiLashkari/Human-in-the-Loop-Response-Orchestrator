import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatToolbarModule, MatIconModule, MatButtonModule],
  template: `
    <div class="app-container">
      <mat-toolbar class="modern-toolbar">
        <div class="toolbar-content">
          <div class="brand">
            <mat-icon class="brand-icon">security</mat-icon>
            <span class="brand-text">Human-in-the-Loop Response Orchestrator</span>
          </div>
          <div class="toolbar-actions">
            <div class="status-indicator">
              <span class="status-dot"></span>
              <span class="status-text">Systems Operational</span>
            </div>
          </div>
        </div>
      </mat-toolbar>
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      background-color: #0a0a1a;
    }

    .modern-toolbar {
      background: rgba(10, 10, 26, 0.8) !important;
      backdrop-filter: blur(10px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      padding: 0 !important;
      height: 70px !important;
    }

    .toolbar-content {
      width: 100%;
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 100%;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .brand-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: #6366f1;
    }

    .brand-text {
      font-size: 1.25rem;
      font-weight: 800;
      color: white;
      letter-spacing: -0.5px;
    }

    .toolbar-actions {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .status-indicator {
      display: flex;
      align-items: center;
      gap: 8px;
      background: rgba(16, 185, 129, 0.1);
      padding: 8px 16px;
      border-radius: 20px;
      border: 1px solid rgba(16, 185, 129, 0.2);
    }

    .status-dot {
      width: 8px;
      height: 8px;
      background: #10b981;
      border-radius: 50%;
      box-shadow: 0 0 10px #10b981;
      animation: pulse 2s infinite ease-in-out;
    }

    @keyframes pulse {
      0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
      70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
      100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
    }

    .status-text {
      color: #10b981;
      font-size: 0.85rem;
      font-weight: 700;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }

    .main-content {
      max-width: 1400px;
      margin: 0 auto;
      padding: 32px 24px;
    }

    @media (max-width: 768px) {
      .brand-text {
        font-size: 1rem;
      }
      
      .status-text {
        display: none;
      }
    }
  `]
})
export class AppComponent {
  title = 'Responder Console';
}
