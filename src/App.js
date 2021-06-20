import React from "react";
import "./App.css";
import Table from "./components/Table/Table";
import { BrowserRouter as Router, Route } from "react-router-dom";
import itemPage from "./components/itemPage/itemPage";

export default function App() {
  return (
    <Router>
      <Route exact path="/" component={Table} />
      <Route path="/item/:id" component={itemPage} />
    </Router>
  );
}
