import React from "react";
import { API } from "aws-amplify";
import { Link, useParams } from "react-router-dom";
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';

import AddressForm from "./AddressForm";
import UpdatePaymentForm from "./UpdatePaymentForm";
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import { Address }  from "./Address";
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';

import { KeyboardDatePicker } from '@material-ui/pickers';

interface SubscriptionsShowProps {
  setTitle:Function;
}

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



function CancelSubscription(props:any) {
  return (
    <>
      <Typography variant="body2" color="textSecondary" component="p">
        Permanently cancel this subscription?
      </Typography>
      <Button  size="small" variant="outlined" onClick={()=> { props.setIsCancellingSubscription(false); }}>
        Cancel
      </Button>
      <Button  size="small" variant="outlined" onClick={()=> { props.onCancelSubscription()}}>
        Confirm
      </Button>
    </>
  )
}


function SkipConfirm(props:any) {
  return (
    <>
      <Typography variant="body2" color="textSecondary" component="p">
        Skip your next shipment?
      </Typography>
      <Button  size="small" variant="outlined" onClick={()=> { props.setIsSkipping(false); }}>
        Cancel
      </Button>
      <Button  size="small" variant="outlined" onClick={()=> { props.onSkip()}}>
        Confirm
      </Button>
    </>
  )
}

export default function SubscriptionsShow(props:SubscriptionsShowProps) {
  const [ subscription, setSubscriptionState ] = React.useState<any|null>(null);
  const [ successMessage, setSuccessMessage ] = React.useState<string|null>(null);
  const [ isAddressEditing, setIsAddressEditing ] = React.useState<boolean>(false);
  const [ isSkipping, setIsSkipping] = React.useState<boolean>(false);
  const [ isPaymentUpdating, setIsPaymentUpdating] = React.useState<boolean>(false);
  const [ isCancellingSubscription, setIsCancellingSubscription ] = React.useState<boolean>(false);
  const params : any = useParams();
  const subscriptionID = params.subscriptionID
  const classes = useStyles();

  const setSubscription = (val:any) => {
    val.isCancelled = val.nextRenewal < 1;
    setSubscriptionState(val);
  }

  const loadSubscription = async () => {
    const newSub = await API.get("subscriber", `/subscriptions/${subscriptionID}`, {});
    if (!newSub || !newSub.subscription) {
      alert("Unable to load subscription, please contact customer support");
    }
    setSubscription(newSub.subscription);
  };

  React.useEffect(()=> {
    if (subscription === null) {
      loadSubscription();
    }
    props.setTitle("Updating Subscription");
  });


  const onUpdateSubscriptionDate = async (data:any) => {

    const newSub = Object.assign({}, subscription, { nextRenewal: data.nextRenewal });
    setSubscription(newSub);
    try {
      const result = await API.put("subscriber", `/subscriptions/${data.id}`, { body: data });
      if (!result.subscription) {
        throw "nosub";
      }
      setSubscription(result.subscription);
      setSuccessMessage("Saved");
    } catch(err) {
      alert("An error occurred while saving your subscription, please contact customer support.");
    }
  }

  const onCancelUpdateAddress = (e:any) => {
    setIsAddressEditing(false);
  }


  const onCancelUpdatePayment = (e:any) => {
    setIsPaymentUpdating(false);
  }
  const onEditAddress = (e:any) => {
    setIsAddressEditing(true);
  }

  const onUpdateSubscriptionAddress = async (data:any) => {
    const newSub = Object.assign({}, subscription);
    newSub.shippingAddress = data;
    setSubscription(newSub);
    setIsAddressEditing(false);
    try {
      const result = await API.put("subscriber", `/subscriptions/${subscription.id}`, { body: { shippingAddress: data } });
      if (!result.subscription) {
        throw "nosub";
      }
      setSubscription(result.subscription);
      setSuccessMessage("Saved");
    } catch(err) {
      alert("An error occurred while saving your subscription, please contact customer support.");
    }
  }

  const onUpdateRenewalPeriod = async (data:any) => {
    const newSub = Object.assign({}, subscription);
    newSub.renewalPeriodDays = parseFloat(data.currentTarget.value);
    setSubscription(newSub);
    try {
      const result = await API.put("subscriber", `/subscriptions/${subscription.id}`, { body: { renewalPeriodDays: newSub.renewalPeriodDays } });
      if (!result.subscription) {
        throw "nosub";
      }
      setSubscription(result.subscription);
      setSuccessMessage("Saved");
    } catch(err) {
      alert("An error occurred while saving your subscription, please contact customer support.");
    }
  }


  const onSkip = async (data:any) => {
    setIsSkipping(false);

    const newSub = Object.assign({}, subscription);
    newSub.nextRenewal = newSub.nextRenewal + 86400 * 1000 * newSub.renewalPeriodDays;

    setSubscription(newSub);
    try {
      const result = await API.put("subscriber", `/subscriptions/${subscription.id}`, { body: { nextRenewal: newSub.nextRenewal } });
      if (!result.subscription) {
        throw "nosub";
      }
      setSubscription(result.subscription);
      setSuccessMessage("Saved");
      console.log("RESULT!");
      console.log(JSON.stringify(result, null, 4));
    } catch(err) {
      alert("An error occurred while saving your subscription, please contact customer support.");
    }



  };


  const onUpdatePayment = async (data:any) => {

    const req = {
      billing: {
        first_name: data.first_name,
        last_name: data.last_name,
        address1: data.address1,
        address2: data.address2,
        city: data.city,
        state: data.state,
        postal_code: data.postal_code,
        country: data.country,
        phone: data.phone
      },
      cc_number: data.cc_number,
      cc_exp_month: data.cc_exp_month,
      cc_exp_year: data.cc_exp_year,
      cc_cvv: data.cc_cvv
    }

    let result = null;

    try {
      result = await API.post("subscriber", `/subscriptions/${subscription.id}/update_billing`, { body: req });
    } catch(err) {
      if (err.response && err.response.data && err.response.data.error) {
        alert(err.response.data.error);
      } else {
        alert(`Unfortunately, we were unable to process your credit card.  Please check the billing details and try again, or use a different card.`);
      }
    }
    setSubscription(result.subscription);
    setSuccessMessage("Saved");
    setIsPaymentUpdating(false);
  }

  const onCancelSubscription = async (data:any) => {
    setIsCancellingSubscription(false);

    const newSub = Object.assign({}, subscription);
    newSub.nextRenewal = 0;
    setSubscription(newSub);
    try {
      const result = await API.put("subscriber", `/subscriptions/${subscription.id}`, { body: { nextRenewal: 0 } });
      if (!result.subscription) {
        throw "nosub";
      }
      setSubscription(result.subscription);
      setSuccessMessage("Saved");
      console.log("RESULT!");
      console.log(JSON.stringify(result, null, 4));
    } catch(err) {
      alert("An error occurred while saving your subscription, please contact customer support.");
    }



  };

  return !subscription ? null : (
    <Grid item xs={4}>
      <Card className={classes.root} variant="outlined">
{/*
          <CardMedia
            component="img"
            alt={subscription.variant.displayName}
            height="140"
            image={subscription.variant.image.src}
            title={subscription.variant.displayName}
          />
*/}
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12}>
{/*
                <Typography gutterBottom variant="h5" component="h2">
                  {subscription.variant.displayName}
                </Typography>
*/}
              </Grid>

              {successMessage && (
                <Grid item xs={12}>
                  <Typography gutterBottom variant="h6" component="h6" className={classes.successMessage}>
                    {successMessage}
                  </Typography>
                </Grid>
              )}

              {!subscription.isCancelled && (
                <>
                  <Grid item xs={12}>
                    <KeyboardDatePicker
                      label="Next Order"
                      disablePast={true}
                      value={new Date(subscription.nextRenewal)}
                      onChange={(date: any) => {
                        onUpdateSubscriptionDate({ nextRenewal: +date, id: subscription.id});
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <label>Renewal Period</label>
                    <select value={subscription.renewalPeriodDays} onChange={onUpdateRenewalPeriod}>
                      <option value="15">15 Days</option>
                      <option value="30">30 Days</option>
                      <option value="60">60 Days</option>
                      <option value="90">90 Days</option>
                    </select>
                  </Grid>



                  <Grid item container xs={12}>
                    {!isAddressEditing ? ( <Address onEditAddress={onEditAddress} address={subscription.shippingAddress} /> ) : (
                      <AddressForm onUpdateSubscriptionAddress={onUpdateSubscriptionAddress} onCancelUpdateAddress={onCancelUpdateAddress} address={subscription.shippingAddress} />
                    )}
                  </Grid>

                  <Grid item container xs={12}>
                    {isPaymentUpdating ? (<UpdatePaymentForm onUpdatePayment={onUpdatePayment} onCancelUpdatePayment={onCancelUpdatePayment} subscription={subscription} />) : (
                      <Button size="small" variant="outlined" onClick={()=> { setIsPaymentUpdating(true); }}>
                        Update Billing
                      </Button>
                    )}
                  </Grid>


                  <Grid item>
                    {isCancellingSubscription ? (<CancelSubscription onCancelSubscription={onCancelSubscription} setIsCancellingSubscription={setIsCancellingSubscription} />) : (
                      <Button size="small" variant="outlined" onClick={()=> { setIsCancellingSubscription(true); }}>
                        Cancel Subscription
                      </Button>
                    )}
                  </Grid>

                  <Grid item>
                    {isSkipping ? (<SkipConfirm onSkip={onSkip} setIsSkipping={setIsSkipping} />) : (
                      <Button size="small" variant="outlined" onClick={()=> { setIsSkipping(true); }}>
                        Skip Next Shipment
                      </Button>
                    )}
                  </Grid>
                </>
              )}

              {subscription.isCancelled && (
                <Grid item>
                  <Typography component="h6" variant="h6">
                  This subscription has ended
                  </Typography>
                </Grid>
              )}


            </Grid>
          </CardContent>
      </Card>
    </Grid>
  );

}
