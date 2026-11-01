import { getJob, updateJobStatus } from '../database/job-store';
import { showNotification } from './notification-manager';

export class BackgroundJobManager {
  private activeJobId: string | null = null;

  async startJob(jobId: string): Promise<void> {
    const job = await getJob(jobId);
    if (!job) return;

    this.activeJobId = jobId;
    await updateJobStatus(jobId, 'preparing', 10, 'Preparing scene assets & prompt parameters...');

    // Simulate safe staged progression if mock, or await content script confirmation
    if (job.provider === 'mock_simulation') {
      setTimeout(async () => {
        await updateJobStatus(jobId, 'generating', 45, 'Synthesizing scene frames with consistency locks...');
        setTimeout(async () => {
          await updateJobStatus(jobId, 'processing', 85, 'Rendering cinematic video and audio tracks...');
          setTimeout(async () => {
            await updateJobStatus(jobId, 'completed', 100, 'Scene generation completed!');
            showNotification('CineForge AI Production', `Scene "${job.sceneTitle}" generated successfully!`);
            this.activeJobId = null;
          }, 2000);
        }, 3000);
      }, 2000);
    }
  }

  getActiveJobId(): string | null {
    return this.activeJobId;
  }
}

export const backgroundJobManager = new BackgroundJobManager();
