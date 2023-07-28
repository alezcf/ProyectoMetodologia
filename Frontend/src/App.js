import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import AttendanceScreen from './screens/AttendanceScreen';
import ReviewAttendanceScreen from './screens/ReviewAttendanceScreen';
import GroupScreen from './screens/GroupScreen';

function App() {
  console.log("iniciado");
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={HomeScreen} />
        <Route exact path="/trabajador/:rut" component={LoginScreen} />
        <Route exact path="/asistencia/read" component={AttendanceScreen} />
        <Route exact path="/asistencia/readNotAccepted" component={ReviewAttendanceScreen} />
        <Route exact path="/grupo" component={GroupScreen} />
      </Switch>
    </Router>
  );
}

export default App;