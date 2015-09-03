# FLICast Core for the Amazon Fire TV

## Getting Started

This project depends on the NodeJS Package Manager, npm, for handling dependencies. It also depends on Sass for preprocessing scss files into css.

### npm

*On OS X:*

Install Homebrew by running the following command:

* [http://brew.sh/](http://brew.sh/)
```sh
ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
brew install node
```

*On Debian-based systems (including the Ubuntu family):*

Install via your operating system's package manager.

```sh
sudo apt-get install curl
curl -sL https://deb.nodesource.com/setup_0.12 | sudo bash -
sudo apt-get install nodejs
```

### sass

Sass is distributed as a Ruby gem. If you're on Mac OS X, you already have Ruby! To get the Sass gem, run

```sh
gem install sass
```

If you're not on OS X, take a look into `rvm`.

## Developing 

### Gathering dependencies

Once you have NodeJS and npm installed, and this project downloaded, you can now gather the necessary dependencies:

```sh
cd flicast-core-firetv
npm install
```

Note that `npm install` reads dependencies from `package.json`.

To add another package while developing, please use:

```sh
npm install --save-dev {package}
```

### Project structure

The project is structured as follows:

    flicast-core-firetv :
    - Gruntfile.js   # defines grunt tasks for building, packaging, etc
    - package.json   # holds npm dependencies and project information
    - src/           # source code
        - assets/        # static assets such as images
        - html/
        - js/
        - libs/          # javascript libraries
        - scss/

All code changes should be made within the `src/` directory. Read below for how to deploy locally or to a FireTV device.

## Deploying locally

In a background terminal, you can launch a local server on port 3000 by running:

```sh
npm start
```

This will serve your local development build of the project. In another terminal, create your local build by running:

```sh
grunt dev
```

Development builds do two things: concatenate local JavaScript files into one file, and send all Sass files through the preprocessor to generate CSS. You will notice that this process halts on `Running "watch" task` -- that's because it will automatically re-wrangle and lint any modified SCSS and JavaScript files *as you edit them.*


This process will also copy all modifications to your live development build, allowing you to catch syntax (or style) errors in real time while simultaneously viewing the result in a browser.


To view your local build, navigating your favorite Chrome-based browser to [http://localhost:3000/dev](http://localhost:3000/dev).



## Deploying to FireTV

In order to view the packaged version of this application on FireTV:

1. Create a deployable package of the project's current state:

```sh
grunt package
```

2. Find your current LAN IP address:

```sh
ifconfig | grep "inet" | grep -v 127.0.0.1
```

*NB: A proper IPv4 address will look like XXX.XXX.XXX.XXX.*

3. Launch your local server:

```sh
npm start
```

4. On your Fire TV device, navigate to the packaged application in the Amazon Web App Tester application:

```sh
http://{Your computer's LAN IP}:3000/flicast-core-firetv.zip` 
```

*Note: this produces a production version of FLICast-Core-FireTV. That means all CSS and JavaScript are minified, for the sake of speed and resources.*

## Deprecated functionality

We currently aren't targeting touch-enabled devices. However, adding a touch controller to this class of applications is a straightforward procedure; in the event we target Kindle Fires in the future, this will be useful information.

### Configuring your browser for touch events

Run chrome debug from command line with flags need to capture touch events:

*On OS X:*

```sh
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --touch-events
```
```sh
/Applications/Google\ Chrome\ Canary.app/Contents/MacOS/Google\ Chrome\ Canary --touch-events
```

*On GNU/Linux:*

If you have a touch screen and Chrome/Chromium are not responding properly, find the input device number by running:

```sh
xinput list
```

You can now launch your browser via command line with:

```sh
chromium-browser --touch-devices={num}
```

To prevent having to manually do this each time, export your `CHROMIUM_USER_FLAGS` environment variable with your switches.

