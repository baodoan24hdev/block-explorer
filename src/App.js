import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Account from "./components/Account";
import Transaction from "./components/Transaction";
import Navbar from "./components/Navbar";
import Home from "./components/Home";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" exact={true} element={<Home />}></Route>
        <Route
          path="/account/:address"
          exact={true}
          element={<Account />}
        ></Route>
        <Route path="/transaction/:txhash" element={<Transaction />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
