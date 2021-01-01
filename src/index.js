import "bulma/css/bulma.css";
import "@fortawesome/fontawesome-free/css/all.css";
import "./styles.css";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import App from "./App.js";
import slice from "./slice.js";

const store = configureStore({
  reducer: slice.reducer,
  middleware(getDefaultMiddleware) {
    return getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    });
  },
});

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.querySelector("#content")
);
