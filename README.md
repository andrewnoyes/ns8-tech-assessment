# Overview

I scaffolded the project using [NestJS](https://docs.nestjs.com/) - I like that it has first-class TypeScript support and dependency injection is baked into the framework. Internally it also uses express. I opted for using Yarn for package manager but NPM should work equally as fine.

To run:

- Install dependencies, `yarn install`
- Start in dev mode, `yarn start`
- Once started, it should be running on http://localhost:3000

The route definitions are all contained in a single controller, `app.controller.ts` - normally I would break this into individual controllers and eventually individual modules on a large project. There are two suites of tests - integration tests are in `app.controller.spec.ts` and e2e are in `app.e2e-spec.ts`, and they can be run with `yarn test` and `yarn test:e2e` respectively.

# Assumptions

- Because we wanted to have endpoints for pulling events created by a user, I included the user's ID in the event model. Also, the endpoint for creating an event requires the `userId` in its route - this is the same for fetching a user's events.

# Future Improvements

- Implement email validation/verification - e.g. sending an email with a link that contains verification token.
- Validation logic is currently housed in the services. It would be nice to break these out into their own validation layer so they're easier to unit test. Also using a library like class-validator would alleviate some of the validation boilerplate.
- Adding persistence, e.g. database, and refactoring the data access to its own layer. Ideally, using an ORM with active record/repository pattern.
- Hashing user passwords using bcrypt before storing in data source.
- Protecting routes using an auth token - e.g. prevent un-authenticated clients from viewing/creating records.
