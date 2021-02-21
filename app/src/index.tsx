import whyDidYouRender from '@welldone-software/why-did-you-render';
import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom';

import ComparisonHome from './components/Comparison/ComparisonHome';
import ExploreHome from './components/Explore/ExploreHome';
import ProjectHome from './components/Project/ProjectHome';
import './index.css';

whyDidYouRender(React, {
  trackAllPureComponents: true,
  exclude: [/XGrid|RowCells|GridCell/],
});

const search = window.location.search;

const app = (
  <HashRouter>
    <Switch>
      <Redirect from="/" to={{ pathname: '/project', search }} exact />
      <Route component={ExploreHome} path="/explore" exact />
      <Route component={ProjectHome} path="/project" exact />
      <Route component={ComparisonHome} path="/compare" exact />
    </Switch>
  </HashRouter>
);

ReactDOM.render(app, document.getElementById('root'));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// TODO: Uncomment
// reportWebVitals();
