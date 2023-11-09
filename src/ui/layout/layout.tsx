import { Outlet } from "react-router-dom";
import Header from "../header/header";

export function Layout() {
  return (
    <>
      <div className="header">
        <Header></Header>
      </div>
      <div className="body">
        <Outlet />
      </div>
      <div className="footer"></div>
    </>
  );
}

export default Layout;
