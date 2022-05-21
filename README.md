# testDEX dApp

testDEX is a simple DEX using the Elrond network. University master's degree final project (cybersecurity/UOC).

Based on [Elrond dApp Template](https://github.com/ElrondNetwork/dapp-template), built using [React.js](https://reactjs.org/) and [Typescript](https://www.typescriptlang.org/). It's a basic implementation of [@elrondnetwork/dapp-core](https://www.npmjs.com/package/@elrondnetwork/dapp-core), providing the basics for Elrond authentication and TX signing. See [Dapp template](https://dapp-template.elrond.com/) for live demo.

## About me and my personal situation

I dedicated the last years to tasks far from programming. So I started this project knowing very little about blockchain, Elrond technology, Rust, Typescripts and even git!

I am convinced that everything may be improved a lot. I like blockchain, so in the next few years I'll get more knowledge about all this and my idea is to improve things in this project.

## Requirements

- Node.js version 12.16.2+
- Npm version 6.14.4+

## Getting Started

The dApp is a client side only project and is built using the [Create React App](https://create-react-app.dev) scripts. You can find the [smart contract also on GitHub](https://github.com/sergiogrubio/TFM_smart_contract).

### Instalation and running

### Step 1. Install modules

From a terminal, navigate to the project folder and run:

```bash
npm install
```

### Step 2. Update environment

Go to `App.tsx` and edit the `environment` variable according to the environment you want the app to run on.
Valid values are `testnet`, `devnet` or `mainnet`

If you need to edit the network configuration, you can pass in a `customNetworkConfig` object.
More info about this can be found in [dapp-core documentation](https://github.com/ElrondNetwork/dapp-core)

Finally, built and deploy the [smart contract](https://github.com/sergiogrubio/TFM_smart_contract), and update its address in [src/config.tsx](https://github.com/sergiogrubio/TFM_dapp/blob/master/src/config.tsx).

### Step 3. Running in development mode

In the project folder run:

```bash
npm run start
```

This will start the React app in development mode, using the configs found in the `config.tsx` file.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### Step 4. Build for testing and production use

A build of the app is necessary to deploy for testing purposes or for production use.
To build the project run:

```bash
npm run build
```

Elrond dApp Template was implemented by The [Elrond Team](https://elrond.com/team/) and changed by me to implement testDEX.

## The thesis

You can find [the thesis of the project also on Github](https://github.com/sergiogrubio/TFM_latex) (but I wrote it in catalan, I think it is the first Elrond project using this language).

Finally, you may want to see a repo with a [script to test Elrond's network performance](https://github.com/sergiogrubio/TFM_stats).