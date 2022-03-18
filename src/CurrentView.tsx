import React from 'react';
import clsx from 'clsx';
import Typography from '@material-ui/core/Typography';
import SubscriptionsShow  from './Views/Subscriptions/Show';
import SubscriptionsIndex from './Views/Subscriptions/Index';

import {
 BrowserRouter as Router,
 Switch,
 Route,
 Link,
 useParams
} from "react-router-dom";

interface HeaderProps {
  open:boolean;
  classes:any;
  handleDrawerOpen:any;
  handleDrawerClose:any;
  theme: any;
  setTitle:Function;
}

export default function CurrentView (props: HeaderProps) {
  return (
    <Switch>
      <Route path="/subscriptions/:subscriptionID">
        <SubscriptionsShow setTitle={props.setTitle} />
      </Route>
      <Route path="/">
        <SubscriptionsIndex setTitle={props.setTitle} />
      </Route>
    </Switch>
  )
}
