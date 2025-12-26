import React, { useState } from 'react';
import {
  Grid,
  TextField,
  Button,
  Typography,
  Box,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
  FormControl,
} from '@mui/material';

const CustomForm = ({ formTitle, onSubmit, fields }) => {
  const [formData, setFormData] = useState(
    fields.reduce((acc, field) => ({ ...acc, [field.name]: field.value || '' }), {})
  );

  const [errors, setErrors] = useState({});

  const validateField = (name, value, validationFn) => {
    if (validationFn) {
      const result = validationFn(value);
      return result === true ? '' : result;
    }
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const field = fields.find(f => f.name === name);
    const error = validateField(name, value, field?.validation);

    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let hasError = false;
    const newErrors = {};

    fields.forEach(field => {
      const value = formData[field.name];
      const error = validateField(field.name, value, field.validation);
      if (error) hasError = true;
      newErrors[field.name] = error;
    });

    setErrors(newErrors);

    if (!hasError) {
      onSubmit(formData);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} >
      <Typography variant="h5" mb={2}>
        {formTitle}
      </Typography>
      <Grid container spacing={2}>
        {fields.map((field, index) => (
          <Grid item xs={12} sm={field.grid || 12} key={index}>
            {(() => {
              const commonProps = {
                fullWidth: true,
                name: field.name,
                label: field.label,
                value: formData[field.name],
                onChange: handleChange,
                required: field.required || false,
                error: Boolean(errors[field.name]),
                helperText: errors[field.name] || '',
              };

              switch (field.type) {
                case 'select':
                  return (
                    <TextField select {...commonProps}>
                      {field.options?.map((opt, i) => (
                        <MenuItem key={i} value={opt.value}>
                          {opt.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  );
                case 'date':
                  return (
                    <TextField
                      {...commonProps}
                      type="date"
                      InputLabelProps={{ shrink: true }}
                    />
                  );
                case 'radio':
                  return (
                    <FormControl fullWidth error={Boolean(errors[field.name])}>
                      <FormLabel>{field.label}</FormLabel>
                      <RadioGroup
                        row
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleChange}
                      >
                        {field.options?.map((opt, i) => (
                          <FormControlLabel
                            key={i}
                            value={opt.value}
                            control={<Radio />}
                            label={opt.label}
                          />
                        ))}
                      </RadioGroup>
                      {errors[field.name] && (
                        <Typography variant="caption" color="error">
                          {errors[field.name]}
                        </Typography>
                      )}
                    </FormControl>
                  );
                default:
                  return (
                    <TextField
                      {...commonProps}
                      type={field.type || 'text'}
                    />
                  );
              }
            })()}
          </Grid>
        ))}
        <Grid item xs={12}>
          <Button type="submit" variant="contained"
          style={{ backgroundColor: "#FF7300", color: "white" }}
          >
            Submit
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CustomForm;
