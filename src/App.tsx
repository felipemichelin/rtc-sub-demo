import React from 'react';
import './App.css';
import Amplify, { API } from 'aws-amplify'
import { AmplifyAuthenticator, AmplifySignIn } from '@aws-amplify/ui-react';
import { AuthState, onAuthUIStateChange, CognitoUserInterface } from '@aws-amplify/ui-components';
import { SignedIn } from './SignedIn';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

const theme = createMuiTheme({
  palette: {
    type: "light",
  }
});

window.LOG_LEVEL = 'DEBUG';

declare global {
    interface Window { Amplify: any; API: any, jwt_rest: any; tmp: any; LOG_LEVEL:string; }
}

const App: React.FunctionComponent = () => {
    const [ amplifyReady, setAmplifyReady ] = React.useState<boolean>(false);

    const configAmplify = async () => {
      let apiEndpoint = null;
      if (window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost") {
        apiEndpoint = "https://fpz7vixdp0.execute-api.us-east-1.amazonaws.com/v1";
      } else {
        apiEndpoint = window.location.origin + "/v1";
      }
      console.log("apiEndpoint", apiEndpoint);
      const data = await window.fetch(`${apiEndpoint}/meta`);
      const meta = await data.json();

      Amplify.configure({
        Auth: {
          region: 'us-east-1',
          identityPoolId: meta.identityPoolId,
          userPoolId: meta.userPoolId,
          userPoolWebClientId: meta.userPoolClientId, // actually the user pool client id.,
        },
        API: {
            endpoints: [{ name: "subscriber", endpoint: `https://${meta.apiGateway}/v1`}]
        }
      });
      console.log(Amplify, API);
      setAmplifyReady(true);
      window.Amplify = Amplify;
      window.API = API;
      console.log(meta);
    };

    React.useEffect(()=> {
        if (!amplifyReady) {
          configAmplify();
        }
    }, [amplifyReady]);

    return !amplifyReady ? null : (
      <AuthStateApp />
    );
}

const AuthStateApp: React.FunctionComponent = () => {
    const [authState, setAuthState] = React.useState<AuthState>();
    const [user, setUser] = React.useState<CognitoUserInterface | undefined>();

    React.useEffect(() => {
        onAuthUIStateChange((nextAuthState:any, authData:any) => {
            setAuthState(nextAuthState);
            setUser(authData as CognitoUserInterface)
        });
    }, []);


  return authState === AuthState.SignedIn && user ? (
      <ThemeProvider theme={theme}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <SignedIn />
        </MuiPickersUtilsProvider>
      </ThemeProvider>
  ) : (
    <AmplifyAuthenticator usernameAlias="email">
      <AmplifySignIn slot="sign-in">
        <div slot="secondary-footer-content"></div>
      </AmplifySignIn>
    </AmplifyAuthenticator>
  );
}

export default App;
