import { Navbar, Text } from "@nextui-org/react";
import Settings from "./Settings";

const NavBar = (props) => {
  return (
    <Navbar isBordered variant={"sticky"}>
      <Navbar.Brand>
        <Text b color="inherit">
          BeatSaber Overlay
        </Text>
      </Navbar.Brand>

      <Navbar.Content>
        <Settings {...props}></Settings>
      </Navbar.Content>
    </Navbar>
  );
};

export default NavBar;
