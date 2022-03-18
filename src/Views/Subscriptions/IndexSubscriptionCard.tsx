import React from 'react';
import { Link } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import { format } from 'date-fns';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { useHistory } from "react-router-dom";
import DateFnsUtils from '@date-io/date-fns'; // choose your lib

import {
  KeyboardDatePicker,
  TimePicker,
  DateTimePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';

const useStyles = makeStyles({
  root: {
    maxWidth: 500,
    spacing: 5,
  },
  grid: {
    spacing: 5
  }
});


interface SubscriptionCardProps {
  subscription:any;
}

function VariantDisplayNames(props:any) {
  const rows : any = [];
  props.subscription.currencyCart.lineItems.forEach((x:any) => {
    rows.push(
      <div key={`variantDisplayName${x.variantId}`}>
      <Typography gutterBottom variant="h5" component="h2">
      {x.displayName}
      </Typography>
      </div>
    );
  });
  return rows;
}

export default function IndexSubscriptionCard(props:any) {
  const classes = useStyles();
  const history = useHistory();

  return (
    <Grid item xs={4}>
      <Card className={classes.root} variant="outlined">
{/*
          <CardMedia
            component="img"
            alt={props.subscription.variant.displayName}
            height="140"
            image={props.subscription.variant.image.src}
            title={props.subscription.variant.displayName}
          />
*/}
          <CardContent>
            <Grid container>
              <Grid item xs={12}>
                  <h3>Items</h3>
                  <VariantDisplayNames {...props} />
                  <Typography gutterBottom variant="h5" component="h2">
                    Next Renewal: {(new Date(props.subscription.nextRenewal)).toISOString()}
                  </Typography>

{/*
                  {props.subscription.variant.displayName}
*/}
              </Grid>
            </Grid>
          </CardContent>
        <CardActions>
        <Button  size="small" variant="outlined" onClick={()=> { history.push(`/subscriptions/${props.subscription.id}`)}}>
          Manage
        </Button>

        </CardActions>
      </Card>
    </Grid>
  );
}
