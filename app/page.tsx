import {Metadata} from "next";

const API_BASE_URL = `${process.env['HOST']}/api`;

export async function generateMetadata(): Promise<Metadata> {

    const fcMetadata: Record<string, string> = {
        "fc:frame": "vNext",
        "fc:frame:post_url": `${API_BASE_URL}/next`,
        "fc:frame:image": `${API_BASE_URL}/splash`,
        "fc:frame:button:1": "Can you guess them all?",
    };

    return {
        title: "MVP or not MVP?",
        openGraph: {
            title: "MVP or not MVP?",
            images: [`/api/start`],
        },
        other: {
            ...fcMetadata,
        },
        metadataBase: new URL(process.env['HOST'] || '')
    }
}

export default async function Page({params}: { params: {id: string}}) {
    return(
        <>
            <p>hello</p>
        </>
    );

}