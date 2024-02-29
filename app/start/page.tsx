import {Metadata} from "next";

import {API_BASE_URL} from "@/app/constants";
import {getFrameVersion, getGame} from "@/app/actions";

export async function generateMetadata(): Promise<Metadata> {

    const version = await getFrameVersion();

    const imageUrl = `${API_BASE_URL}/images/level?version=${version}`;

    const fcMetadata: Record<string, string> = {
        "fc:frame": "vNext",
        "fc:frame:post_url": `${API_BASE_URL}/next?version=${version}`,
        "fc:frame:image": imageUrl,
        "fc:frame:button:1": "MVP",
        "fc:frame:button:2": "Not MVP",
    };

    return {
        title: "MVP or not MVP?",
        openGraph: {
            title: "MVP or not MVP?",
            images: [`/api/splash`],
        },
        other: {
            ...fcMetadata,
        },
        metadataBase: new URL(process.env['HOST'] || '')
    }
}

export default async function Page() {
    return <p>start</p>;
}