import * as cloudflare from "@pulumi/cloudflare";
import * as pulumi from "@pulumi/pulumi";

import { mapToStructuredPermissionGroups } from "./mappers";
import { StructuredPermissionGroups } from "./models";

export interface GetStructuredPermissionGroupsArgs {
  accountId: string;
}
export async function getStructuredPermissionGroups(
  args: GetStructuredPermissionGroupsArgs,
  opts?: pulumi.InvokeOptions,
): Promise<StructuredPermissionGroups> {
  return cloudflare
    .getAccountApiTokenPermissionGroupsList({ accountId: args.accountId }, opts)
    .then(mapToStructuredPermissionGroups);
}
