import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Account from "./components/Account";
import Transaction from "./components/Transaction";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
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
