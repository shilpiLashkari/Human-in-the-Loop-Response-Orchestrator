import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { IncidentService, Incident } from '../../services/incident.service';

@Component({
  selector: 'app-incident-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule, MatExpansionModule, MatProgressSpinnerModule],
  template: `
    @if (incident) {
      <div class="detail-container">
        <div class="top-nav">
          <button mat-button routerLink="/" class="back-btn">
            <mat-icon>arrow_back</mat-icon> Back to Command Center
          </button>
          <div class="breadcrumb">
            Dashboard / Incident / {{ incident.id }}
          </div>
        </div>
        
        <header class="incident-header">
          <div class="header-main">
            <div class="severity-indicator" [class]="'sev-' + incident.severity"></div>
            <div class="header-text">
              <h1>{{ incident.title }}</h1>
              <p class="incident-meta">Created by <strong>{{ incident.creator || 'System' }}</strong> • {{ incident.createdAt | date:'medium' }}</p>
            </div>
          </div>
          <div class="header-actions">
             <span class="status-badge" [class]="incident.status">{{ incident.status | uppercase }}</span>
          </div>
        </header>

        <div class="content-layout">
          <!-- Main Column -->
          <div class="main-column">
            <mat-card class="glass-card">
              <mat-card-header>
                <mat-icon mat-card-avatar>info</mat-icon>
                <mat-card-title>Incident Context</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <div class="context-grid">
                  <div class="context-item">
                    <label>Source System</label>
                    <span>{{ incident.source }}</span>
                  </div>
                  <div class="context-item">
                    <label>Assignee</label>
                    <span class="user-pill"><mat-icon>person</mat-icon> {{ incident.assignee || 'Unassigned' }}</span>
                  </div>
                </div>
                <div class="description-box">
                  <label>Description</label>
                  <div class="pre-wrap">{{ incident.description }}</div>
                </div>
              </mat-card-content>
            </mat-card>

            <!-- Workflow Steps -->
            <mat-card class="glass-card workflow-card">
              <mat-card-header>
                <mat-icon mat-card-avatar>account_tree</mat-icon>
                <mat-card-title>Approval Workflow</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <div class="workflow-stepper">
                  @for (step of incident.workflowSteps || [
                    {step: 'Detection', status: 'completed', actor: 'System', timestamp: incident.createdAt},
                    {step: 'Triage', status: 'completed', actor: incident.creator || 'Operator', timestamp: incident.createdAt},
                    {step: 'Remediation Approval', status: incident.actionStatus === 'pending' ? 'current' : 'completed', actor: incident.actionStatus === 'approved' ? 'Lead Engineer' : undefined},
                    {step: 'Execution', status: incident.actionStatus === 'approved' ? 'pending' : 'pending'}
                  ]; track step.step) {
                    <div class="workflow-step">
                      <div class="step-icon" [class]="step.status">
                        @if (step.status === 'completed') {
                          <mat-icon>check</mat-icon>
                        } @else {
                          <div class="dot"></div>
                        }
                      </div>
                      <div class="step-content">
                        <div class="step-title">{{ step.step }}</div>
                        @if (step.actor) {
                          <div class="step-details">
                            by <strong>{{ step.actor }}</strong> @if (step.timestamp) {<span class="time">• {{ step.timestamp | date:'shortTime' }}</span>}
                          </div>
                        }
                      </div>
                    </div>
                  }
                </div>
              </mat-card-content>
            </mat-card>
          </div>

          <!-- Right Side: Decisions & Actions -->
          <div class="action-column">
            <mat-card class="recommendation-card active-action">
              <mat-card-header>
                <mat-icon mat-card-avatar class="pulsing-icon">auto_awesome</mat-icon>
                <mat-card-title>Decision Engine</mat-card-title>
                <mat-card-subtitle>AI-Recommended Remediation</mat-card-subtitle>
              </mat-card-header>
              <mat-card-content>
                <div class="action-box">
                  <h3 class="action-text">{{ incident.recommendedAction }}</h3>
                </div>
                @if (incident.severity === 'critical' || incident.severity === 'high') {
                   <div class="risk-notice">
                      <mat-icon>warning</mat-icon>
                      <span>HIGH BLAST RADIUS: Requires Level 2 Approval</span>
                   </div>
                }
              </mat-card-content>
              @if (incident.actionStatus === 'pending') {
                <mat-card-actions align="end">
                  <button mat-stroked-button color="warn">Reject</button>
                  <button mat-raised-button class="approve-btn" (click)="approveAction()">
                    <mat-icon>verified_user</mat-icon> Approve Execution
                  </button>
                </mat-card-actions>
              }
              @if (incident.actionStatus === 'approved') {
                <mat-card-footer>
                    <div class="approved-banner">
                        <mat-icon>check_circle</mat-icon>
                        <div>
                          <span>Remediation Approved</span>
                          <small>Authorized by Lead Engineer</small>
                        </div>
                    </div>
                </mat-card-footer>
              }
            </mat-card>
          </div>
        </div>
      </div>
    } @else {
      <div class="spinner-container">
        <mat-spinner></mat-spinner>
      </div>
    }

  `,
  styles: [`
    .detail-container { max-width: 1400px; margin: 0 auto; padding: 24px; color: #e2e8f0; }
    .top-nav { display: flex; align-items: center; gap: 16px; margin-bottom: 32px; }
    .back-btn { color: #94a3b8 !important; }
    .breadcrumb { color: #64748b; font-size: 0.85rem; font-weight: 500; }
    
    .incident-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 40px; }
    .header-main { display: flex; gap: 20px; }
    .severity-indicator { width: 4px; border-radius: 4px; }
    .sev-critical { background: #ef4444; box-shadow: 0 0 15px rgba(239, 68, 68, 0.5); }
    .sev-high { background: #f97316; }
    .sev-medium { background: #eab308; }
    .sev-low { background: #22c55e; }
    
    .header-text h1 { font-size: 2.25rem; font-weight: 800; margin: 0; color: #f8fafc; letter-spacing: -0.025em; }
    .incident-meta { color: #64748b; margin-top: 8px; font-size: 1rem; }
    
    .status-badge { padding: 6px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 800; letter-spacing: 0.05em; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.1); }
    .status-badge.active { background: rgba(239, 68, 68, 0.1); color: #ef4444; border-color: rgba(239, 68, 68, 0.2); }
    
    .content-layout { display: grid; grid-template-columns: 2fr 1fr; gap: 32px; }
    
    .glass-card { background: rgba(30, 41, 59, 0.7) !important; border: 1px solid rgba(255,255,255,0.05) !important; backdrop-filter: blur(12px); border-radius: 16px !important; color: #f1f5f9 !important; margin-bottom: 32px; }
    
    .context-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin: 20px 0; }
    .context-item label { display: block; color: #64748b; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; margin-bottom: 8px; }
    .context-item span { font-size: 1.1rem; font-weight: 500; }
    .user-pill { display: inline-flex; align-items: center; gap: 6px; background: rgba(99, 102, 241, 0.1); color: #818cf8; padding: 4px 12px; border-radius: 20px; font-size: 0.9rem; }
    .user-pill mat-icon { font-size: 18px; width: 18px; height: 18px; }
    
    .description-box { margin-top: 24px; padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.05); }
    .description-box label { display: block; color: #64748b; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; margin-bottom: 12px; }
    .pre-wrap { font-size: 1rem; line-height: 1.6; color: #cbd5e1; }

    /* Workflow Stepper */
    .workflow-stepper { display: flex; flex-direction: column; gap: 0; padding: 10px 0; }
    .workflow-step { display: flex; gap: 16px; position: relative; padding-bottom: 32px; }
    .workflow-step:not(:last-child)::after { content: ''; position: absolute; left: 11px; top: 30px; bottom: 5px; width: 2px; background: rgba(255,255,255,0.1); }
    .step-icon { width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; z-index: 1; background: #334155; }
    .step-icon.completed { background: #22c55e; color: #fff; }
    .step-icon.current { background: #6366f1; box-shadow: 0 0 10px rgba(99, 102, 241, 0.5); }
    .step-icon.current .dot { width: 8px; height: 8px; background: #fff; border-radius: 50%; animation: pulse 2s infinite; }
    .step-icon mat-icon { font-size: 16px; width: 16px; height: 16px; }
    
    .step-content { flex: 1; }\n    .step-title { font-weight: 700; color: #f1f5f9; font-size: 1rem; }\n    .step-details { font-size: 0.85rem; color: #64748b; margin-top: 4px; }\n    .step-details .time { color: #475569; }\n
    /* Action Panel */
    .recommendation-card { background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%) !important; color: #fff !important; border-radius: 20px !important; padding: 12px !important; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3) !important; }
    .action-box { background: rgba(255,255,255,0.1); padding: 20px; border-radius: 12px; margin: 20px 0; border: 1px solid rgba(255,255,255,0.1); }
    .action-text { font-size: 1.25rem; font-weight: 700; margin: 0; line-height: 1.4; }
    .pulsing-icon { animation: float 3s infinite ease-in-out; }
    
    .risk-notice { display: flex; align-items: center; gap: 12px; background: rgba(0,0,0,0.2); padding: 12px; border-radius: 8px; color: #fca5a5; font-size: 0.85rem; font-weight: 600; }
    .risk-notice mat-icon { font-size: 20px; width: 20px; height: 20px; }
    
    .approve-btn { background: #fff !important; color: #4f46e5 !important; font-weight: 800 !important; padding: 0 24px !important; border-radius: 8px !important; }
    .approved-banner { display: flex; align-items: center; gap: 16px; padding: 16px; background: rgba(34, 197, 94, 0.2); border-radius: 12px; border: 1px solid rgba(34, 197, 94, 0.3); }
    .approved-banner mat-icon { font-size: 32px; width: 32px; height: 32px; color: #4ade80; }
    .approved-banner div { display: flex; flex-direction: column; }
    .approved-banner span { font-weight: 700; font-size: 1.1rem; }
    .approved-banner small { opacity: 0.8; font-size: 0.8rem; }

    @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
    @keyframes pulse { 0% { transform: scale(0.9); opacity: 1; } 50% { transform: scale(1.1); opacity: 0.5; } 100% { transform: scale(0.9); opacity: 1; } }
    .spinner-container { display: flex; justify-content: center; padding-top: 100px; }
    @media (max-width: 1000px) { .content-layout { grid-template-columns: 1fr; } }

  `]
})
export class IncidentDetailComponent implements OnInit {
  incident: Incident | null = null;

  constructor(
    private route: ActivatedRoute,
    private incidentService: IncidentService
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.incidentService.getIncident(+id).subscribe(data => {
        this.incident = data;
      });
    }
  }

  approveAction() {
    if (!this.incident) return;
    if (confirm(`Are you sure you want to execute: ${this.incident.recommendedAction}?`)) {
      this.incidentService.approveAction(this.incident.id, this.incident.recommendedAction, 'Operator-1')
        .subscribe(response => {
          if (response.success && this.incident) {
            this.incident.actionStatus = 'approved';
          }
        });
    }
  }
}
