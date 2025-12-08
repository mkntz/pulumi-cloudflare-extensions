import * as cloudflare from "@pulumi/cloudflare";

import { mapToStructuredPermissionGroups } from "./mappers";

describe("mapToStructuredPermissionGroups", () => {
  it("should map account-scoped permissions correctly", () => {
    const input: cloudflare.GetAccountApiTokenPermissionGroupsListResult = {
      accountId: "test-account-id",
      id: "result-id",
      results: [
        {
          id: "perm-1",
          name: "Account Analytics Read",
          scopes: ["com.cloudflare.api.account"],
        },
        {
          id: "perm-2",
          name: "Account Settings Read",
          scopes: ["com.cloudflare.api.account"],
        },
      ],
    };

    const result = mapToStructuredPermissionGroups(input);

    expect(result).toEqual({
      account: {
        "Account Analytics Read": { id: "perm-1" },
        "Account Settings Read": { id: "perm-2" },
      },
      zone: {},
    });
  });

  it("should map zone-scoped permissions correctly", () => {
    const input: cloudflare.GetAccountApiTokenPermissionGroupsListResult = {
      accountId: "test-account-id",
      id: "result-id",
      results: [
        {
          id: "perm-1",
          name: "Zone Read",
          scopes: ["com.cloudflare.api.account.zone"],
        },
        {
          id: "perm-2",
          name: "DNS Write",
          scopes: ["com.cloudflare.api.account.zone"],
        },
      ],
    };

    const result = mapToStructuredPermissionGroups(input);

    expect(result).toEqual({
      account: {},
      zone: {
        "Zone Read": { id: "perm-1" },
        "DNS Write": { id: "perm-2" },
      },
    });
  });

  it("should map permissions with both account and zone scopes", () => {
    const input: cloudflare.GetAccountApiTokenPermissionGroupsListResult = {
      accountId: "test-account-id",
      id: "result-id",
      results: [
        {
          id: "perm-1",
          name: "Dual Scope Permission",
          scopes: [
            "com.cloudflare.api.account",
            "com.cloudflare.api.account.zone",
          ],
        },
      ],
    };

    const result = mapToStructuredPermissionGroups(input);

    expect(result).toEqual({
      account: {
        "Dual Scope Permission": { id: "perm-1" },
      },
      zone: {
        "Dual Scope Permission": { id: "perm-1" },
      },
    });
  });

  it("should handle mixed account and zone permissions", () => {
    const input: cloudflare.GetAccountApiTokenPermissionGroupsListResult = {
      accountId: "test-account-id",
      id: "result-id",
      results: [
        {
          id: "perm-1",
          name: "Account Analytics Read",
          scopes: ["com.cloudflare.api.account"],
        },
        {
          id: "perm-2",
          name: "Zone Read",
          scopes: ["com.cloudflare.api.account.zone"],
        },
        {
          id: "perm-3",
          name: "Account Settings Read",
          scopes: ["com.cloudflare.api.account"],
        },
      ],
    };

    const result = mapToStructuredPermissionGroups(input);

    expect(result).toEqual({
      account: {
        "Account Analytics Read": { id: "perm-1" },
        "Account Settings Read": { id: "perm-3" },
      },
      zone: {
        "Zone Read": { id: "perm-2" },
      },
    });
  });

  it("should ignore permissions with irrelevant scopes", () => {
    const input: cloudflare.GetAccountApiTokenPermissionGroupsListResult = {
      accountId: "test-account-id",
      id: "result-id",
      results: [
        {
          id: "perm-1",
          name: "Account Analytics Read",
          scopes: ["com.cloudflare.api.account"],
        },
        {
          id: "perm-2",
          name: "Unknown Scope Permission",
          scopes: ["com.cloudflare.api.other"],
        },
        {
          id: "perm-3",
          name: "Zone Read",
          scopes: ["com.cloudflare.api.account.zone"],
        },
      ],
    };

    const result = mapToStructuredPermissionGroups(input);

    expect(result).toEqual({
      account: {
        "Account Analytics Read": { id: "perm-1" },
      },
      zone: {
        "Zone Read": { id: "perm-3" },
      },
    });
  });

  it("should handle empty results array", () => {
    const input: cloudflare.GetAccountApiTokenPermissionGroupsListResult = {
      accountId: "test-account-id",
      id: "result-id",
      results: [],
    };

    const result = mapToStructuredPermissionGroups(input);

    expect(result).toEqual({
      account: {},
      zone: {},
    });
  });

  it("should handle permissions with multiple scopes including target scopes", () => {
    const input: cloudflare.GetAccountApiTokenPermissionGroupsListResult = {
      accountId: "test-account-id",
      id: "result-id",
      results: [
        {
          id: "perm-1",
          name: "Multi Scope Permission",
          scopes: [
            "com.cloudflare.api.other",
            "com.cloudflare.api.account",
            "com.cloudflare.api.random",
          ],
        },
      ],
    };

    const result = mapToStructuredPermissionGroups(input);

    expect(result).toEqual({
      account: {
        "Multi Scope Permission": { id: "perm-1" },
      },
      zone: {},
    });
  });

  it("should preserve permission IDs correctly", () => {
    const input: cloudflare.GetAccountApiTokenPermissionGroupsListResult = {
      accountId: "test-account-id",
      id: "result-id",
      results: [
        {
          id: "82e64a83756745bbbb1730c962c1f1e6",
          name: "Account Analytics Read",
          scopes: ["com.cloudflare.api.account"],
        },
        {
          id: "4755a26eedb94da69e1066d98aa820be",
          name: "Zone Read",
          scopes: ["com.cloudflare.api.account.zone"],
        },
      ],
    };

    const result = mapToStructuredPermissionGroups(input);

    expect(result.account["Account Analytics Read"]?.id).toBe(
      "82e64a83756745bbbb1730c962c1f1e6",
    );
    expect(result.zone["Zone Read"]?.id).toBe(
      "4755a26eedb94da69e1066d98aa820be",
    );
  });

  it("should handle permissions with empty scopes array", () => {
    const input: cloudflare.GetAccountApiTokenPermissionGroupsListResult = {
      accountId: "test-account-id",
      id: "result-id",
      results: [
        {
          id: "perm-1",
          name: "No Scope Permission",
          scopes: [],
        },
        {
          id: "perm-2",
          name: "Account Analytics Read",
          scopes: ["com.cloudflare.api.account"],
        },
      ],
    };

    const result = mapToStructuredPermissionGroups(input);

    expect(result).toEqual({
      account: {
        "Account Analytics Read": { id: "perm-2" },
      },
      zone: {},
    });
  });
});
