# Remind Me
An inventory and shopping list application to keep track of what to buy and what is expiring, with option to receive notifications when a product is expiring.
Note: Tested on Android (Samsung Galaxy S7)

- [Angular Web App](https://github.com/tiffanyolw/remindme-web)
- [Node.js Server](https://github.com/tiffanyolw/remindme-server)

## Important
- No actual authentication implemented; users only to separate the data and views between the different users
    - Can easily add/change values in the local storage
    - Can also call backend with any user and manipulate data without being logged in

## Contents
- [Functionality](_Docs/functionality.md)
- [Backlog](_Docs/backlog.md)

## Steps to run
1. `npm install` to install dependencies.
2. Follow the steps to run the [server](https://github.com/tiffanyolw/remindme-server).
3. Update `environment.ts` and `environment.prod.ts` in the `environments` folder if needed
4. `ionic serve` or `ionic cap run android`

## Technology
- Ionic with Angular
- Ionic Capacitor


## Helpful Links
https://github.com/ionic-team/ionic-framework/issues/19324

## For future reference
Error with `local-notifications`:
```
npm install cordova-plugin-local-notification
npm install @ionic-native/local-notifications
npm install @ionic-native/core
npm install cordova-plugin-device
npm install cordova-plugin-badge
npm install jetifier
npx jetify
```
