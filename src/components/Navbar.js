import { Navbar, Text } from "@nextui-org/react";

const NavBar = () => {
    return <Navbar isBordered variant={"sticky"}>
        <Navbar.Brand>
            <Text b color="inherit">
                BeatSaber Overlay
            </Text>
        </Navbar.Brand>
    </Navbar>
}

export default NavBar;