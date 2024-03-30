import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// components
import { Restaurants } from "./containers/Restaurants.jsx";
import { Foods } from "./containers/Foods.jsx";
import { Orders } from "./containers/Orders.jsx";

function App() {
  return (
    <Router>
      <Routes>
        // 店舗一覧ページ
        <Route path='/restaurants' element={<Restaurants />} />
        {/* <Route exact path="/restaurants">
          <Restaurants />
        </Route> */}
        // フード一覧ページ
        <Route path='/foods' element={<Foods />} />
        {/* <Route exact path="/foods">
          <Foods />
        </Route> */}
        // 注文ページ
        <Route path='/orders' element={<Orders />} />
        {/* <Route exact path="/orders">
          <Orders />
        </Route> */}

        
        <Route
          exact
          path="/restaurants/:restaurantsId/foods"
          render={({ match }) => <Foods match={match} />}
        />


      </Routes>
    </Router>
  );
}

export default App;
