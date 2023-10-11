import { roleKeys } from './roles';

export enum Permission {
  All = 'All',
  Create = 'Create',
  Edit = 'Edit',
  Delete = 'Delete',
  Reaction = 'Reaction',
  Upload = 'Upload'
}

export enum SpecificPage {
  Users = 'Users',
  Class = 'Class',
  Contents = 'Contents',
  Reports = 'Reports',
  Community = 'Community'
}

export const AdminPermission = `${Permission.All}:${Permission.All}`;

export const getSpecificPermission = (specificPerPage: SpecificPage, permission: Permission) => {
  return `${specificPerPage}:${permission}`;
};
const AppRolesPermissions = {
  [roleKeys.Administrator]: [AdminPermission],
  [roleKeys.Teacher]: [
    getSpecificPermission(SpecificPage.Class, Permission.All),
    getSpecificPermission(SpecificPage.Community, Permission.All)
  ]
};

export const getUserPermissions = (role?: string) => {
  return role ? AppRolesPermissions[role] : [];
};

export const checkUserPermission = (specificPage: SpecificPage, permission: Permission, userPermissions: string[]) => {
  // Full permission to system
  if (userPermissions.includes(AdminPermission)) {
    return true;
  }

  // Full permission to page
  const page = specificPage.split(':')[0];
  const pagePermission = getSpecificPermission(page as SpecificPage, Permission.All);
  if (userPermissions.includes(pagePermission)) {
    return true;
  }

  // Full permission to specific functions in page
  let specificPermission = getSpecificPermission(specificPage, Permission.All);
  if (userPermissions.includes(specificPermission)) {
    return true;
  }

  // Have permission to specific function in page
  specificPermission = getSpecificPermission(specificPage, permission);
  if (userPermissions.includes(specificPermission)) {
    return true;
  }

  return false;
};
