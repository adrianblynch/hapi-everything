# Hapi Everything

A Hapi server with anything and everything thrown in.

A playground for Hapi.

A place to test frontend libraries and frameworks.

## Why?

To use as a test bed for all the wonderful things Hapi (and its plugins) offer.

To compare frontend libraries and frameworks acting on the same data.

## What?

- Hapi users/groups API
- Logging to [Loggly](https://www.loggly.com/)
- Persistance to [MongoDB](https://www.mongodb.org/)
- Relationships stored in [OrientDB](http://orientdb.com/)
- Testing with [Ava](https://github.com/sindresorhus/ava)
- TODO: [RethinkDB](https://www.rethinkdb.com/)

### Modular

It's easy to create a Hapi server with basic routes, better still is to pull functionality into modules, both Hapi modules (route logic and orchestration) and business modules (CRUD and business rules for domain objects).

### Frontends

Create the same application in multiple libaries/frameworks to compare them.

- A React app using [Material UI](http://www.material-ui.com/)

### Modern

I'll aim to use modern techniques as much as possible.

This started out on Node 4. Now we're on Node 6 and the need for transpiling the API code has lessened.

The frontend apps are stand-alone so any transformation can be done as and when.

AVA comes bundled with Babel so I've jumped straight into using ES7 features, namely `async`/`await`.

### Code style

- No semi-colons
- Lambdas
- Functional (Or at least some facets of functional programming)
- ES2015 as much as possible, even for the web apps
- Favour `const` over `let` and more so over `var`
- Tabs over spaces!
- Comment liberally - Why? - Because this is a learning experience and the more explanations alongside the code the better - Maybe
- [Code that acts as its own comment](http://blog.codinghorror.com/coding-without-comments/). Namely descriptive names for functions and variables

## Start-up

### API
- Fire up Mongo `mongod` (version 3.2.4)
- Fire up OrientDB `cd path/to/orientdb/bin/` then `./server.sh` (version 2.1.16)
- Run `npm start` to get the [API running here](http://localhost:3838/)
- View [request debugging](http://localhost:3838/debug/console)

### Web apps

#### React MUI

- Run `npm run serve:react-mui` to start `webpack-dev-server` and [browse to here](http://localhost:3737/)

### Incremental

~~Work on this for at least 30 minutes a day. No excuses!~~

Well that didn't happen! Here for prosperity...

> Starting on Wednesday 3rd of February:
>
> - Day 1 - Project set-up: git, npm, readme - Server set-up: Hapi, routes, documentation
> - Day 2 - CRUD for users
> - Day 2.5 - Move CRUD into user object to simplify the routes
> - Day 3 - Create Users Hapi plugin - Add logging and send to Loggly
> - Day 4 - Added groups to graph
>
> Next: Serve nested groups
