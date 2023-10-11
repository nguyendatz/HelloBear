export interface RoleMapping {
  [key: string]: string;
}
export const roleKeys = {
  Administrator: 'Administrator',
  Teacher: 'Teacher'
};

export const Roles = {
  SuperAdmin: 'SuperAdmin',
  Administrator: 'Administrator',
  Teacher: 'Teacher'
};

export const roleMapping: RoleMapping = {
  [roleKeys.Administrator]: 'Administrator',
  [roleKeys.Teacher]: 'Teacher'
};

export const RoleList = [Roles.Administrator, Roles.Teacher];

export default roleMapping;
