# Desisions

Should a request be called chainlink?

- I think it fits the name of the library, but it will be confusing for new users - wtf is a chainlink
- NO

Should I use react or finally learn Svelte?

- I am deeply familiar with React
- It would be cool to use something else
- I believe more oos contributors knows react than svelte
- React

Folder structure

```
project-root
└── chainlink
    ├── chainlink.config.ts
    ├── requests
    │   └── request1.ts
    └── chains
        └── chain1.ts
```

Chainlink will expose a `defineRequest` function that gives developers the ability to create typesafe request definitions

# Architecture

There are 3 main parts

## 1. Node functions

Functions for using Chainlink:

- Building json templates from typescript files
- Running requests

These are defined outside of the node server and the cli so they can be used in both

## 2. Chainlink node server

This will run:

1. A node web server for serving the vite ChainlinkUI
2. A node web server, used as an interface between the ui and the node scripts

## 3. Command line interface

CLI for running requests and chains

# Implement POC

1. Setup
