import { SearchOutlined } from '@mui/icons-material';
import { InputAdornment, TextField, TextFieldProps } from '@mui/material';

type SearchTextFieldProps = TextFieldProps & {
  // defined custom props here
};

const SearchTextField = ({ id, placeholder, InputProps, sx, ...restProps }: SearchTextFieldProps) => {
  return (
    <TextField
      id={id}
      placeholder={placeholder}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchOutlined />
          </InputAdornment>
        ),
        ...InputProps
      }}
      variant="outlined"
      fullWidth
      sx={{ ...sx }}
      {...restProps}
    />
  );
};

export default SearchTextField;
