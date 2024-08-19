# Request template JSON spec

#### v0.1

In any string field not in the `meta` object, you can use double curlies (`{{ }}`) to use:

- Locals:

  - Defined within the requestTemplate
  - Example usage: `{{ locals.BASE_URL }}/users`

- Parameters:

  - Defined when running the request
  - Can also be JSON strings - useful for passing arrays to requests
  - Example usage: `{{ locals.BASE_URL }}/user/{{ parameters.userId }}`

- Environment Variables:
  - Defined in a `.env` or `.env.local` file
  - Example: usage: `{ Authorization: "Bearer {{ secrets.AUTH_SECRET}}" }`

```typescript
type RequestTemplateV0_1 = {
  meta: {
    templateVersion: "v0.1";
    name: string;
  };

  url: string;
  method: "POST" | "GET" | "PUT" | "DELETE";
  payload: any; // TODO: What is the type of payload, can arraybuffers be used in http for example?
  headers: Record<string, string>;
  locals: Record<string, string>;
};
```
