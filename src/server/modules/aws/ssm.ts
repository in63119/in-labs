import {
  SSMClient,
  GetParameterCommand,
  PutParameterCommand,
} from "@aws-sdk/client-ssm";
import { AwsConfigs } from "@/common/types";

type SaveSsmParams = AwsConfigs & {
  value?: string;
  patch?: Record<string, unknown>;
  overwrite?: boolean;
};

export const saveSsm = async ({
  accessKey,
  secretAccessKey,
  region,
  param,
  value,
  patch,
  overwrite = true,
}: SaveSsmParams) => {
  if (!accessKey || !secretAccessKey) {
    throw new Error("AWS accessKey or secretAccessKey not found");
  }

  if (!param) {
    throw new Error("SSM parameter name is required");
  }

  if (value === undefined && !patch) {
    throw new Error("Either value or patch must be provided");
  }

  const client = new SSMClient({
    region,
    credentials: {
      accessKeyId: accessKey,
      secretAccessKey,
    },
  });

  let finalValue = value;

  if (patch) {
    const getCmd = new GetParameterCommand({
      Name: param,
      WithDecryption: false,
    });

    let existing: Record<string, unknown> = {};
    try {
      const { Parameter } = await client.send(getCmd);
      if (Parameter?.Value) {
        const parsed = JSON.parse(Parameter.Value);
        if (typeof parsed === "object" && parsed !== null) {
          existing = parsed as Record<string, unknown>;
        }
      }
    } catch (error) {
      console.warn(
        "saveSsm: failed to read existing parameter, proceeding with patch only",
        error
      );
    }

    finalValue = JSON.stringify({ ...existing, ...patch });
  }

  const command = new PutParameterCommand({
    Name: param,
    Value: finalValue ?? "",
    Type: "String",
    Overwrite: overwrite,
  });

  return client.send(command);
};
