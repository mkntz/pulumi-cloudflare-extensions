# Pulumi Cloudflare Extensions

A comprehensive guide to using the `@mkntz/pulumi-cloudflare-extensions` library for extending Pulumi's Cloudflare provider with additional utilities.

## Table of Contents

- [Installation](#installation)
- [Overview](#overview)
- [API Reference](#api-reference)
  - [Permission Groups](#permission-groups)
- [Examples](#examples)
- [TypeScript Support](#typescript-support)

---

## Installation

Install the package from npm:

```bash
npm install @mkntz/pulumi-cloudflare-extensions
```

Or with yarn:

```bash
yarn add @mkntz/pulumi-cloudflare-extensions
```

### Prerequisites

- Node.js 18.x or later
- [@pulumi/pulumi](https://www.npmjs.com/package/@pulumi/pulumi) ^3.0.0
- [@pulumi/cloudflare](https://www.npmjs.com/package/@pulumi/cloudflare) ^5.0.0

---

## Overview

The `pulumi-cloudflare-extensions` library provides utility functions that extend the Cloudflare Pulumi provider with convenient helpers for common tasks. Currently, it focuses on simplifying the management and retrieval of Cloudflare API token permission groups.

### Key Features

- **Structured Permission Groups**: Convert flat Cloudflare API permission lists into an organized, hierarchical structure
- **Dual API Options**: Support for both async/await and Pulumi Output-based patterns
- **Type Safety**: Full TypeScript support with comprehensive type definitions
- **Seamless Integration**: Works naturally with Pulumi's resource and stack architecture

---

## API Reference

### Permission Groups

The permission groups module provides functions to retrieve and structure Cloudflare account API token permission groups. Permission groups are classified by scope: account-level and zone-level permissions.

#### `getStructuredPermissionGroups(args, opts?)`

**Description**: Asynchronously retrieves permission groups structured by scope.

**Arguments:**

- `args` (required): `GetStructuredPermissionGroupsArgs`
  - `accountId` (string): Your Cloudflare account ID
- `opts` (optional): `pulumi.InvokeOptions` - Standard Pulumi invoke options

**Returns**: `Promise<StructuredPermissionGroups>`

**Return Type:**

```typescript
interface StructuredPermissionGroups {
  account: Record<string, { id: string }>;
  zone: Record<string, { id: string }>;
}
```

The returned object contains:

- `account`: Permission groups with account-level scope (`com.cloudflare.api.account`)
- `zone`: Permission groups with zone-level scope (`com.cloudflare.api.account.zone`)

Each permission group is keyed by its human-readable name with an object containing its `id`.

**Use Cases:**

- When you need immediate access to permission group data
- In non-stack contexts where you can use async/await
- For imperative workflows

---

#### `getStructuredPermissionGroupsOutput(args, opts?)`

**Description**: Retrieves permission groups as a Pulumi Output, enabling declarative workflows and composition.

**Arguments:**

- `args` (required): `GetStructuredPermissionGroupsOutputArgs`
  - `accountId` (pulumi.Input<string>): Your Cloudflare account ID (can be an Output or string)
- `opts` (optional): `pulumi.InvokeOptions` - Standard Pulumi invoke options

**Returns**: `pulumi.Output<StructuredPermissionGroups>`

**Use Cases:**

- Stack-based Pulumi programs
- When passing account IDs from other resources
- For lazy evaluation and composition with other Pulumi resources
- When you need to reference this in export statements

---

#### Data Structure

Both functions return a `StructuredPermissionGroups` object with the following shape:

```typescript
{
  "account": {
    "Account Analytics Read": { "id": "abc123def456" },
    "Account Members Read": { "id": "xyz789uvw012" },
    "Account Settings Read": { "id": "..." }
    // ... more account permissions
  },
  "zone": {
    "Zone Read": { "id": "pqr345stu678" },
    "Zone DNS Read": { "id": "..." }
    // ... more zone permissions
  }
}
```

---

## Examples

### Basic Async Usage

Retrieve permission groups using async/await:

```typescript
import * as pulumi from "@pulumi/pulumi";
import { getStructuredPermissionGroups } from "@mkntz/pulumi-cloudflare-extensions";

const accountId = "your-cloudflare-account-id";

// In an async context
const permissionGroups = await getStructuredPermissionGroups({
  accountId,
});

console.log("Account permissions:", permissionGroups.account);
console.log("Zone permissions:", permissionGroups.zone);

// Access specific permission
const accountReadId = permissionGroups.account["Account Analytics Read"]?.id;
console.log("Account Analytics Read ID:", accountReadId);
```

---

### Stack-Based Usage with Outputs

Use with Pulumi stacks and resources:

```typescript
import * as pulumi from "@pulumi/pulumi";
import * as cloudflare from "@pulumi/cloudflare";
import { getStructuredPermissionGroupsOutput } from "@mkntz/pulumi-cloudflare-extensions";

const config = new pulumi.Config();
const accountId = config.require("accountId");

// Get permission groups as Output
const permissionGroups = getStructuredPermissionGroupsOutput({
  accountId,
});

// Create an API token with specific permissions
const apiToken = new cloudflare.ApiToken("my-token", {
  accountId,
  name: "My API Token",
  policies: [
    {
      permissionGroups: [
        // Reference permission by name - automatically resolves to ID
        permissionGroups.account["Account Analytics Read"].id,
        permissionGroups.zone["Zone Read"].id,
      ],
      resources: {
        "com.cloudflare.api.account.zone": "*",
      },
    },
  ],
});

// Export the token
export const token = apiToken.value;
```

---

### Creating API Tokens with Fine-Grained Permissions

```typescript
import * as pulumi from "@pulumi/pulumi";
import * as cloudflare from "@pulumi/cloudflare";
import { getStructuredPermissionGroupsOutput } from "@mkntz/pulumi-cloudflare-extensions";

const config = new pulumi.Config();
const accountId = config.require("accountId");
const accountEmail = config.require("accountEmail");

// Get structured permissions
const permissions = getStructuredPermissionGroupsOutput({ accountId });

// Create a read-only token for analytics
const analyticsToken = new cloudflare.ApiToken("analytics-token", {
  accountId,
  name: "Analytics Read-Only Token",
  policies: [
    {
      permissionGroups: [
        permissions.account["Account Analytics Read"].id,
        permissions.zone["Zone Analytics Read"].id,
      ],
      resources: {
        "com.cloudflare.api.account.zone": "*",
      },
    },
  ],
});

// Create a DNS management token
const dnsToken = new cloudflare.ApiToken("dns-token", {
  accountId,
  name: "DNS Management Token",
  policies: [
    {
      permissionGroups: [
        permissions.zone["Zone DNS Read"].id,
        permissions.zone["Zone DNS Write"].id,
      ],
      resources: {
        "com.cloudflare.api.account.zone": "*",
      },
    },
  ],
});

// Create a restrictive token for a specific zone
const zoneId = config.require("zoneId");
const restrictiveToken = new cloudflare.ApiToken("restrictive-token", {
  accountId,
  name: "Single Zone Token",
  policies: [
    {
      permissionGroups: [permissions.zone["Zone Read"].id],
      resources: {
        "com.cloudflare.api.account.zone": zoneId,
      },
    },
  ],
});

export const analyticsTokenValue = analyticsToken.value;
export const dnsTokenValue = dnsToken.value;
export const restrictiveTokenValue = restrictiveToken.value;
```

---

### Debugging and Inspection

Find available permissions:

```typescript
import { getStructuredPermissionGroups } from "@mkntz/pulumi-cloudflare-extensions";

async function listAllPermissions() {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID!;
  const groups = await getStructuredPermissionGroups({ accountId });

  console.log("=== Account-Level Permissions ===");
  Object.entries(groups.account).forEach(([name, { id }]) => {
    console.log(`  ${name}: ${id}`);
  });

  console.log("\n=== Zone-Level Permissions ===");
  Object.entries(groups.zone).forEach(([name, { id }]) => {
    console.log(`  ${name}: ${id}`);
  });
}

listAllPermissions().catch(console.error);
```

---

### Combining with Configuration

```typescript
import * as pulumi from "@pulumi/pulumi";
import * as cloudflare from "@pulumi/cloudflare";
import { getStructuredPermissionGroupsOutput } from "@mkntz/pulumi-cloudflare-extensions";

const config = new pulumi.Config();
const accountId = config.require("accountId");
const requiredPermissions = config.requireObject<string[]>("permissions");

const permissions = getStructuredPermissionGroupsOutput({ accountId });

// Dynamically create tokens based on configuration
const tokens = requiredPermissions.map((permName, index) => {
  return new cloudflare.ApiToken(`token-${index}`, {
    accountId,
    name: `Token for ${permName}`,
    policies: [
      {
        // Permission can be from either account or zone scope
        permissionGroups: pulumi
          .all([
            permissions.account[permName]?.id,
            permissions.zone[permName]?.id,
          ])
          .apply(([accountPerm, zonePerm]) => {
            const id = accountPerm || zonePerm;
            if (!id) throw new Error(`Permission '${permName}' not found`);
            return [id];
          }),
        resources: {
          "com.cloudflare.api.account.zone": "*",
        },
      },
    ],
  });
});

export const tokenValues = tokens.map((t) => t.value);
```

---

## TypeScript Support

This library is fully typed with TypeScript and provides comprehensive type definitions.

### Available Types

```typescript
// Main data structure
export interface StructuredPermissionGroups {
  account: Record<string, { id: string }>;
  zone: Record<string, { id: string }>;
}

// Async function arguments
export interface GetStructuredPermissionGroupsArgs {
  accountId: string;
}

// Output function arguments (supports Pulumi Inputs)
export interface GetStructuredPermissionGroupsOutputArgs {
  accountId: pulumi.Input<string>;
}
```

### Type Safety Example

```typescript
import * as pulumi from "@pulumi/pulumi";
import {
  getStructuredPermissionGroupsOutput,
  StructuredPermissionGroups,
} from "@mkntz/pulumi-cloudflare-extensions";

const config = new pulumi.Config();
const accountId = config.require("accountId");

// Fully typed
const permissions: pulumi.Output<StructuredPermissionGroups> =
  getStructuredPermissionGroupsOutput({ accountId });

// TypeScript knows the structure
permissions.apply((p) => {
  Object.entries(p.account).forEach(([name, { id }]) => {
    console.log(name, id); // Both typed as strings
  });
});
```

---

## Error Handling

### Async Pattern

```typescript
import { getStructuredPermissionGroups } from "@mkntz/pulumi-cloudflare-extensions";

try {
  const permissions = await getStructuredPermissionGroups({
    accountId: "invalid-id",
  });
} catch (error) {
  console.error("Failed to fetch permission groups:", error);
  // Handle error appropriately
}
```

### Output Pattern

Errors in Output-based calls are handled through Pulumi's standard error propagation:

```typescript
import * as pulumi from "@pulumi/pulumi";
import { getStructuredPermissionGroupsOutput } from "@mkntz/pulumi-cloudflare-extensions";

const permissions = getStructuredPermissionGroupsOutput({
  accountId: config.require("accountId"),
});

// Errors will be caught during pulumi up/preview
export const report = permissions.apply((p) => {
  // This only executes if the API call succeeds
  return `Found ${Object.keys(p.account).length} account permissions`;
});
```

---

## Best Practices

1. **Cache Results**: If calling the same function multiple times, consider caching the output to avoid redundant API calls.

   ```typescript
   const permissions = getStructuredPermissionGroupsOutput({ accountId });
   // Reuse `permissions` across multiple resources
   ```

2. **Validate Permissions**: Always verify that expected permissions exist before using them.

   ```typescript
   permissions.apply((p) => {
     if (!p.account["Account Analytics Read"]) {
       throw new Error("Required permission not found");
     }
   });
   ```

3. **Use Configuration Files**: Store sensitive data like account IDs in Pulumi configuration.

   ```bash
   pulumi config set accountId <your-account-id>
   ```

4. **Prefer Output Pattern in Stacks**: Use `getStructuredPermissionGroupsOutput` in Pulumi stack programs for better composition and dependency tracking.

5. **Minimal Permissions**: Only request permissions that are actually needed for your use case.

---

## Troubleshooting

### "Permission not found" Errors

If you get an error about a permission not being found:

1. Verify the exact permission name (case-sensitive)
2. Check that your account ID is correct
3. Use the debugging example above to list all available permissions

### API Call Failures

If API calls are failing:

1. Ensure your Cloudflare credentials are properly configured
2. Verify the account ID is valid
3. Check that your account has the necessary API access
4. Review Cloudflare API documentation for any rate limits

### TypeScript Errors

Ensure you're using compatible versions:

- `@pulumi/pulumi` version 3.0.0 or later
- `@pulumi/cloudflare` version 5.0.0 or later

---

## Contributing

Found a bug or have a feature request? Please open an issue on [GitHub](https://github.com/mkntz/pulumi-cloudflare-extensions/issues).

---

## License

MIT - See [LICENSE](./LICENSE) file for details

---

## Support

For questions and discussions, please open an issue on the [GitHub repository](https://github.com/mkntz/pulumi-cloudflare-extensions).
