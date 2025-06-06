# Up Yeah… nah

A Typescript API client and a bunch of reusable Zod schemas for the
[UP Bank customer API](https://developer.up.com.au).

> [!NOTE]
> This package is not provided or endorsed by Up bank.

## A Typescript API client

All the current API endpoints are supported and exposed using simple wrapper
methods. The below will list all the accounts that the API token can access, it
even handles pagination for you (all `list*` methods have a `listAll*` version).

```ts
import type { AccountsFilterQueryParams, TokenObject } from 'up-yeah-nah'
import { listAllAccounts } from 'up-yeah-nah'

const token: TokenObject = {
  owner: 'Bruce',
  token: 'up:yeah:bunchoflettersandnumbers',
}

const filter: AccountsFilterQueryParams = {
  accountType: 'SAVER',
}

// Dirty IIFE to handle async at top-level
;(async () => {
  const accounts = await listAllAccounts({ token }, { filter })

  console.log(accounts)
})()
```

You can also use the base client for each object if you want more direct access
to the API. You'll have to handle pagination yourself though.

```ts
import { accountsClient } from 'up-yeah-nah'

const token = 'up:yeah:bunchoflettersandnumbers'

// Dirty IIFE to handle async at top-level
;(async () => {
  const accounts = await accountsClient.listAccounts({
    headers: {
      authorization: `Bearer ${token}`,
    },
    query: {
      filter: {
        accountType: 'SAVER',
      },
      page: {
        size: 100,
      },
    },
  })

  console.log(accounts)
})()
```

Both options do comprehensive schema checks on both the request and the response
using…

## A bunch of reusable Zod schemas

All the core objects have Zod schemas which you can import and use, like this.

```ts
import { accountSchema } from 'up-yeah-nah'

const result = accountSchema.safeParse({
  type: 'accounts',
  id: 'some-uuid-that-will-pass',
  attributes: {
    displayName: 'Spending',
    accountType: 'SAVER',
    ownershipType: 'INDIVIDUAL',
    balance: {
      currencyCode: 'AUD',
      value: '120.05',
      valueInBaseUnits: 12005,
    },
    createdAt: '2025-08-01T13:03:37+00:00',
  },
  relationships: {
    transactions: {
      links: {
        related: 'https://api.up.com.au/api/v1/accounts/some-uuid-that-will-pass/transactions',
      },
    },
  },
})

console.log(result)
```
