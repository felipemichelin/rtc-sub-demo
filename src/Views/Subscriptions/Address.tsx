import React from "react";
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  root: {
    maxWidth: 500,
    spacing: 5,
  },
  successMessage: {
    fontSize: 14,
    color: "#4caf50"
  },
  shipToLabel: {
    fontSize: 12,
    color: "#0000008a",
    marginTop: 15
  }
});

interface AddressProps {
  address: any;
  onEditAddress: any;
}

export function Address(props:AddressProps) {
  const classes = useStyles();

  const hasAddress2 = props.address.address2 && props.address.address2.length;

  return (
    <>
      <Grid container spacing={0}>
        <Grid item xs={12}>
          <Typography variant="h6" component="h6" className={classes.shipToLabel}>
            Ships To:
          </Typography>
        </Grid>
        <Grid item xs={12}>
        {props.address.first_name} {props.address.last_name}
        </Grid>

        <Grid item xs={12}>
        {props.address.address1}
        </Grid>

        {hasAddress2 && (
          <Grid item xs={12}>
          {props.address.address2}
          </Grid>
        )}

        <Grid item xs={12}>
        {props.address.city}, {props.address.province} {props.address.zip}
        </Grid>

        <Grid item xs={12}>
        {props.address.country}
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Button size="small" variant="outlined" onClick={props.onEditAddress} style={{marginTop: 10}}>
          Update
        </Button>
      </Grid>
    </>
  )
};

export default Address;
