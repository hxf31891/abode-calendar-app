# Abode Exercise

Hey Abode team! Had a blast working on this over the weekend, hope you enjoy 📅

## Overview & Archetecture

#### 🔵 Frontend - create-react-app

The frontend is a standard calendar view with three timeframe options, daily, weekly, monthly. Relies heavily on date-fns to create an array of the days depending on the selected period and timeframe view i.e. selected period is 3/3/24 and timeframe is week, the array contains 7 days (3/3 - 3/9). These are then mapped over to create the UI. [see here line 34](https://github.com/hxf31891/abode-calendar-app/blob/main/web/src/utils/days.ts)

#### 🔵 Backend - node.js, express, sequalize orm

Created from my boilerplate CRUD setup, models and routes are defined in [src/modules](https://github.com/hxf31891/abode-calendar-app/blob/main/server/src/modules). [src/models.ts](https://github.com/hxf31891/abode-calendar-app/blob/main/server/src/models.ts) and [src/routes.ts](https://github.com/hxf31891/abode-calendar-app/blob/main/server/src/routes.ts) loop over the modules directories to automatically create GET, POST, UPDATE & DELETE routes, create generic controllers and pass in parsed queries. These can optionally be updated/overridden from the specific modules route.ts file allowing for alteration of include, attributes or completly overriding with a custom controller.

#### 🔵 Database - postgreSQL instance running on Docker

A relationas db made sense for the functionality of the app. Users and events are connected through an MM relationship making it quick and easy to query for and manage a users events. I added an additional [route here](https://github.com/hxf31891/abode-calendar-app/blob/main/server/src/modules/user/routes.ts) on line 60 that functions as a shortcut to get, add and alter a users events.

Contanorized in Docker to allow easy setup/start but you could connect to a local psql instance by changing the hardcoded db_name, db_user, password and host in [src/models.ts](https://github.com/hxf31891/abode-calendar-app/blob/main/server/src/models.ts)

#### 🔵 API - standardized axios client with auth headers

Uses a parsing util to easily pass sqlParams to CRUD routes, helpful when calling events within date ranges.

#### 🔵 Notifications - redis pubsub, node-mailer

When new calendar events are created, invitees receive notications immediately and thirty minutes before the event by email. To efficiently and reliably manage the 30 minute reminders we leverage a redis pubsub instance by creating entries that expire 30 minutes before calendar events take place and listen for pubsub events. When the server recieves an expire event it uses the redis's events key to find the calendar event (which are the same) and, if the calendar event is still valid (not cancelled) we send out the reminder emails to attached users. This system has several benefits over a cron based or node-schedule system including persisting server restarts and the ability to easily cancel or update the job. Further we will not have to store any scheduled jobs in memory or run frequent cron jobs, making it more efficient and scalable. [see here](https://github.com/hxf31891/abode-calendar-app/blob/main/server/src/services/redis)

In you prefer, you could connect to a local redis instance. Just use the default port 6379

#### 🔵 Auth - AWS Cognito

Simple JWT token based auth service from AWS. used here to create simple accounts and decoded to determine current user in various server function.

## Limitations & Issues

1. Input validation - Currenlty very insufficient.
2. Notifcations system - I have yet to implement the functionality to handle calendar event startTime updates.
3. Effeciency - As it stands, a context wrapper listens for changes in the selectedMonth, calling the get events route when the month changes with a filter for the relevant time period and receiving the users events for said month. As we all know, useEffects can often result in unnecessary api calls amongst other things. Moving the api calls to onClick events when the timeframe changes would likely reduce requests. Further, building a redux store and persisting the events state would allow us to not make requests everytime the contextProvider rerenders.
4. Security - The server has basic features set up and relevant permissions applied to each of its routes but certainly more could be done here. Note that for ease of setup, I hard coded a few variables that would normally go in a .env file.
5. Rendering overlapping events - Currently events that happen at the same time stack ontop of each other in the daily and weekly views potentially disappearing behind each other. A side by side display would be better UI.
6. Testing - I created jest tests on the server and web but coverage is currently low especially on the frontend. I would also consider moving to a continuous testing framework like cypress for the app and ultimetly a monitoring system like Sentry.
7. Error messages/alerts - Currently using window.alert to show very basic feedback to users, needs more specific and helpful messages at minimum.
8. Managaine Invitations - As it stands you a user cannot accept or decline and invite. Events are tied to users through a MM relationship and there is currently no additional data on the through table. Would make sense to make this change pre-production and avoid potiential migration issues.
9. Little upgrades - Add more data points to the event item, clean up custom CSS classes
10. Bugs - addEvent btn not getting currentTime sometimes

## Setting Up

On macOS:

### Prerequisites

1. Install [Docker](https://docs.docker.com/desktop/mac/install/)
2. Install [nvm](https://github.com/nvm-sh/nvm#installing-and-updating) (node version manager)
3. Install node: `nvm install 18 && nvm use 18`
4. Install npm: `npm install -g npm@8.1.2`

### Setup

5. Install all dependencies: `cd abode-calendar-app && yarn install`
6. Make sure that docker is open on your computer.
7. Start psql and redis docker instances `yarn setup` \*\* if your having issues with postgress connection see bottom
8. Make & run migrations `yarn db:migrate`

## Running the project

- `yarn dev:server` to start up the dev server

in a seperate terminal tab

- `yarn dev:web` to start up the webapp locally

## Testing

- `yarn test:server` run server tests
- `yarn test:web` run webapp tests

Coverage

- `cd server && yarn test --coverage` server
- `cd web && yarn test --coverage` webapp

## Linting

- `yarn lint:server` run linter on server files
- `yarn format:server` fix any formatting issues on server files

#### Docker connection issues

- If you are having trouble connecting to the docker instance, getting errors like role does not exist, you may need to kill a local instance of psql. On mac run `brew services list` to determine what version you are running the `brew services stop postgresql@14` replacing postgresql@14 with your specific version.
- You can log in to the container using `psql -h 127.0.0.1 --user postgres`, password is set to `secret`
