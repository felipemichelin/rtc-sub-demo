import React from "react";
import { API } from "aws-amplify";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import IndexSubscriptionCard from "./IndexSubscriptionCard";
import { LocalCart } from '../../local-cart';

interface SubscriptionsIndexProps {
  setTitle: Function;
}

interface SubscriptionsListProps {
  subscriptions: any;
}


const useStyles = makeStyles({
  root: {
  },
  title: {
    fontSize: 14,
  },
});


function SubscriptionCards(props:any) {
  return props.subscriptions.map((x:any) => (<IndexSubscriptionCard key={x.id} subscription={x} onUpdateSubscriptionDate={props.onUpdateSubscriptionDate} />));
}


function SubscriptionsList(props:SubscriptionsListProps) {
  return (

    <Grid container direction={"row"}  alignItems="flex-start" spacing={2} >
      <SubscriptionCards {...props} />
    </Grid>
  )
}

export default function SubscriptionsIndex(props: SubscriptionsIndexProps) {
  const [ subscriptions, setSubscriptions ] = React.useState<null|any>(null);

  const loadSubscriptions = async () => {
    const raw = await API.get("subscriber", "/subscriptions", {});
    if (!raw.subscriptions) {
      alert("An error occurred while trying to load your subscriptions.  Please contact customer support");
      return;
    }

    let subs = raw.subscriptions.filter((x:any) => x.nextRenewal > 1);
    subs.forEach((sub:any) => {
      sub.currencyCart = new LocalCart(sub.currencyCart);
    })
    setSubscriptions(subs);
  }



  React.useEffect(()=> {
    if (!subscriptions) {
      loadSubscriptions();
    }
    props.setTitle("Subscriptions");
  });

  return subscriptions === null ? null : (
      <SubscriptionsList subscriptions={subscriptions} />
  )
}
