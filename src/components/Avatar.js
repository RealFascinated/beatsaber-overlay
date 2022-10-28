import Image from "next/future/image";

import styles from "../styles/avatar.module.css";

const Avatar = (props) => {
	return (
		<>
			<Image
				className={styles.playerAvatar}
				src={props.url}
				width={200}
				height={200}
				alt={"Avatar image"}
				loading="lazy"
				placeholder="blur"
				blurDataURL="https://cdn.fascinated.cc/IkQFyodbZv.jpg?raw=true"
			/>
		</>
	);
};

export default Avatar;
