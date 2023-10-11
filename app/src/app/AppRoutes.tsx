import { lazy } from 'react';

const ClassManagement = lazy(() => import('features/ClassManagement/ClassListContainer'));
const ClassDetail = lazy(() => import('features/ClassManagement/ClassDetailContainer'));
const AddClass = lazy(() => import('features/ClassManagement/AddClassContainer'));
const UserList = lazy(() => import('features/UserManagement/UserListContainer'));
const UserDetail = lazy(() => import('features/UserManagement/UserDetailContainer'));
const TextBookManagement = lazy(() => import('features/TextBookManagement/TextBookListContainer'));
const ReportManagement = lazy(() => import('features/Report'));
const Login = lazy(() => import('features/auth/Login'));
const ForgotPassword = lazy(() => import('features/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('features/auth/ResetPassword'));
const TextBookDetail = lazy(() => import('features/TextBookManagement/TextBookDetailContainer'));
const UnitDetail = lazy(() => import('features/UnitManagement/UnitDetailContainer'));
const ContentDetail = lazy(() => import('features/ContentManagement/ContentDetailContainer'));
const StudentProfiles = lazy(() => import('features/StudentProfiles/StudentProfilesContainer'));
const StudentClass = lazy(() => import('features/StudentClass/StudentClassContainer'));
const ClassCompleted = lazy(() => import('features/ClassCompleted/ClassCompletedContainer'));
const CommunityContainer = lazy(() => import('features/CommunityManagement/CommunityContainer'));
const StudentContent = lazy(() => import('features/StudentContent/StudentContentContainer'));
const StudentUnitListContainer = lazy(() => import('features/StudentUnitList/StudentUnitListContainer'));

export const ANONYMOUS_ROUTES = {
  Login: {
    path: 'login',
    component: Login
  },
  ForgotPassword: {
    path: 'forgot-password',
    component: ForgotPassword
  },
  ResetPassword: {
    path: 'set-password',
    component: ResetPassword
  }
};

export const ADMIN_APP_ROUTES = {
  UserDetails: {
    path: 'users/:id',
    component: UserDetail
  },
  UserCreate: {
    path: 'users/new',
    component: UserDetail
  },
  UserList: {
    path: 'users',
    component: UserList
  },
  ClassManagement: {
    path: 'classes',
    component: ClassManagement
  },
  ClassDetail: {
    path: 'classes/:id',
    component: ClassDetail
  },
  AddClass: {
    path: 'classes/add',
    component: AddClass
  },
  ContentManagement: {
    path: 'textbooks',
    component: TextBookManagement
  },
  ReportManagement: {
    path: 'reports',
    component: ReportManagement
  },
  TextBookDetail: {
    path: 'text-books/:id',
    component: TextBookDetail
  },
  TextBookCreate: {
    path: 'text-books/new',
    component: TextBookDetail
  },
  UnitCreate: {
    path: 'text-books/:textBookId/units/new',
    component: UnitDetail
  },
  UnitDetail: {
    path: 'units/:unitId',
    component: UnitDetail
  },
  ContentCreate: {
    path: 'units/:unitId/contents/new',
    component: ContentDetail
  },
  ContentDetail: {
    path: 'contents/:contentId',
    component: ContentDetail
  }
};

export const STUDENT_APP_ROUTES = {
  ClassCompleted: {
    path: 'class-completed',
    component: ClassCompleted
  },
  StudentClass: {
    path: 'class/:classHashCode',
    component: StudentClass
  },
  StudentProfiles: {
    path: 'profiles',
    component: StudentProfiles
  },
  Community: {
    path: 'community/:mode',
    component: CommunityContainer
  },
  StudentContent: {
    path: 'content/:contentId',
    component: StudentContent
  },
  StudentUnitList: {
    path: 'unit-list',
    component: StudentUnitListContainer
  }
};
