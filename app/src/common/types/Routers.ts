import { Permission, SpecificPage } from 'common/consts/permissions';
import { LazyExoticComponent, ReactNode } from 'react';

export interface IAppRoute {
  [key: string]: {
    path: string;
    component: LazyExoticComponent<() => JSX.Element>;
    specificPage?: SpecificPage;
    permission?: Permission;
  };
}

export interface RouteItem {
  path: string;
  title?: string;
  iconComponent?: React.FC;
  component: ReactNode;
  exact?: boolean;
}
