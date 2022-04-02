import ReactCountryFlag from "react-country-flag";

const PlayerStats = (props) => {
    return <div className={'player-stats'}>
        <p>{props.pp}pp</p>
        <p>#{props.globalPos}</p>
        <div className="player-country">
            <p>#{props.countryRank}</p>
            <ReactCountryFlag className={'player-country-icon'} svg countryCode={props.country} />
        </div>
    </div>
}

export default PlayerStats;