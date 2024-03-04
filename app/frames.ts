"use server";

import {getSSLHubRpcClient, Message} from "@farcaster/hub-nodejs";

const HUB_URL = process.env["HUB_URL"];
const client = HUB_URL ? getSSLHubRpcClient(HUB_URL) : undefined;

type FrameContext = {
  buttonIndex: number;
  fid: number;
}

export async function parseFramePayload(payload: any): Promise<FrameContext> {

  let validatedMessage : Message | undefined = undefined;
  try {
    const frameMessage = Message.decode(Buffer.from(payload?.trustedData?.messageBytes || "", "hex"));
    const result = await client?.validateMessage(frameMessage);
    if (result && result.isOk() && result.value.valid) {
      validatedMessage = result.value.message;
    }
    let urlBuffer = validatedMessage?.data?.frameActionBody?.url || [];
    const urlString = Buffer.from(urlBuffer).toString("utf-8");
    if (validatedMessage && !urlString.startsWith(process.env["HOST"] || "")) {
      throw new Error(`Invalid frame url: ${urlBuffer}`);
    }
  } catch (e) {
    throw new Error(`Failed to validate message: ${e}`);
  }

  let buttonId = 0, fid = 0;
  if (client) {
    buttonId = validatedMessage?.data?.frameActionBody?.buttonIndex || 0;
    fid = validatedMessage?.data?.fid || 0;
  } else {
    buttonId = payload?.untrustedData?.buttonIndex || 0;
    fid = payload?.untrustedData?.fid || 0;
  }

  return {buttonIndex: buttonId, fid: fid};
}
