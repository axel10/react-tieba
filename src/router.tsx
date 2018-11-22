import * as React from 'react'
import { Route, Router, Switch } from 'react-router-dom'
import ScrollMemory from 'react-router-scroll-memory'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import history from './history'
import EditUser from './routes/EditUser/EditUser'
import FollowPost from './routes/FollowPost/FollowPost'
import Home from './routes/Home/Home'
import Index from './routes/Index'
import Login from './routes/Login/Login'
import Message from './routes/Message/Message'
import NewPost from './routes/NewPost/NewPost'
import Post from './routes/Post/Post'
import Register from './routes/Register/Register'
import Search from './routes/Search/Search'
import Test from './routes/Test/Test'
import Tieba from './routes/Tieba/Tieba'
import TieCollection from './routes/TieCollection/TieCollection'

export const routes = () => {
  return (
    <Router history={history}>
      <Route render={(params) => {
        const { location } = params
        console.log(location.key)
        return (
          <React.Fragment>
            <TransitionGroup style={{ width: '100%',height:'100%'}} id={'routeWrap'}>
              <CSSTransition classNames={'router'} timeout={350} key={location.pathname}>
                <Switch location={location} key={location.pathname}>
                  <Route path='/test/:param?' component={Test}/>
                  <Route path='/tieba/:title' component={Tieba}/>
                  <Route path='/search' component={Search}/>
                  <Route path='/login' component={Login}/>
                  <Route path='/register' component={Register}/>
                  <Route path='/newPost/:tieba' component={NewPost}/>
                  <Route
                    path='/p/:threadId/:pageNo?/:isSeeLz?/:postId?'
                    component={Post}
                  />
                  <Route path='/t/p/:postId' component={FollowPost}/>
                  <Route path='/tc' component={TieCollection}/>
                  <Route path='/home/:userName' component={Home}/>
                  <Route path='/edituser' component={EditUser}/>
                  <Route path='/message' component={Message}/>
                  <Route path='/' component={Index}/>
                </Switch>
              </CSSTransition>
            </TransitionGroup>
          </React.Fragment>
        )
      }}/>
    </Router>
  )
}
