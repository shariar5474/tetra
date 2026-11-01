import { getDB } from './indexeddb';
import { GenerationJob, JobStatus } from '../shared/types/job';

export async function createJob(job: GenerationJob): Promise<void> {
  const db = await getDB();
  await db.put('generation_jobs', job);
}

export async function getJob(jobId: string): Promise<GenerationJob | undefined> {
  const db = await getDB();
  return db.get('generation_jobs', jobId);
}

export async function getJobsByProject(projectId: string): Promise<GenerationJob[]> {
  const db = await getDB();
  const jobs = await db.getAllFromIndex('generation_jobs', 'by-project', projectId);
  return jobs.sort((a, b) => b.createdAt - a.createdAt);
}

export async function getAllActiveJobs(): Promise<GenerationJob[]> {
  const db = await getDB();
  const allJobs = await db.getAll('generation_jobs');
  return allJobs.filter(
    (j) => j.status === 'waiting' || j.status === 'preparing' || j.status === 'ready' || j.status === 'generating' || j.status === 'processing'
  );
}

export async function updateJobStatus(
  jobId: string,
  status: JobStatus,
  progress = 0,
  message = '',
  extraData?: Partial<GenerationJob>
): Promise<void> {
  const db = await getDB();
  const job = await db.get('generation_jobs', jobId);
  if (!job) return;

  job.status = status;
  job.progressPercent = progress;
  if (message) job.statusMessage = message;
  if (extraData) {
    Object.assign(job, extraData);
  }
  if (status === 'completed' || status === 'failed' || status === 'cancelled') {
    job.endTime = Date.now();
  }

  await db.put('generation_jobs', job);
}

export async function deleteJob(jobId: string): Promise<void> {
  const db = await getDB();
  await db.delete('generation_jobs', jobId);
}
