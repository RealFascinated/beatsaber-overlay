import {
	Avatar as NextAvatar,
	changeTheme,
	Dropdown,
	Text,
	useTheme,
} from "@nextui-org/react";

const Avatar = (props) => {
	const { isDark } = useTheme();

	const avatarUrl = props.avatarUrl || "https://cdn.fascinated.cc/yb4fgdc1.jpg";

	const handleChange = () => {
		const nextTheme = isDark ? "light" : "dark";
		window.localStorage.setItem("theme", nextTheme); // you can use any storage
		changeTheme(nextTheme);
	};

	return (
		<>
			<Dropdown>
				<Dropdown.Trigger>
					<NextAvatar
						bordered
						size="lg"
						as="button"
						color="primary"
						src={avatarUrl}
					/>
				</Dropdown.Trigger>
				<Dropdown.Menu aria-label="Static Actions">
					<Dropdown.Item>
						<div
							style={{
								display: "flex",
								flexDirection: "column",
							}}
						>
							<Text b onClick={() => handleChange()}>
								Toggle Dark Mode
							</Text>
						</div>
					</Dropdown.Item>
				</Dropdown.Menu>
			</Dropdown>
		</>
	);
};

export default Avatar;
