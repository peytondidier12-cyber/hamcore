# HAMCORE GitHub Edition

A separate, static public website for the HAMCORE project. It is designed for GitHub Pages and does **not** run or modify the Python/SQLite HAMCORE application.

## Included
- Responsive HAMCORE landing page
- Interactive Florida map (Leaflet + Esri World Street Map tiles)
- Search, county and mode filters
- Repeater directory table
- Import a CSV exported from HAMCORE and export the currently loaded records
- No private logbook, local database, radio configuration, or credentials

## Publish with GitHub Pages
1. Sign in to GitHub and create a **public** repository named `hamcore`.
2. Extract this ZIP on your computer.
3. Upload the files and folders inside `HAMCORE-GitHub-Edition` to the root of that repository (not the ZIP itself).
4. In the repository, open **Settings → Pages**.
5. Under **Build and deployment**, choose **Deploy from a branch**.
6. Select branch `main`, folder `/ (root)`, then Save.
7. After GitHub finishes publishing, the site should be at `https://peytondidier12-cyber.github.io/hamcore/`.

## Add your repeater records
The website starts with an empty directory. This ZIP did not include your local repeater database, so no frequencies or locations have been invented or published.

In HAMCORE, use Florida Repeater Center → Export CSV. On the public site, choose **Import CSV** and select that exported file. The site reads the file in your browser; it does not upload it to a server. To make records appear for every visitor, the records must later be added to `repeaters.json` in the repository using the JSON format below.

### JSON format
`repeaters.json` is an array of objects:
```json
[
  {
    "name": "Example repeater",
    "callsign": "W1ABC",
    "city": "Example City",
    "county": "Example",
    "output_frequency": "146.940",
    "input_frequency": "146.340",
    "tone": "123.0",
    "mode": "FM",
    "latitude": 27.8,
    "longitude": -80.5,
    "notes": "Verify details with a current source",
    "source": "Source name",
    "verified_date": "YYYY-MM-DD"
  }
]
```
Only publish records you have permission to share and have checked against a current trusted source. The map only plots records with valid latitude/longitude. Do not use demo city-center coordinates as actual repeater sites.

## Custom domain
A custom domain such as `hamcore.com` must be registered separately and may cost money. Its availability has not been checked. Ask a parent/guardian to help with registration and DNS setup. Once you own it, GitHub Pages has a Custom domain setting under Settings → Pages.

## Notes
- The map requires an internet connection and uses third-party map tiles.
- This is a public, read-only directory, not a radio transmitter control system.
- The directory is informational; verify frequency, offset, tone, mode, and status before operating.
