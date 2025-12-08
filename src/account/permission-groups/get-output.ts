import * as cloudflare from "@pulumi/cloudflare";
import * as pulumi from "@pulumi/pulumi";

import { mapToStructuredPermissionGroups } from "./mappers";
import { StructuredPermissionGroups } from "./models";

export interface GetStructuredPermissionGroupsOutputArgs {
  accountId: pulumi.Input<string>;
}
export function getStructuredPermissionGroupsOutput(
  args: GetStructuredPermissionGroupsOutputArgs,
  opts?: pulumi.InvokeOptions,
): pulumi.Output<StructuredPermissionGroups> {
  return cloudflare
    .getAccountApiTokenPermissionGroupsListOutput(
      { accountId: args.accountId },
      opts,
    )
    .apply(mapToStructuredPermissionGroups);
}
