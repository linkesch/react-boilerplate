import React from 'react';
import { Router, Route, Link } from 'react-router';
import App from '../components/App';

/*jshint ignore:start */
React.render((
  <Router>
    <Route path="/" name="home" component={App} />
  </Router>
), document.getElementById('app'));
/*jshint ignore:end */
