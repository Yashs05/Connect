// Packages
import { BrowserRouter } from "react-router-dom";

import Main from './Components/Main'

// Utils
import './App.css';
import './classes.css'
import { useSelector } from "react-redux";
import Alert from "./Components/Alert/Alert";

function App() {

  const { display } = useSelector(state => state.alert)

  return (
    <BrowserRouter>
      <Main />
      {display ? <Alert /> : null}
    </BrowserRouter>
  );
}

export default App;
