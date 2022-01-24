import React from "react";
import { Link, Switch, Route, Redirect } from 'react-router-dom'
import './App.css'
// Containers
import Login from './componants/login'
import Home from './componants/home'
import HistoryRides from './componants/historyRides'

// const history = createBrowserHistory();

const App = () => {
  return (
    <Switch>
      <Route path="/" component={Login} exact={true} />
      <Route path="/home" component={Home} exact={true} />
      <Route path="/historyRides" component={HistoryRides} exact={true} />
    </Switch>
  );
};

export default App;
