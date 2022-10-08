import Config from '../../config.json';

const WebsiteTypes = {
    ScoreSaber: {
        ApiUrl: Config.proxy_url + "/https://scoresaber.com/api/player/%s/full"
    },
    BeatLeader: {
        ApiUrl: Config.proxy_url + "/https://api.beatleader.xyz/player/%s"
    },
    Test: {
        ApiUrl: "/api/mockdata"
    }
}

export default WebsiteTypes