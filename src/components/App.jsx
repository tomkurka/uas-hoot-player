import React, { useEffect, useState } from "react"
import { connect } from "react-redux"
import { Route, Switch, Redirect } from "react-router-dom"
import { firestore } from "../firebase/firebaseUtils"
import EventPage from "../pages/event/EventPage"
import HomePage from "../pages/home/HomePage"
import NotFoundPage from "../pages/notFound/NotFoundPage"
import { updateDataEvent, updateResultsEvent } from "../redux/event/eventActions"
import { selectEventDataConnect, selectEventDataProfile } from "../redux/event/eventSelectors"
import LoadingAnimationDatabase from "./components/loadingAnimation/LoadingAnimationDatabase"
import Notifications from "./components/notifications/Notifications"

const App = ({ eventDataConnect, updateDataEvent, eventDataProfile, updateResultsEvent }) => {
  const { enterCode } = eventDataConnect || ""
  const [previousEnterCode, setPreviousEnterCode] = useState("")

  useEffect(() => {
    if (!enterCode || enterCode === previousEnterCode) return
    setPreviousEnterCode(enterCode)
    firestore.doc(`events/${enterCode}/data/event`).onSnapshot(snapshot => {
      const data = snapshot.data()
      updateDataEvent(data)
    })
    // eslint-disable-next-line
  }, [eventDataConnect])

  useEffect(() => {
    if (!enterCode || enterCode === previousEnterCode) return
    setPreviousEnterCode(enterCode)
    firestore.doc(`events/${enterCode}/players/${eventDataProfile.id}`).onSnapshot(snapshot => {
      const data = snapshot.data()
      updateResultsEvent(data)
    })
    // eslint-disable-next-line
  }, [eventDataProfile, eventDataConnect])

  return (
    <div className="app">
      <Notifications />
      <LoadingAnimationDatabase />
      <Switch>
        <Route exact path="/event" component={EventPage} />
        <Route exact path="/" component={HomePage} />
        <Route exact path="/join/:enterCode?" component={HomePage} />
        <Route exact path="/not-found" component={NotFoundPage} />
        <Redirect to="/not-found" />
      </Switch>
    </div>
  )
}

const mapStateToProps = state => ({
  eventDataConnect: selectEventDataConnect(state),
  eventDataProfile: selectEventDataProfile(state),
})

const mapDispatchToProps = dispatch => ({
  updateDataEvent: data => dispatch(updateDataEvent(data)),
  updateResultsEvent: data => dispatch(updateResultsEvent(data)),
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
