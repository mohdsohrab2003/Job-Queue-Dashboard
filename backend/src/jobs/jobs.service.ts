import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';

import { CreateJobDto } from './dto/create-job.dto.js';
import { Job, JobStatus } from './entities/job.entity.js';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>,
  ) {}

  // POST /jobs - CREATE A NEW JOB
  async create(createJobDto: CreateJobDto) {
    try {
      const job = this.jobRepository.create({
        title: createJobDto.title,
        type: createJobDto.type,
      });
      return await this.jobRepository.save(job);
    } catch (error) {
      console.error('Create job error:', error);

      if (error instanceof QueryFailedError) {
        throw new InternalServerErrorException('Unable to create job');
      }

      throw new InternalServerErrorException(
        'Something went wrong while creating the job',
      );
    }
  }

  // GET /jobs - GET ALL JOBS
  async findAll() {
    try {
      return await this.jobRepository.find({
        order: {
          createdAt: 'DESC',
        },
      });
    } catch (error) {
      console.error('Get jobs error:', error);

      throw new InternalServerErrorException('Unable to fetch jobs');
    }
  }

  // PATCH /jobs/:id/status - UPDATE JOB STATUS
  async updateStatus(id: number, newStatus: JobStatus) {
    try {
      const job = await this.jobRepository.findOne({
        where: { id },
      });

      // Job doesn't exist
      if (!job) {
        throw new NotFoundException('Job not found');
      }

      // Check allowed state transition
      const validTransition =
        (job.status === JobStatus.PENDING && newStatus === JobStatus.RUNNING) ||
        (job.status === JobStatus.RUNNING &&
          (newStatus === JobStatus.COMPLETED ||
            newStatus === JobStatus.FAILED));

      if (!validTransition) {
        throw new ConflictException(
          `Cannot change job status from ${job.status} to ${newStatus}`,
        );
      }

      // Atomic update for concurrency protection
      const result = await this.jobRepository
        .createQueryBuilder()
        .update(Job)
        .set({
          status: newStatus,
        })
        .where('id = :id', { id })
        .andWhere('status = :currentStatus', {
          currentStatus: job.status,
        })
        .execute();

      // Another request changed the status first
      if (result.affected !== 1) {
        throw new ConflictException(
          'Job status was changed by another request',
        );
      }

      const updatedJob = await this.jobRepository.findOne({
        where: { id },
      });

      if (!updatedJob) {
        throw new NotFoundException('Job not found');
      }

      return updatedJob;
    } catch (error) {
      // Preserve our intentional HTTP exceptions
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }

      console.error('Update job status error:', error);

      throw new InternalServerErrorException('Unable to update job status');
    }
  }

  // DELETE /jobs/:id - DELETE JOB
  async remove(id: number) {
    try {
      const result = await this.jobRepository.delete(id);

      if (result.affected === 0) {
        throw new NotFoundException('Job not found');
      }

      return id;
    } catch (error) {
      // Preserve intentional 404
      if (error instanceof NotFoundException) {
        throw error;
      }

      console.error('Delete job error:', error);

      throw new InternalServerErrorException('Unable to delete job');
    }
  }
}
