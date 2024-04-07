import React, { FC, useEffect } from "react";
import "./App.scss";
import AppRouter from "./routes/AppRouter";

const App: FC = () => {
  return (
    <div className="App">
      <AppRouter />
    </div>
  );
};

export default App;
