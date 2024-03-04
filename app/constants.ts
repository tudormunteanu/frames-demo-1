export const APP_URL = process.env["HOST"] || "https://replaceme.com";
export const API_BASE_URL = `${process.env["HOST"]}/api`;

export const tmpLevels = [
  {
    name: "Google Glass",
    file: "google-glass.jpg",
    mvp: true
  },
  {
    name: "Facebook Activity Feeds circa 2008. New ads platform, surpased MySpace",
    file: "facebook.jpg",
    mvp: false
  },
  {
    name: "Apple Vision",
    file: "apple-vision.jpg",
    mvp: true
  },
  {
    name: "iPhone 1",
    file: "apple-iphone-1.jpg",
    mvp: false
  },
  {
    name: "Tesla Roadster",
    file: "tesla-roadster.jpg",
    mvp: false
  },
  {
    name: "Buffer, launched 2010",
    file: "buffer.png",
    mvp: true
  },
  {
    name: "SpaceX Falcon 1, with three failed launch attempts",
    file: "spacex-falcon-1.jpg",
    mvp: true
  },
  {
    name: "Boston Dynamics Atlas from 2015, when the tether was removed",
    file: "atlas.png",
    mvp: false
  },
];
