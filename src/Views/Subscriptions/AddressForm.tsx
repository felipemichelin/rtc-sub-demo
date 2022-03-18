import React from 'react';
import Amplify from 'aws-amplify';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';

const validationSchema = yup.object({
  first_name: yup.string().required(),
  last_name: yup.string().required(),
  address1: yup.string().required(),
  address2: yup.string().nullable(),
  city: yup.string().required(),
  province: yup.string().required(),
  zip: yup.string().required(),
  country: yup.string().required(),
});

interface Address {
  first_name: string,
  last_name: string,
  address1: string;
  address2: string;
  city: string;
  province: string;
  zip: string;
  country: string;
}


interface AddressFormProps {
  address: Address;
  onCancelUpdateAddress: any;
  onUpdateSubscriptionAddress: any;
}

const AddressForm = (props: AddressFormProps) => {

  const formik = useFormik({
    initialValues: props.address,
    validationSchema: validationSchema,
    onSubmit: props.onUpdateSubscriptionAddress
  });

  return (
    <div style={{padding: 15, border: "1px solid #eee"}}>
      <form onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth
          id="first_name"
          name="first_name"
          label="First Name"
          value={formik.values.first_name}
          onChange={formik.handleChange}
          error={formik.touched.first_name && Boolean(formik.errors.first_name)}
          helperText={formik.touched.first_name && formik.errors.first_name}
        />

        <TextField
          fullWidth
          id="last_name"
          name="last_name"
          label="Last hostname"
          value={formik.values.last_name}
          onChange={formik.handleChange}
          error={formik.touched.last_name && Boolean(formik.errors.last_name)}
          helperText={formik.touched.last_name && formik.errors.last_name}
        />


        <TextField
          fullWidth
          id="address1"
          name="address1"
          label="Address 1"
          value={formik.values.address1}
          onChange={formik.handleChange}
          error={formik.touched.address1 && Boolean(formik.errors.address1)}
          helperText={formik.touched.address1 && formik.errors.address1}
        />
        <TextField
          fullWidth
          id="address2"
          name="address2"
          label="Address 2"
          value={formik.values.address2}
          onChange={formik.handleChange}
          error={formik.touched.address2 && Boolean(formik.errors.address2)}
          helperText={formik.touched.address2 && formik.errors.address2}
        />

        <TextField
          fullWidth
          id="city"
          name="city"
          label="City"
          value={formik.values.city}
          onChange={formik.handleChange}
          error={formik.touched.city && Boolean(formik.errors.city)}
          helperText={formik.touched.city && formik.errors.city}
        />

        <TextField
          fullWidth
          id="state"
          name="state"
          label="State/Province"
          value={formik.values.province}
          onChange={formik.handleChange}
          error={formik.touched.province && Boolean(formik.errors.province)}
          helperText={formik.touched.province && formik.errors.province}
        />

        <TextField
          fullWidth
          id="zip"
          name="zip"
          label="Zip / Postal Code"
          value={formik.values.zip}
          onChange={formik.handleChange}
          error={formik.touched.zip && Boolean(formik.errors.zip)}
          helperText={formik.touched.zip && formik.errors.zip}
        />

        <TextField
          fullWidth
          id="country"
          name="country"
          label="Country"
          value={formik.values.country}
          onChange={formik.handleChange}
          error={formik.touched.country && Boolean(formik.errors.country)}
          helperText={formik.touched.country && formik.errors.country}
        />

        <Grid item xs={12}>
        <Button  variant="outlined" size="small" type="submit">
          Submit
        </Button>
        <Button  variant="outlined" size="small" type="button" onClick={props.onCancelUpdateAddress}>
          Cancel
        </Button>
        </Grid>
      </form>
    </div>
  );
};

export default AddressForm;
