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
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
    }

    .modern-toolbar {
      background: linear-gradient(135deg, #6366f1 0%, #ec4899 100%) !important;
      box-shadow: 0 4px 20px rgba(99, 102, 241, 0.3);
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
      color: white;
    }

    .brand-text {
      font-size: 1.25rem;
      font-weight: 700;
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
      background: rgba(0, 0, 0, 0.5);
      padding: 10px 20px;
      border-radius: 24px;
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.4);
    }

    .status-dot {
      width: 8px;
      height: 8px;
      background: #10b981;
      border-radius: 50%;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
      70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
      100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
    }

    .status-text {
      color: white;
      font-size: 0.93rem;
      font-weight: 800;
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
