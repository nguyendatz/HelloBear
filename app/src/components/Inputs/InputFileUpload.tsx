import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Button, FormControl, FormHelperText, FormLabel } from '@mui/material';
import { Control, Controller, FieldValues } from 'react-hook-form';

interface IProps {
  name: string;
  label?: string;
  control: Control<FieldValues>;
}
const InputFileUpload = ({ name = '', control, label = 'Upload' }: IProps) => {
  const id = `upload-${name}`;
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { ref, ...field }, fieldState: { error } }) => (
        <FormControl margin="dense">
          <FormLabel htmlFor={id}>
            <input
              {...field}
              id={id}
              name={name}
              accept="image/*"
              type="file"
              value={''}
              ref={ref}
              style={{ display: 'none' }}
              onChange={(e) => {
                const file = e.target?.files && e.target.files[0];
                if (file) {
                  field.onChange(file);
                }
              }}
            />
            <Button variant="contained" component="span" endIcon={<CloudUploadIcon />}>
              {label}
            </Button>
            {' ' + (field?.value.name ?? '')}
            {error && <FormHelperText error>{error.message}</FormHelperText>}
          </FormLabel>
        </FormControl>
      )}
    />
  );
};

export default InputFileUpload;
