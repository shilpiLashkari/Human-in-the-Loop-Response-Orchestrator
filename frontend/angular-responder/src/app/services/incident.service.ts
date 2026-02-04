import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Incident {
    id: number;
    title: string;
    description: string;
    status: 'active' | 'investigating' | 'remediated' | 'closed';
    severity: 'low' | 'medium' | 'high' | 'critical';
    source: string;
    recommendedAction: string;
    actionStatus: 'pending' | 'approved' | 'rejected' | 'executed' | 'failed';
    alertIds?: string[];
    createdAt: string;
    updatedAt: string;
    creator?: string;
    assignee?: string;
    workflowSteps?: Array<{
        step: string;
        status: 'pending' | 'completed' | 'current';
        actor?: string;
        timestamp?: string;
    }>;
}

export const INCIDENT_SCENARIOS = [
    {
        title: 'High CPU Usage on Production Server',
        description: 'CPU usage has exceeded 90% on prod-server-01 for the last 10 minutes.',
        severity: 'high' as const,
        recommendedAction: 'Scale up server resources or investigate processes'
    },
    {
        title: 'Database Connection Pool Exhausted',
        description: 'PostgreSQL connection pool has reached maximum capacity.',
        severity: 'critical' as const,
        recommendedAction: 'Increase connection pool size or investigate leaks'
    },
    {
        title: 'Memory Leak Detected in API Service',
        description: 'Memory consumption is steadily increasing. Current usage: 85%.',
        severity: 'high' as const,
        recommendedAction: 'Restart API service and investigate leak'
    },
    {
        title: 'Disk Space Running Low',
        description: 'Available disk space on /var partition is below 15%.',
        severity: 'medium' as const,
        recommendedAction: 'Clean up old logs or expand disk partition'
    },
    {
        title: 'Unusual Traffic Spike Detected',
        description: 'Traffic has increased by 300% in the last 5 minutes.',
        severity: 'critical' as const,
        recommendedAction: 'Enable rate limiting and investigate source'
    },
    {
        title: 'SSL Certificate Expiring Soon',
        description: 'SSL certificate for api.example.com will expire in 7 days.',
        severity: 'low' as const,
        recommendedAction: 'Renew SSL certificate before expiration'
    }
];


@Injectable({
    providedIn: 'root'
})
export class IncidentService {
    private apiUrl = 'http://localhost:3002/api/incidents';

    constructor(private http: HttpClient) { }

    getIncidents(): Observable<Incident[]> {
        return this.http.get<Incident[]>(this.apiUrl);
    }

    getIncident(id: number): Observable<Incident> {
        return this.http.get<Incident>(`${this.apiUrl}/${id}`);
    }

    approveAction(id: number, action: string, approvedBy: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/${id}/action`, { action, approvedBy });
    }
}
