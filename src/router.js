import React from 'react';
import { Router, Route, Switch } from 'dva/router';
import Example from './components/Example';
import Home from './components/Home'

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/" exact component={Example} />
        <Route path="/home" exact component={Home} />
      </Switch>
    </Router>
  );
}

export default RouterConfig;
