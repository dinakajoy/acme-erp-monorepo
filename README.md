# Turborepo starter

This is an arp application with a monorepo setup using turborepo. The server (a REST API) is completed using node.js and expres.js

## What's inside?

It includes the following packages/apps:

### Apps and Packages

- `frontend`: a Next.js app
- `backend`: a Node.js/Express.js REST API
- `ui`: a stub React component library to be shared the `frontend` applications
- `config`: `eslint` and `jest` configurations
- `tsconfig`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Jest](https://jestjs.io) test runner for all things JavaScript
- [Prettier](https://prettier.io) for code formatting

## Setup

Clone the repository.    
cd acme-erp       
Run `yarn install` or `npm install`   

### Build

To build all apps and packages, run the following command:

```
yarn run build
```

### Develop

To develop all apps and packages, run the following command:

```
yarn run dev
```

## To Do
Build out the application UI using Next.js

