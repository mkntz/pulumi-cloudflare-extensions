import * as cloudflare from "@pulumi/cloudflare";

import { StructuredPermissionGroups } from "./models";

export function mapToStructuredPermissionGroups(
  result: cloudflare.GetAccountApiTokenPermissionGroupsListResult,
): StructuredPermissionGroups {
  const groups = result.results;
  return groups.reduce<StructuredPermissionGroups>(
    (result, { id, name, scopes }) => {
      if (scopes.includes("com.cloudflare.api.account")) {
        result.account[name] = { id };
      }
      if (scopes.includes("com.cloudflare.api.account.zone")) {
        result.zone[name] = { id };
      }
      return result;
    },
    {
      account: {},
      zone: {},
    },
  );
}
