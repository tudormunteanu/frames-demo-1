import {Metadata} from "next";

import {API_BASE_URL} from "@/app/constants";
import { getFrameVersion } from "@/app/actions";


export async function generateMetadata(): Promise<Metadata> {

    const version = await getFrameVersion();

    const fcMetadata: Record<string, string> = {
        "fc:frame": "vNext",
        "fc:frame:post_url": `${API_BASE_URL}/start`,
        "fc:frame:image": `${API_BASE_URL}/images/splash?version=${version}`,
        "fc:frame:button:1": "Can you guess them all? Let's a-go, Mario!",
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
    return <p>hello</p>;

}