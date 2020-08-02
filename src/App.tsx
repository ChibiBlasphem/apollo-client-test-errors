import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { Login } from './pages/Login'
import { PostList } from './pages/PostList'
import { Post } from './pages/Post'

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Login} />
        <Route exact path="/posts" component={PostList} />
        <Route path="/posts/:id" component={Post} />
      </Switch>
    </Router>
  )
}

export default App
