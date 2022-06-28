import React from 'react';
import ReactDOM from 'react-dom';
import { StaticRouter, BrowserRouter as Router } from 'react-router-dom';
import './index.css';
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './client/reducers'
import { composeWithDevTools } from 'redux-devtools-extension';
import * as serviceWorker from './serviceWorker';
import Routes from './client/components/routes';
import {  Route, Switch } from 'react-router'
import App from './client/components/App';
const initialStore={};
const store = createStore(rootReducer, initialStore,
  composeWithDevTools(
    applyMiddleware(
      thunk
    )
  ))

const renderRoutes = ()=> {
    return (<Switch>
      { Routes.map((element, index)=>{
          return (<Route key={index} path={element.path} component={element.component} exact={element.exact} />)
        })}
  </Switch>)
}

ReactDOM.render(<Provider store={store}><Router>
    <div>{renderRoutes()}</div></Router>
  </Provider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
