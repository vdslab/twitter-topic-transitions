import "bulma/css/bulma.css";
import "./styles.css";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import App from "./App.js";
import slice from "./slice.js";

const store = configureStore({
  reducer: slice.reducer,
});

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.querySelector("#content")
);
