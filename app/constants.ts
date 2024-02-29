import { Level } from '@/app/types';

export const APP_URL = process.env['HOST'] || "https://replaceme.com";
export const API_BASE_URL = `${process.env['HOST']}/api`;

export const levels: Level[] = [
    {
        name: "Google Glass",
        id: 0,
        mvp: true
    },
    {
        "name": "Apple Vision",
        id: 1,
        mvp: true
    },
    {
        "name": "iPhone 1",
        id: 2,
        mvp: true
    },
    {
        "name": "Tesla Roadster",
        id: 3,
        mvp: true
    },
    {
        "name": "Facebook circa 2008, which had not advertising, but had students from Stanford.",
        id: 4,
        mvp: true
    }
    // add the first SpaceX rocket that exploded
];
