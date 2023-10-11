import { IOption } from 'common/types/IOption';

export const getEnumOptions = (enumLabels: { [key: string]: string }) => {
  const keys = Object.keys(enumLabels);

  return keys.map((key) => ({ value: key, label: enumLabels[key] } as IOption));
};
