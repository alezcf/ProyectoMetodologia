import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import AttendanceScreen from './screens/AttendanceScreen';

function App() {
  console.log("iniciado");
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={HomeScreen} />
        <Route exact path="/trabajador/:rut" component={LoginScreen} />
        <Route exact path="/asistencia/read" component={AttendanceScreen} />
      </Switch>
    </Router>
  );
}

export default App;