const CONFIG = {
  "title": "2459 Squadron",
  "logoUrl": "assets/roundel.svg",
  "maxWidth": "1400px",
  "backgrounds": [
    "assets/bg_typhoon_sunset_1781985512563.png",
    "assets/bg_red_arrows_1781985520592.png",
    "assets/bg_chinook_1781985529707.png",
    "assets/bg_spitfire_1781985538213.png",
    "assets/bg_f35_lightning_1781985547913.png",
    "assets/bg_typhoons_runway_1781985557595.png",
    "assets/bg_c17_ocean_1781985572492.png",
    "assets/bg_airfield_sunset_1781985581289.png",
    "assets/bg_midair_refuel_1781985591460.png",
    "assets/bg_jet_moon_1781985600349.png",
    "assets/bg_countryside_flight_1781985609804.png",
    "assets/bg_pilot_cockpit_1781985618655.png"
  ],
  "bgInterval": 5,
  "layout": [
    {
      "type": "row",
      "children": [
        {
          "type": "column",
          "children": [
            { "type": "widget", "widgetType": "title" }
          ]
        }
      ]
    },
    {
      "type": "row",
      "children": [
        {
          "type": "column",
          "children": [
            { "type": "widget", "widgetType": "search" }
          ]
        }
      ]
    },
    {
      "type": "row",
      "children": [
        {
          "type": "column",
          "width": "1/4",
          "children": [
            { "type": "widget", "widgetType": "time" }
          ]
        },
        {
          "type": "column",
          "width": "3/4",
          "children": [
            { 
              "type": "widget", 
              "widgetType": "weather", 
              "locationName": "Poulton-le-Fylde", 
              "latitude": 53.847, 
              "longitude": -2.992,
              "forecastDays": 4
            }
          ]
        }
      ]
    },
    {
      "type": "row",
      "children": [
        {
          "type": "column",
          "children": [
            {
              "type": "links",
              "title": "Squadron Resources",
              "columns": 3,
              "links": [
                { "title": "RAFAC Website", "url": "https://www.raf.mod.uk/aircadets/", "icon": "globe" },
                { "title": "Uniform Guidelines", "url": "https://www.raf.mod.uk/aircadets/cadets/uniform/", "icon": "shirt-folded" },
                { "title": "Welfare", "url": "https://www.raf.mod.uk/aircadets/safeguarding/", "icon": "heart" }
              ]
            }
          ]
        }
      ]
    },
    {
      "type": "row",
      "children": [
        {
          "type": "column",
          "width": "1/2",
          "children": [
            {
              "type": "links",
              "title": "Cadet Resources",
              "columns": 2,
              "links": [
                { "title": "Cadet Portal", "url": "https://cadets.bader.mod.uk", "icon": "airplane-tilt" },
                { "title": "Bader Learn", "url": "https://learning.bader.mod.uk", "icon": "book-open" },
                { "title": "First Aid", "url": "https://www.sja.org.uk/", "icon": "first-aid" },
                { "title": "DofE", "url": "https://www.edofe.org/", "icon": "backpack" },
                { "title": "TG21 / AV Med", "url": "https://rafac.sharepoint.com", "icon": "file-text" },
                { "title": "Uniform Request", "url": "https://cadets.bader.mod.uk", "icon": "t-shirt" },
                { "title": "Claim Badges", "url": "https://cadets.bader.mod.uk", "icon": "medal" }
              ]
            }
          ]
        },
        {
          "type": "column",
          "width": "1/2",
          "children": [
            {
              "type": "links",
              "title": "Staff Resources",
              "columns": 2,
              "links": [
                { "title": "Bader SharePoint", "url": "https://rafac.sharepoint.com", "icon": "microsoft-teams-logo" },
                { "title": "Volunteer Portal", "url": "https://volunteer.bader.mod.uk", "icon": "users" },
                { "title": "Bader Home Page", "url": "https://bader.mod.uk", "icon": "database" },
                { "title": "Training Portal", "url": "https://learning.bader.mod.uk", "icon": "chalkboard-teacher" },
                { "title": "SMS", "url": "https://sms.bader.mod.uk", "icon": "desktop" },
                { "title": "Key RAFAC Docs", "url": "https://rafac.sharepoint.com", "icon": "folder-open" }
              ]
            }
          ]
        }
      ]
    },
    {
      "type": "row",
      "children": [
        {
          "type": "column",
          "children": [
            {
              "type": "links",
              "title": "Useful Resources",
              "links": [
                { "title": "BBC News", "url": "https://www.bbc.co.uk/news", "icon": "television" },
                { "title": "YouTube", "url": "https://www.youtube.com", "icon": "youtube-logo" },
                { "title": "Royal Air Force", "url": "https://www.raf.mod.uk", "icon": "airplane-in-flight" },
                { "title": "Air Cadet Central", "url": "https://aircadetcentral.net", "icon": "users-three" },
                { "title": "Flightradar24", "url": "https://www.flightradar24.com", "icon": "radar" }
              ]
            }
          ]
        }
      ]
    }
  ]
};
