# BeatSaber Overlay with real-time data from HttpSiraStatus

The public url to view/use: <https://bs-overlay.fascinated.cc></br>
Need help? Feel free to message me at: Fascinated#4719

## Usage

- Install [HttpSiraStatus](https://github.com/denpadokei/HttpSiraStatus)
- Go to <https://bs-overlay.fascinated.cc>
- Set the values in the configuratator
- Click on Open Overlay
- Create a browser window in your streaming software of choice
- Set the height to 1920 and width to 1080
- Set the URL to the newly opened window in your browser

## Preview

![Overlay](https://cdn.fascinated.cc/FKzlGmH9.png)
![Builder Menu](https://cdn.fascinated.cc/wmwk2oIi.png)

## Todo

- Add toggle for showing pp
- Change the song time to a circular style in the song art
- Add overall stream stats (avg acc, misses, highest combo)
- Add option to scale the ui using css scale

## Getting started with developent

- Clone the repo
- Move into the cloned directory
- Run `npm install`
- Rename the `.env-example` to `.env`
- Create a redis server with a password
- Setup the `.env`
- Run `npm run dev`
- Open <http://localhost:3000>

If you want your changes to be in the main branch, feel free to open a pull request :)
