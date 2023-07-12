/* eslint-disable prettier/prettier */
import { Repository, DataSource } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';
import { User } from '../auth/user.entity';

@Injectable()
export class TaskRepository extends Repository<Task> {
  constructor(private dataSource: DataSource) {
    super(Task, dataSource.createEntityManager());
  }

  async getById(id: number, user: User): Promise<Task> {
    const task = await this.findOne({ where: { id: id, userId: user.id } });
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async getTasks(filterDto: GetTaskFilterDto, user: User): Promise<Task[]> {
    const { status, search } = filterDto;
    const qry = this.createQueryBuilder('task');

    qry.where('task.userId = :userId', { userId: user.id }); // retrieving tasks for particular users

    if (status) {
      qry.andWhere('task.status = :status', { status }); // andWhere dont override any other where statments
    }
    if (search) {
      qry.andWhere('task.title LIKE :search OR task.description LIKE :search', {
        search: `%${search}%`,
      });
    }
    const tasks = await qry.getMany();
    return tasks;
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const task = new Task();
    task.title = createTaskDto.title;
    task.description = createTaskDto.description;
    task.user = user;
    task.status = TaskStatus.OPEN;
    await task.save();
    delete task.user;
    return task;
  }

  async deleteTask(id: number, user: User): Promise<void> {
    const result = await this.delete({ id, userId: user.id });
    if (result.affected === 0) {
      throw new NotFoundException('Task not found');
    }
  }

  async updateTaskStatus(
    id: number,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.getById(id, user);
    task.status = status;
    await task.save();
    return task;
  }
}
