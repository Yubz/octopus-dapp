import { Button, ButtonGroup, Card } from "@mui/joy";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export interface HeaderProps {}

export function Header(headerProps: HeaderProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const [locationPathname, setLocationPathname] = useState("");

  useEffect(() => {
    setLocationPathname(location.pathname);
  }, [location]);

  return (
    <>
      <div className="header-content">
        <Link to="/">
          <img src="/images/octopus.png" alt="logo" width="80px" />
        </Link>
        <Card
          size="sm"
          variant="soft"
          sx={{
            width: "fit-content",
            padding: "0.25rem",
            height: "fit-content",
            alignSelf: "center",
          }}
        >
          <ButtonGroup size="lg" spacing="0.5rem">
            <Button
              color={locationPathname === "/monitor" ? "primary" : "neutral"}
              size="md"
              variant="soft"
              sx={{ borderRight: "none !important" }}
              onClick={() => navigate("/monitor")}
            >
              Monitor
            </Button>
            <Button
              color={locationPathname === "/explore" ? "primary" : "neutral"}
              size="md"
              variant="soft"
              sx={{ borderLeft: "none !important" }}
              onClick={() => navigate("/explore")}
            >
              Explore
            </Button>
          </ButtonGroup>
        </Card>
      </div>
    </>
  );
}

export default Header;
