import { ProjectModel } from './project.model';
import { TaskModel } from './task.model';

export interface UserModel {
  _id_user: string;
  name_user: string;
  email: string;
  image_link?: string;
  role?: string | '';
  adress?: string | '';
  contract?: string | '';
  mdp: string;
  confirm_mdp: string;
  infos_user: string;


}
