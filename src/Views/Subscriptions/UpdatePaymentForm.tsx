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
  state: yup.string().required(),
  postal_code: yup.string().required(),
  country: yup.string().required(),
  phone: yup.string().required(),
  cc_number: yup.string().required(),
  cc_exp_month: yup.string().required(),
  cc_exp_year: yup.string().required(),
  cc_cvv: yup.string().required(),

});

interface Address {
  first_name: string,
  last_name: string,
  address1: string;
  address2: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}


interface AddressFormProps {
  onCancelUpdatePayment: any;
  onUpdatePayment: any;
  subscription: any;
}

export default function UpdatePaymentForm(props: AddressFormProps) {
  const formik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      postal_code: "",
      country: "",
      phone: "",
      cc_number: "",
      cc_exp_month: "",
      cc_exp_year: "",
      cc_cvv: "",
    },
    validationSchema: validationSchema,
    onSubmit: props.onUpdatePayment
  });

  return (
    <div style={{padding: 15, border: "1px solid #eee"}}>
      <h3>Update Billing Details</h3>
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
          label="Last Name"
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
          value={formik.values.state}
          onChange={formik.handleChange}
          error={formik.touched.state && Boolean(formik.errors.state)}
          helperText={formik.touched.state && formik.errors.state}
        />

        <TextField
          fullWidth
          id="postal_code"
          name="postal_code"
          label="Zip / Postal Code"
          value={formik.values.postal_code}
          onChange={formik.handleChange}
          error={formik.touched.postal_code && Boolean(formik.errors.postal_code)}
          helperText={formik.touched.postal_code && formik.errors.postal_code}
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

        <TextField
          fullWidth
          id="phone"
          name="phone"
          label="Phone"
          value={formik.values.phone}
          onChange={formik.handleChange}
          error={formik.touched.phone && Boolean(formik.errors.phone)}
          helperText={formik.touched.phone && formik.errors.phone}
        />


        <TextField
          fullWidth
          id="cc_number"
          name="cc_number"
          label="Credit Card Number"
          value={formik.values.cc_number}
          onChange={formik.handleChange}
          error={formik.touched.cc_number && Boolean(formik.errors.cc_number)}
          helperText={formik.touched.cc_number && formik.errors.cc_number}
        />

        <TextField
          fullWidth
          id="cc_exp_month"
          name="cc_exp_month"
          label="Expration Month"
          value={formik.values.cc_exp_month}
          onChange={formik.handleChange}
          error={formik.touched.cc_exp_month && Boolean(formik.errors.cc_exp_month)}
          helperText={formik.touched.cc_exp_month && formik.errors.cc_exp_month}
        />

        <TextField
          fullWidth
          id="cc_exp_year"
          name="cc_exp_year"
          label="Expiration Year"
          value={formik.values.cc_exp_year}
          onChange={formik.handleChange}
          error={formik.touched.cc_exp_year && Boolean(formik.errors.cc_exp_year)}
          helperText={formik.touched.cc_exp_year && formik.errors.cc_exp_year}
        />

        <TextField
          fullWidth
          id="cc_cvv"
          name="cc_cvv"
          label="CVV"
          value={formik.values.cc_cvv}
          onChange={formik.handleChange}
          error={formik.touched.cc_cvv && Boolean(formik.errors.cc_cvv)}
          helperText={formik.touched.cc_cvv && formik.errors.cc_cvv}
        />



        <Grid item xs={12}>
        <Button  variant="outlined" size="small" type="submit">
          Submit
        </Button>
        <Button  variant="outlined" size="small" type="button" onClick={props.onCancelUpdatePayment}>
          Cancel
        </Button>
        </Grid>
      </form>
    </div>
  );
};


/*
import React from 'react';
import Amplify from 'aws-amplify';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';





export default function UpdatePaymentForm(props:any) {
  return (
    <div style={{padding: 15, border: "1px solid #eee"}}>
      <h3>Payment Form</h3>
      {props.subscription.gateway}
      <form>
        <Grid item xs={12}>
        <Button  variant="outlined" size="small" type="submit">
          Submit
        </Button>
        </Grid>

      </form>

    </div>
  )
}
*/
