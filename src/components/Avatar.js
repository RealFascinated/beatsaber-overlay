import Image from "next/image";

import styles from "../styles/avatar.module.css";

const Avatar = (props) => {
	return (
		<>
			<Image
				className={styles.playerAvatar}
				src={props.url}
				width={180}
				height={180}
				alt={"Avatar image"}
				loading="lazy"
				placeholder="blur"
				blurDataURL="https://cdn.fascinated.cc/yb4fgdc1.jpg"
				unoptimized
			/>
		</>
	);
};

export default Avatar;
