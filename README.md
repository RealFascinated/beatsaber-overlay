# BeatSaber Overlay with real-time data from HttpSiraStatus

[![Build Status](https://drone.fascinated.cc/api/badges/RealFascinated/beatsaber-overlay/status.svg)](https://drone.fascinated.cc/RealFascinated/beatsaber-overlay)

The public url to view/use: <https://bs-overlay.fascinated.cc></br>
Need help? Feel free to message me at: Fascinated#4719

## Usage

You will need [HttpSiraStatus](https://github.com/denpadokei/HttpSiraStatus) if you wish to use the note cut and/or the song info</br>
To get started go to <https://bs-overlay.fascinated.cc> and fill the forum in then go to OBS (or your streaming software) and click Open Overlay</br>
Then create a browser window and set the height to 1920 and the width to 1080 then put the URL in the browser window and bam! it should all work

## Preview

![Overlay](https://cdn.fascinated.cc/bAmrOfUvLv.png?raw=true)
![Builder Menu](https://cdn.fascinated.cc/QwGTQLhJsq.png?raw=true)

## Todo

- Make BeatLeader pp count check for modifiers
- Add toggle for showing pp
- Change the song time to a circular style in the song art

## Getting started with developent

- Clone repo
- Move into the cloned directory
- Run `npm install`
- Rename the `.env-example` to `.env`
- Create a redis server with a password
- Setup the `.env`
- Run `npm run dev`
- Open <http://localhost:3000>

If you want your changes to be in the main branch, feel free to open a pull request :)
