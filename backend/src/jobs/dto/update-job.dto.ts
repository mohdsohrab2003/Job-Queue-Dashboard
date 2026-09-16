import { IsEnum } from 'class-validator';
import { JobStatus } from '../entities/job.entity.js';

export class UpdateJobDto {
  @IsEnum(JobStatus)
  status: JobStatus;
}
