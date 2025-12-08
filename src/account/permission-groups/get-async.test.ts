import * as cloudflare from "@pulumi/cloudflare";
import * as pulumi from "@pulumi/pulumi";

import { getStructuredPermissionGroups } from "./get-async";
import { mapToStructuredPermissionGroups } from "./mappers";
import { StructuredPermissionGroups } from "./models";

jest.mock("@pulumi/cloudflare");
jest.mock("./mappers");

describe("getStructuredPermissionGroups", () => {
  const mockAccountId = "test-account-id";
  const mockInvokeOptions: pulumi.InvokeOptions = {};

  const mockApiResult: cloudflare.GetAccountApiTokenPermissionGroupsListResult =
    {
      accountId: mockAccountId,
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
      ],
    };

  const mockStructuredResult: StructuredPermissionGroups = {
    account: {
      "Account Analytics Read": { id: "perm-1" },
    },
    zone: {
      "Zone Read": { id: "perm-2" },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call getAccountApiTokenPermissionGroupsList with correct args", async () => {
    const mockGetAccountApiTokenPermissionGroupsList = jest
      .fn()
      .mockResolvedValue(mockApiResult);
    (cloudflare.getAccountApiTokenPermissionGroupsList as jest.Mock) =
      mockGetAccountApiTokenPermissionGroupsList;
    (mapToStructuredPermissionGroups as jest.Mock).mockReturnValue(
      mockStructuredResult,
    );

    await getStructuredPermissionGroups({ accountId: mockAccountId });

    expect(mockGetAccountApiTokenPermissionGroupsList).toHaveBeenCalledWith(
      { accountId: mockAccountId },
      undefined,
    );
  });

  it("should pass invoke options to getAccountApiTokenPermissionGroupsList", async () => {
    const mockGetAccountApiTokenPermissionGroupsList = jest
      .fn()
      .mockResolvedValue(mockApiResult);
    (cloudflare.getAccountApiTokenPermissionGroupsList as jest.Mock) =
      mockGetAccountApiTokenPermissionGroupsList;
    (mapToStructuredPermissionGroups as jest.Mock).mockReturnValue(
      mockStructuredResult,
    );

    await getStructuredPermissionGroups(
      { accountId: mockAccountId },
      mockInvokeOptions,
    );

    expect(mockGetAccountApiTokenPermissionGroupsList).toHaveBeenCalledWith(
      { accountId: mockAccountId },
      mockInvokeOptions,
    );
  });

  it("should map the result using mapToStructuredPermissionGroups", async () => {
    const mockGetAccountApiTokenPermissionGroupsList = jest
      .fn()
      .mockResolvedValue(mockApiResult);
    (cloudflare.getAccountApiTokenPermissionGroupsList as jest.Mock) =
      mockGetAccountApiTokenPermissionGroupsList;
    (mapToStructuredPermissionGroups as jest.Mock).mockReturnValue(
      mockStructuredResult,
    );

    await getStructuredPermissionGroups({ accountId: mockAccountId });

    expect(mapToStructuredPermissionGroups).toHaveBeenCalledWith(mockApiResult);
  });

  it("should return the structured permission groups", async () => {
    const mockGetAccountApiTokenPermissionGroupsList = jest
      .fn()
      .mockResolvedValue(mockApiResult);
    (cloudflare.getAccountApiTokenPermissionGroupsList as jest.Mock) =
      mockGetAccountApiTokenPermissionGroupsList;
    (mapToStructuredPermissionGroups as jest.Mock).mockReturnValue(
      mockStructuredResult,
    );

    const result = await getStructuredPermissionGroups({
      accountId: mockAccountId,
    });

    expect(result).toEqual(mockStructuredResult);
  });

  it("should handle API errors gracefully", async () => {
    const mockError = new Error("API Error");
    const mockGetAccountApiTokenPermissionGroupsList = jest
      .fn()
      .mockRejectedValue(mockError);
    (cloudflare.getAccountApiTokenPermissionGroupsList as jest.Mock) =
      mockGetAccountApiTokenPermissionGroupsList;

    await expect(
      getStructuredPermissionGroups({ accountId: mockAccountId }),
    ).rejects.toThrow("API Error");
  });

  it("should handle different account IDs", async () => {
    const differentAccountId = "different-account-id";
    const mockGetAccountApiTokenPermissionGroupsList = jest
      .fn()
      .mockResolvedValue({
        ...mockApiResult,
        accountId: differentAccountId,
      });
    (cloudflare.getAccountApiTokenPermissionGroupsList as jest.Mock) =
      mockGetAccountApiTokenPermissionGroupsList;
    (mapToStructuredPermissionGroups as jest.Mock).mockReturnValue(
      mockStructuredResult,
    );

    await getStructuredPermissionGroups({ accountId: differentAccountId });

    expect(mockGetAccountApiTokenPermissionGroupsList).toHaveBeenCalledWith(
      { accountId: differentAccountId },
      undefined,
    );
  });
});
