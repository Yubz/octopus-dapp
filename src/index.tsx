import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import App from "./app";
import reportWebVitals from "./reportWebVitals";
import { CssVarsProvider, extendTheme } from "@mui/joy/styles";

const theme = extendTheme({
  components: {
    JoyButton: {
      styleOverrides: {
        root: ({ ownerState, theme }) => ({
          ...(ownerState.color === "primary" && {
            backgroundColor: "#76afcc",
            color: "#171A1C",
            "&:hover": {
              backgroundColor: "#76afcc",
              color: "#171A1C",
            },
          }),
          ...(ownerState.color === "neutral" && {
            backgroundColor: "#171A1C",
            color: "#76afcc",
            "&:hover": {
              backgroundColor: "#171A1C",
              color: "#76afcc",
            },
          }),
        }),
      },
    },
  },
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <CssVarsProvider theme={theme} defaultMode="dark">
      <App />
    </CssVarsProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
