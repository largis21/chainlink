# Chain template JSON spec

#### v0.1

```typescript
type ChainTemplateV0_1 = {
  meta: {
    templateVersion: "v0.1";
    name: string;
  };

  chain: RequestRunner[];
};

type RequestRunner = {
  runnerId: string;

  run: {
    requestTemplate: RequestTemplateV0_1;
    parameters: Record<
      string,
      | string
      | {
          runnerId: string;
          outputName: string;
          required: boolean;
        }
    >;
  };

  // After the request is run
  after: {
    setOutputs: {
      /**
       * TODO: This can be worded better
       * The key will be jsonmatched to the response
       * The value of the key is the name of your choice
       *
       * This will set the variable `firstUser` to the value of `response.json.users[0]`
       * "response.json.users[0]": "firstUser"
       */
      [key: string]: string;
    };
  };
};
```
