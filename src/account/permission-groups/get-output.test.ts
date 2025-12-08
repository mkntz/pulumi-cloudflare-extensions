import * as cloudflare from "@pulumi/cloudflare";
import * as pulumi from "@pulumi/pulumi";

import { getStructuredPermissionGroupsOutput } from "./get-output";
import { mapToStructuredPermissionGroups } from "./mappers";
import { StructuredPermissionGroups } from "./models";

jest.mock("@pulumi/cloudflare");
jest.mock("./mappers");

describe("getStructuredPermissionGroupsOutput", () => {
  const mockAccountId = "test-account-id";
  const mockInvokeOptions: pulumi.InvokeOptions = {};

  const mockApiOutputResult: cloudflare.GetAccountApiTokenPermissionGroupsListResult =
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

  it("should call getAccountApiTokenPermissionGroupsListOutput with correct args", () => {
    const mockOutput = pulumi.output(mockApiOutputResult);
    const mockApply = jest
      .fn()
      .mockReturnValue(pulumi.output(mockStructuredResult));
    mockOutput.apply = mockApply;

    const mockGetAccountApiTokenPermissionGroupsListOutput = jest
      .fn()
      .mockReturnValue(mockOutput);
    (cloudflare.getAccountApiTokenPermissionGroupsListOutput as jest.Mock) =
      mockGetAccountApiTokenPermissionGroupsListOutput;
    (mapToStructuredPermissionGroups as jest.Mock).mockReturnValue(
      mockStructuredResult,
    );

    getStructuredPermissionGroupsOutput({ accountId: mockAccountId });

    expect(
      mockGetAccountApiTokenPermissionGroupsListOutput,
    ).toHaveBeenCalledWith({ accountId: mockAccountId }, undefined);
  });

  it("should pass invoke options to getAccountApiTokenPermissionGroupsListOutput", () => {
    const mockOutput = pulumi.output(mockApiOutputResult);
    const mockApply = jest
      .fn()
      .mockReturnValue(pulumi.output(mockStructuredResult));
    mockOutput.apply = mockApply;

    const mockGetAccountApiTokenPermissionGroupsListOutput = jest
      .fn()
      .mockReturnValue(mockOutput);
    (cloudflare.getAccountApiTokenPermissionGroupsListOutput as jest.Mock) =
      mockGetAccountApiTokenPermissionGroupsListOutput;
    (mapToStructuredPermissionGroups as jest.Mock).mockReturnValue(
      mockStructuredResult,
    );

    getStructuredPermissionGroupsOutput(
      { accountId: mockAccountId },
      mockInvokeOptions,
    );

    expect(
      mockGetAccountApiTokenPermissionGroupsListOutput,
    ).toHaveBeenCalledWith({ accountId: mockAccountId }, mockInvokeOptions);
  });

  it("should apply the mapper function to the output", () => {
    const mockOutput = pulumi.output(mockApiOutputResult);
    const mockApply = jest
      .fn()
      .mockReturnValue(pulumi.output(mockStructuredResult));
    mockOutput.apply = mockApply;

    const mockGetAccountApiTokenPermissionGroupsListOutput = jest
      .fn()
      .mockReturnValue(mockOutput);
    (cloudflare.getAccountApiTokenPermissionGroupsListOutput as jest.Mock) =
      mockGetAccountApiTokenPermissionGroupsListOutput;
    (mapToStructuredPermissionGroups as jest.Mock).mockReturnValue(
      mockStructuredResult,
    );

    getStructuredPermissionGroupsOutput({ accountId: mockAccountId });

    expect(mockApply).toHaveBeenCalledWith(mapToStructuredPermissionGroups);
  });

  it("should return a Pulumi Output", () => {
    const mockOutput = pulumi.output(mockApiOutputResult);
    const mockResultOutput = pulumi.output(mockStructuredResult);
    const mockApply = jest.fn().mockReturnValue(mockResultOutput);
    mockOutput.apply = mockApply;

    const mockGetAccountApiTokenPermissionGroupsListOutput = jest
      .fn()
      .mockReturnValue(mockOutput);
    (cloudflare.getAccountApiTokenPermissionGroupsListOutput as jest.Mock) =
      mockGetAccountApiTokenPermissionGroupsListOutput;
    (mapToStructuredPermissionGroups as jest.Mock).mockReturnValue(
      mockStructuredResult,
    );

    const result = getStructuredPermissionGroupsOutput({
      accountId: mockAccountId,
    });

    expect(result).toBe(mockResultOutput);
  });

  it("should handle accountId as Pulumi Input", () => {
    const accountIdOutput = pulumi.output(mockAccountId);
    const mockOutput = pulumi.output(mockApiOutputResult);
    const mockApply = jest
      .fn()
      .mockReturnValue(pulumi.output(mockStructuredResult));
    mockOutput.apply = mockApply;

    const mockGetAccountApiTokenPermissionGroupsListOutput = jest
      .fn()
      .mockReturnValue(mockOutput);
    (cloudflare.getAccountApiTokenPermissionGroupsListOutput as jest.Mock) =
      mockGetAccountApiTokenPermissionGroupsListOutput;
    (mapToStructuredPermissionGroups as jest.Mock).mockReturnValue(
      mockStructuredResult,
    );

    getStructuredPermissionGroupsOutput({ accountId: accountIdOutput });

    expect(
      mockGetAccountApiTokenPermissionGroupsListOutput,
    ).toHaveBeenCalledWith({ accountId: accountIdOutput }, undefined);
  });

  it("should handle different account IDs", () => {
    const differentAccountId = "different-account-id";
    const mockOutput = pulumi.output(mockApiOutputResult);
    const mockApply = jest
      .fn()
      .mockReturnValue(pulumi.output(mockStructuredResult));
    mockOutput.apply = mockApply;

    const mockGetAccountApiTokenPermissionGroupsListOutput = jest
      .fn()
      .mockReturnValue(mockOutput);
    (cloudflare.getAccountApiTokenPermissionGroupsListOutput as jest.Mock) =
      mockGetAccountApiTokenPermissionGroupsListOutput;
    (mapToStructuredPermissionGroups as jest.Mock).mockReturnValue(
      mockStructuredResult,
    );

    getStructuredPermissionGroupsOutput({ accountId: differentAccountId });

    expect(
      mockGetAccountApiTokenPermissionGroupsListOutput,
    ).toHaveBeenCalledWith({ accountId: differentAccountId }, undefined);
  });

  it("should chain the apply method correctly", () => {
    const mockOutput = pulumi.output(mockApiOutputResult);
    const mockResultOutput = pulumi.output(mockStructuredResult);
    const mockApply = jest.fn().mockReturnValue(mockResultOutput);
    mockOutput.apply = mockApply;

    const mockGetAccountApiTokenPermissionGroupsListOutput = jest
      .fn()
      .mockReturnValue(mockOutput);
    (cloudflare.getAccountApiTokenPermissionGroupsListOutput as jest.Mock) =
      mockGetAccountApiTokenPermissionGroupsListOutput;
    (mapToStructuredPermissionGroups as jest.Mock).mockReturnValue(
      mockStructuredResult,
    );

    const result = getStructuredPermissionGroupsOutput({
      accountId: mockAccountId,
    });

    expect(mockApply).toHaveBeenCalledTimes(1);
    expect(result).toBe(mockResultOutput);
  });
});
