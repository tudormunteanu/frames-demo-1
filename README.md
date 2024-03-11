This repo is the demo for a tutorial I wrote:
["Not Your Average Frames Tutorial" on Paragraph](https://paragraph.xyz/@tudorizer/not-your-average-frames-tutorial).


Dev notes
---
- only sharp 0.32 seems to work on Vercel
- Even though the response headers are explicitly added, I faced problems getting the image to render correctly on https://warpcast.com/~/developers/frames while serving the app from my local through Ngrok. 

My solution was to replace Ngrok with [cloudflared](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/get-started/create-local-tunnel/), which seems to handle headers better.

Your mileage may vary, especially depending on browser.