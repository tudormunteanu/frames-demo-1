import {kv} from "@vercel/kv";
import Head from "next/head";
import {Metadata, ResolvingMetadata} from "next";

type Props = {
    params: { id: string }
    searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(): Promise<Metadata> {

    const fcMetadata: Record<string, string> = {
        "fc:frame": "vNext",
        "fc:frame:post_url": `${process.env['HOST']}/api/start`,
        "fc:frame:image": `${process.env['HOST']}/api/start_image`,
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