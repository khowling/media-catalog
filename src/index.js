import React from 'react'
import ReactDOM from 'react-dom'

import App from './App'

import './styles/index.css'
import 'winstrap/dist/css/winstrap.css'
/*
import router from './service/router.js'
import createHistory from 'history/createBrowserHistory'
const history = createHistory()


const routes = [
  { path: '/', action: () => <App /> },
  { path: '/tasks', action: () => <TaskList /> },
  { path: '/tasks/:id', action: () => <TaskDetails /> }
];

let renderComponent = (component) => {
  ReactDOM.render(
    component,
    document.getElementById('root')
  );
}

let render = (location) => {
  router.resolve(routes, location)
    .then(renderComponent)
    .catch(error => router.resolve(routes, { ...location, error })
    .then(renderComponent));
}

render(history.location); // render the current URL
history.listen(render);               // render subsequent URLs
*/


ReactDOM.render(
    <App/>,
    document.getElementById('root')
  );
