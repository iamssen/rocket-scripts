import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Link, Route, Switch } from 'react-router-dom';

function App() {
  return (
    <div>
      <header>
        <Link to="/">Index</Link>
        <Link to="/a">A</Link>
        <Link to="/b">B</Link>
      </header>
      <section>
        <Switch>
          <Route exact path="/">
            <div>Index</div>
          </Route>
          <Route path="/a">
            <div>A</div>
          </Route>
          <Route path="/b">
            <div>B</div>
          </Route>
        </Switch>
      </section>
    </div>
  );
}

render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.querySelector('#app'),
);

// Hot Module Replacement
if (module.hot) {
  module.hot.accept();
}
