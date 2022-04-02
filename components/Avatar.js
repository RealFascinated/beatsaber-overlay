import Image from "next/image";

const Avatar = (props) => {
    return <>
        <Image className={'player-avatar'} src={props.url} width={180} height={180} alt={'Avatar image'} loading='lazy'/>
    </>
}

export default Avatar;