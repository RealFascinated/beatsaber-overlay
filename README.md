# BeatSaber Overlay with real-time data from HttpSiraStatus

The public url to view/use: <https://bs-overlay.fascinated.cc></br>
Need help? Feel free to message me at: Fascinated#4719

## Usage

You will need [HttpSiraStatus](https://github.com/denpadokei/HttpSiraStatus) if you wish to use the note cut and/or the song info</br>
To get started go to <https://bs-overlay.fascinated.cc> and it is fairly self explanatory on how it all works</br>

## Preview

![Overlay](https://cdn.fascinated.cc/HCrnvhsHGG.png?raw=true)
![Builder Menu](https://cdn.fascinated.cc/QwGTQLhJsq.png?raw=true)

## Todo

- Move caches to Redis
- Move media to my CDN server
- Cache BeatSaver data
- Add cache status in the response headers
- Move configuration files to ENV files
- Add toggle for showing pp
- Cleanup the API (or just re-do it)
- Change the song time to a circular style in the song art

## Getting Started with developent

First, install the node dependencies:

```bash
npm i
# or
yarn
```

Secondly, open the development server

```bash
npm run dev
# or
yarn dev
```

Lastly, open the project with an IDE of your choice :)
