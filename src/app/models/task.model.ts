import { ProjectModel } from './project.model';
import { UserModel } from './user.model';

export interface TaskModel {
  _id_task: string;
  name_task: string;
  description_task: string;
  createdAt: Date;
  updatedAt?: Date;
  _user_id: string;
  status: string;
}
