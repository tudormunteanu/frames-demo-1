import {Metadata} from "next";

import {API_BASE_URL, APP_URL} from "@/app/constants";
import {getFrameVersion} from "@/app/actions";
import {MetadataProps} from "@/app/types";


export async function generateMetadata(
  {searchParams}: MetadataProps,
): Promise<Metadata> {

  const version = await getFrameVersion();

  const {score} = searchParams;

  const imageUrl = `${API_BASE_URL}/images/over?score=${score}&version=${version}`;

  const sharingText = encodeURIComponent(`Can you guess more than ${score} MVPs?`);
  const sharingUrl = `https://warpcast.com/~/compose?text=${sharingText}&embeds[]=${encodeURIComponent(APP_URL)}`;

  const fcMetadata: Record<string, string> = {
    "fc:frame": "vNext",
    "fc:frame:post_url": `${API_BASE_URL}/next?version=${version}`,
    "fc:frame:image": imageUrl,
    "fc:frame:button:1": "Challenge your followers ‼️",
    "fc:frame:button:1:action": "link",
    "fc:frame:button:1:target": sharingUrl,
    "fc:frame:button:2": "Follow author",
    "fc:frame:button:2:action": "link",
    "fc:frame:button:2:target": "https://warpcast.com/tudorizer",
  };

  return {
    title: "MVP or not MVP?",
    openGraph: {
      title: "MVP or not MVP?",
      images: ["/api/over"],
    },
    other: {
      ...fcMetadata,
    },
    metadataBase: new URL(process.env["HOST"] || "")
  };
}

export default async function Page() {
  return <p>over</p>;
}