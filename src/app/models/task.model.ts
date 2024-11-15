import { ProjectModel } from './project.model';
import { UserModel } from './user.model';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';

export interface TaskModel {
  _id_task: string;
  name_task: string;
  description_task: string;
  createdAt: Date;
  updatedAt?: Date;
  _user_id: string;
  status: string;
  isUrgent: boolean;
}
