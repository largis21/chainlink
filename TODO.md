# Desisions

Should a request be called chainlink?

- I think it fits the name of the library, but it will be confusing for new users - wtf is a chainlink
- NO

Should I use react or finally learn Svelte?

- I am deeply familiar with React
- It would be cool to use something else
- I believe more oos contributors knows react than svelte
- React

Default folder structure (Can be customized through `chainlink.config.ts`)

```
project-root
├── chainlink.config.ts
└── chainlink
    ├── requests
    │   └── request1.ts
    └── chains
        └── chain1.ts
```

Chainlink will expose a `defineRequest` function that gives developers the ability to create typesafe request definitions

# Architecture

There are 3 main parts

## 1. Node functions in @chainlink-io/core

Functions for using Chainlink:

- Running requests
- Getting config file
...

These are defined outside of the node server and the cli so they can be used in both

## 2. Chainlink node server @chainlink-io/app

This will run a next application with node.
The backend functions from @chainlink/core will be used in the nextjs api

## 3. Command line interface

Does 2 things:

1. Starting the next application
2. _BACKLOG_ CLI for running requests and chains
