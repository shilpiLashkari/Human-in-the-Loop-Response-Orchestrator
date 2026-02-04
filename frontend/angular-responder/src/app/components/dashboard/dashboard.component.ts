import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { IncidentService, Incident } from '../../services/incident.service';
import { SocketService } from '../../services/socket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatChipsModule, MatIconModule, MatSnackBarModule, HttpClientModule],
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <div class="header-content">
          <div class="header-text">
            <h1 class="dashboard-title">Secure Command Center</h1>
            <p class="dashboard-subtitle">Real-time monitoring and human-approved remediation</p>
          </div>
          <button mat-raised-button color="accent" class="create-test-btn" (click)="createTestIncident()">
            <mat-icon>add_circle</mat-icon>
            Create Test Incident
          </button>
        </div>
      </div>

      <!-- Statistics Cards -->
      <div class="stats-grid">
        <div class="stat-card stat-total">
          <div class="stat-icon">
            <mat-icon>assessment</mat-icon>
          </div>
          <div class="stat-content">
            <div class="stat-label">TOTAL INCIDENTS</div>
            <div class="stat-value">{{ incidents.length }}</div>
          </div>
        </div>

        <div class="stat-card stat-active">
          <div class="stat-icon">
            <mat-icon>warning</mat-icon>
          </div>
          <div class="stat-content">
            <div class="stat-label">ACTIVE</div>
            <div class="stat-value">{{ getActiveCount() }}</div>
          </div>
        </div>

        <div class="stat-card stat-critical">
          <div class="stat-icon">
            <mat-icon>error</mat-icon>
          </div>
          <div class="stat-content">
            <div class="stat-label">CRITICAL</div>
            <div class="stat-value">{{ getCriticalCount() }}</div>
          </div>
        </div>

        <div class="stat-card stat-resolved">
          <div class="stat-icon">
            <mat-icon>check_circle</mat-icon>
          </div>
          <div class="stat-content">
            <div class="stat-label">RESOLVED</div>
            <div class="stat-value">{{ getResolvedCount() }}</div>
          </div>
        </div>
      </div>

      <!-- Incidents Section -->
      <div class="incidents-section">
        <h2 class="section-title">Active Incidents</h2>
        
        @if (incidents.length > 0) {
          <div class="incidents-grid">
            @for (incident of incidents; track incident.id) {
              <mat-card class="incident-card" [class]="'severity-' + incident.severity">
                <div class="incident-header">
                  <div class="incident-title-row">
                    <h3 class="incident-title">{{ incident.title }}</h3>
                    <mat-chip class="severity-chip" [class]="'chip-' + incident.severity">
                      {{ incident.severity | uppercase }}
                    </mat-chip>
                  </div>
                  <div class="incident-meta">
                    <span class="meta-item">
                      <mat-icon class="meta-icon">source</mat-icon>
                      {{ incident.source }}
                    </span>
                    <span class="meta-item">
                      <mat-icon class="meta-icon">schedule</mat-icon>
                      {{ incident.createdAt | date:'short' }}
                    </span>
                  </div>
                </div>

                <mat-card-content class="incident-content">
                  <p class="incident-description">{{ incident.description }}</p>
                  
                  <div class="incident-status">
                    <mat-chip class="status-chip">
                      <mat-icon class="chip-icon">{{ getStatusIcon(incident.status) }}</mat-icon>
                      {{ incident.status | uppercase }}
                    </mat-chip>
                    <mat-chip class="action-status-chip" [class]="'action-' + incident.actionStatus">
                      {{ incident.actionStatus | uppercase }}
                    </mat-chip>
                  </div>

                  @if (incident.recommendedAction) {
                    <div class="recommended-action">
                      <div class="action-label">
                        <mat-icon>lightbulb</mat-icon>
                        Recommended Action
                      </div>
                      <p class="action-text">{{ incident.recommendedAction }}</p>
                    </div>
                  }
                </mat-card-content>

                <mat-card-actions class="incident-actions">
                  <button mat-raised-button color="primary" [routerLink]="['/incident', incident.id]" class="action-button">
                    <mat-icon>visibility</mat-icon>
                    View Details
                  </button>
                  @if (incident.actionStatus === 'pending') {
                    <button mat-raised-button color="accent" class="action-button">
                      <mat-icon>check</mat-icon>
                      Approve Action
                    </button>
                  }
                </mat-card-actions>
              </mat-card>
            }
          </div>
        } @else {
          <!-- Empty State -->
          <div class="empty-state">
            <mat-icon class="empty-icon">check_circle_outline</mat-icon>
            <h3 class="empty-title">No Active Incidents</h3>
            <p class="empty-message">All systems operational. No incidents require attention at this time.</p>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      animation: fadeIn 0.5s ease-in;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .dashboard-header {
      margin-bottom: 32px;
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 24px;
      flex-wrap: wrap;
    }

    .header-text {
      flex: 1;
      min-width: 0;
    }

    .create-test-btn {
      border-radius: 8px !important;
      font-weight: 600 !important;
      text-transform: none !important;
      padding: 10px 20px !important;
      height: auto !important;
      flex-shrink: 0;
      white-space: nowrap;
    }

    .create-test-btn mat-icon {
      margin-right: 8px;
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .dashboard-title {
      font-size: 2.5rem;
      font-weight: 800;
      margin-bottom: 8px;
      color: #ffffff;
      letter-spacing: -0.5px;
    }

    .dashboard-subtitle {
      color: #94a3b8;
      font-size: 1.1rem;
    }

    /* Statistics Grid */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 40px;
    }

    .stat-card {
      background: rgba(30, 41, 59, 0.8);
      backdrop-filter: blur(10px);
      border-radius: 16px;
      padding: 24px;
      display: flex;
      align-items: center;
      gap: 20px;
      border: 1px solid rgba(148, 163, 184, 0.1);
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .stat-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 4px;
      height: 100%;
      transition: width 0.3s ease;
    }

    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(99, 102, 241, 0.2);
    }

    .stat-card:hover::before {
      width: 100%;
      opacity: 0.1;
    }

    .stat-total::before { background: #6366f1; }
    .stat-active::before { background: #ec4899; }
    .stat-critical::before { background: #ef4444; }
    .stat-resolved::before { background: #10b981; }

    .stat-icon {
      width: 56px;
      height: 56px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .stat-total .stat-icon { background: rgba(99, 102, 241, 0.15); color: #6366f1; }
    .stat-active .stat-icon { background: rgba(236, 72, 153, 0.15); color: #ec4899; }
    .stat-critical .stat-icon { background: rgba(239, 68, 68, 0.15); color: #ef4444; }
    .stat-resolved .stat-icon { background: rgba(16, 185, 129, 0.15); color: #10b981; }

    .stat-icon mat-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
    }

    .stat-content {
      flex: 1;
      min-width: 0;
      overflow: visible;
    }

    .stat-label {
      font-size: 0.75rem;
      font-weight: 600;
      color: #94a3b8;
      letter-spacing: 0.5px;
      margin-bottom: 4px;
      white-space: nowrap;
      overflow: visible;
    }

    .stat-value {
      font-size: 2rem;
      font-weight: 700;
      color: #f1f5f9;
      line-height: 1;
    }

    /* Incidents Section */
    .incidents-section {
      margin-top: 40px;
    }

    .section-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: #f1f5f9;
      margin-bottom: 24px;
    }

    .incidents-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
      gap: 24px;
    }

    .incident-card {
      background: rgba(30, 41, 59, 0.8) !important;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(148, 163, 184, 0.1) !important;
      border-radius: 16px !important;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .incident-card::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      width: 4px;
      height: 100%;
    }

    .severity-critical::before { background: #ef4444; }
    .severity-high::before { background: #f59e0b; }
    .severity-medium::before { background: #eab308; }
    .severity-low::before { background: #3b82f6; }

    .incident-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 32px rgba(99, 102, 241, 0.2);
      border-color: rgba(99, 102, 241, 0.3) !important;
    }

    .incident-header {
      padding: 20px 20px 0;
    }

    .incident-title-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 12px;
      margin-bottom: 12px;
    }

    .incident-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #f1f5f9;
      margin: 0;
      flex: 1;
    }

    .severity-chip {
      font-size: 0.75rem !important;
      font-weight: 700 !important;
      padding: 4px 12px !important;
      height: 24px !important;
      border-radius: 12px !important;
    }

    .chip-critical { background: rgba(239, 68, 68, 0.2) !important; color: #ef4444 !important; }
    .chip-high { background: rgba(245, 158, 11, 0.2) !important; color: #f59e0b !important; }
    .chip-medium { background: rgba(234, 179, 8, 0.2) !important; color: #eab308 !important; }
    .chip-low { background: rgba(59, 130, 246, 0.2) !important; color: #3b82f6 !important; }

    .incident-meta {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.875rem;
      color: #94a3b8;
    }

    .meta-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    .incident-content {
      padding: 20px !important;
    }

    .incident-description {
      color: #cbd5e1;
      line-height: 1.6;
      margin-bottom: 16px;
    }

    .incident-status {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      margin-bottom: 16px;
    }

    .status-chip, .action-status-chip {
      font-size: 0.75rem !important;
      height: 28px !important;
      background: rgba(100, 116, 139, 0.2) !important;
      color: #cbd5e1 !important;
    }

    .chip-icon {
      font-size: 16px !important;
      width: 16px !important;
      height: 16px !important;
      margin-right: 4px;
    }

    .action-pending { background: rgba(245, 158, 11, 0.2) !important; color: #f59e0b !important; }
    .action-approved { background: rgba(16, 185, 129, 0.2) !important; color: #10b981 !important; }
    .action-rejected { background: rgba(239, 68, 68, 0.2) !important; color: #ef4444 !important; }

    .recommended-action {
      background: rgba(99, 102, 241, 0.1);
      border-left: 3px solid #6366f1;
      padding: 12px;
      border-radius: 8px;
    }

    .action-label {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.75rem;
      font-weight: 600;
      color: #6366f1;
      margin-bottom: 6px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .action-label mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    .action-text {
      color: #cbd5e1;
      font-size: 0.875rem;
      margin: 0;
    }

    .incident-actions {
      padding: 0 20px 20px !important;
      display: flex;
      gap: 12px;
    }

    .action-button {
      flex: 1;
      border-radius: 8px !important;
      font-weight: 600 !important;
      text-transform: none !important;
    }

    .action-button mat-icon {
      margin-right: 6px;
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    /* Empty State */
    .empty-state {
      text-align: center;
      padding: 80px 20px;
      background: rgba(30, 41, 59, 0.4);
      border-radius: 16px;
      border: 2px dashed rgba(148, 163, 184, 0.2);
    }

    .empty-icon {
      font-size: 80px;
      width: 80px;
      height: 80px;
      color: #10b981;
      margin-bottom: 16px;
    }

    .empty-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: #f1f5f9;
      margin-bottom: 8px;
    }

    .empty-message {
      color: #94a3b8;
      font-size: 1.1rem;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .dashboard-title {
        font-size: 1.75rem;
      }

      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .incidents-grid {
        grid-template-columns: 1fr;
      }

      .incident-actions {
        flex-direction: column;
      }
    }
  `]
})
export class DashboardComponent implements OnInit, OnDestroy {
  incidents: Incident[] = [];
  private eventSub!: Subscription;
  private testIncidentCounter = 0;

  constructor(
    private incidentService: IncidentService,
    private socketService: SocketService,
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.loadIncidents();

    this.eventSub = this.socketService.onEvent('incident_created').subscribe(newIncident => {
      this.loadIncidents();
    });
  }

  ngOnDestroy() {
    if (this.eventSub) this.eventSub.unsubscribe();
  }

  loadIncidents() {
    this.incidentService.getIncidents().subscribe(data => {
      this.incidents = data;
    });
  }

  getActiveCount(): number {
    return this.incidents.filter(i => i.status === 'active' || i.status === 'investigating').length;
  }

  getCriticalCount(): number {
    return this.incidents.filter(i => i.severity === 'critical').length;
  }

  getResolvedCount(): number {
    return this.incidents.filter(i => i.status === 'remediated' || i.status === 'closed').length;
  }

  getStatusIcon(status: string): string {
    const icons: { [key: string]: string } = {
      'active': 'warning',
      'investigating': 'search',
      'remediated': 'check_circle',
      'closed': 'done_all'
    };
    return icons[status] || 'info';
  }

  createTestIncident() {
    this.testIncidentCounter++;

    const severities: Array<'low' | 'medium' | 'high' | 'critical'> = ['low', 'medium', 'high', 'critical'];
    const statuses: Array<'active' | 'investigating' | 'remediated' | 'closed'> = ['active', 'investigating'];
    const actionStatuses: Array<'pending' | 'approved' | 'rejected' | 'executed' | 'failed'> = ['pending', 'approved'];
    const sources = ['Prometheus', 'Datadog', 'CloudWatch', 'PagerDuty', 'Grafana'];
    const scenarios = [
      {
        title: 'High CPU Usage on Production Server',
        description: 'CPU usage has exceeded 90% on prod-server-01 for the last 10 minutes. This may impact application performance.',
        severity: 'high' as const,
        recommendedAction: 'Scale up server resources or investigate processes consuming excessive CPU'
      },
      {
        title: 'Database Connection Pool Exhausted',
        description: 'PostgreSQL connection pool has reached maximum capacity. New connections are being rejected.',
        severity: 'critical' as const,
        recommendedAction: 'Increase connection pool size or investigate connection leaks'
      },
      {
        title: 'Memory Leak Detected in API Service',
        description: 'Memory consumption is steadily increasing in the API service. Current usage: 85% and climbing.',
        severity: 'high' as const,
        recommendedAction: 'Restart API service and investigate memory leak in application code'
      },
      {
        title: 'Disk Space Running Low',
        description: 'Available disk space on /var partition is below 15%. Cleanup or expansion required.',
        severity: 'medium' as const,
        recommendedAction: 'Clean up old logs and temporary files, or expand disk partition'
      },
      {
        title: 'Unusual Traffic Spike Detected',
        description: 'Traffic has increased by 300% in the last 5 minutes. Possible DDoS attack or viral content.',
        severity: 'critical' as const,
        recommendedAction: 'Enable rate limiting and investigate traffic source'
      },
      {
        title: 'SSL Certificate Expiring Soon',
        description: 'SSL certificate for api.example.com will expire in 7 days. Renewal required.',
        severity: 'low' as const,
        recommendedAction: 'Renew SSL certificate before expiration'
      }
    ];

    const randomScenario = scenarios[Math.floor(Math.random() * scenarios.length)];
    const randomSource = sources[Math.floor(Math.random() * sources.length)];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    const randomActionStatus = actionStatuses[Math.floor(Math.random() * actionStatuses.length)];

    // Create mock incident directly (client-side fallback)
    const mockIncident: Incident = {
      id: Date.now() + this.testIncidentCounter,
      title: `${randomScenario.title} #${this.testIncidentCounter}`,
      description: randomScenario.description,
      status: randomStatus,
      severity: randomScenario.severity,
      source: randomSource,
      recommendedAction: randomScenario.recommendedAction,
      actionStatus: randomActionStatus,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      creator: 'Test Bot',
      assignee: 'Operator-' + Math.floor(Math.random() * 5 + 1)
    };

    // Try backend API first, fallback to client-side if it fails
    const testAlert = {
      title: mockIncident.title,
      description: mockIncident.description,
      severity: mockIncident.severity,
      source: mockIncident.source,
      metadata: {
        test: true,
        timestamp: new Date().toISOString(),
        counter: this.testIncidentCounter
      }
    };

    // Attempt API call with timeout
    this.http.post('http://localhost:3001/api/alerts', testAlert, {
      headers: { 'Content-Type': 'application/json' }
    }).subscribe({
      next: (response) => {
        this.snackBar.open('✅ Test incident created via API!', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['success-snackbar']
        });
        setTimeout(() => this.loadIncidents(), 500);
      },
      error: (error) => {
        console.warn('Backend API unavailable, using client-side mock:', error);

        // Fallback: Add mock incident directly to the list
        this.incidents.unshift(mockIncident);

        this.snackBar.open('✅ Test incident created (mock mode - backend unavailable)', 'Close', {
          duration: 4000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['success-snackbar']
        });
      }
    });
  }
}
