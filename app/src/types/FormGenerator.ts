import React from 'react';

export interface IFieldGroupTemplate {
  name?: string;
  fields: IFormFieldItem[];
  layout?: ILayoutFormGroup;
  dependOn?: (formInstance: object) => boolean;
}

export interface ILayoutFormGroup {
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  [key: string]: any;
}

export interface IOptionField {
  id: number | string;
  name: string;
  [key: string]: any;
}
export type FormControlType =
  | 'text'
  | 'select'
  | 'checkbox'
  | 'switch'
  | 'radio'
  | 'date'
  | 'autocomplete'
  | 'file'
  | 'number';

export interface IFormFieldItem {
  name: string;
  type: FormControlType | string;
  label?: string | React.ReactNode;
  data?: IOptionField[];
  selfLayout?: ILayoutFormGroup;
  multiline?: boolean;
  rows?: number;
  rules?: object;
  required?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
  staticField?: boolean;
  dependOn?: string | ((formInstance: object) => boolean);
  render?: (formInstance: object) => void;
  filterData?: (data: IOptionField[], formInstance: object) => IOptionField[];
  propsDependsOnValue?: (formInstance: object) => Record<string, object>;
  helperText?: string | ((formValues: object, data: IOptionField[]) => string);
  defaultValue?: any;
  [key: string]: any;
}
