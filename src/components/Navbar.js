import { Navbar, Text } from "@nextui-org/react";

const NavBar = () => {
    return <Navbar isBordered variant={"sticky"}>
        <Navbar.Brand>
            <Text b color="inherit">
                Beat Saber Overlay
            </Text>
        </Navbar.Brand>
    </Navbar>
}

export default NavBar;