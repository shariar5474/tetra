import { getAllActiveJobs, updateJobStatus } from '../database/job-store';

export async function recoverInterruptedJobs(): Promise<void> {
  try {
    const activeJobs = await getAllActiveJobs();
    for (const job of activeJobs) {
      if (job.status === 'generating' || job.status === 'processing') {
        console.log(`[CineForge Recovery] Resuming interrupted job: ${job.id}`);
        await updateJobStatus(
          job.id,
          'needs_manual_action',
          job.progressPercent,
          'Browser restarted during generation. Check Flow tab to retrieve video.'
        );
      }
    }
  } catch (err) {
    console.error('[CineForge Recovery] Error during job recovery:', err);
  }
}
