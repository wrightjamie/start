const CONFIG = {
  "title": "2459 Squadron",
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
              "longitude": -2.992 
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
              "columns": 5,
              "links": [
                { "title": "RAFAC Website", "url": "https://www.raf.mod.uk/aircadets/", "icon": "globe" },
                { "title": "Squadron Calendar", "url": "#", "icon": "calendar" },
                { "title": "Uniform Guidelines", "url": "#", "icon": "shirt-folded" },
                { "title": "SharePoint", "url": "https://rafac.sharepoint.com", "icon": "microsoft-teams-logo" },
                { "title": "Welfare", "url": "#", "icon": "heart" }
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
                { "title": "Ultilearn", "url": "https://learning.bader.mod.uk", "icon": "book-open" },
                { "title": "Rank Structure", "url": "#", "icon": "star" },
                { "title": "Aviation Training", "url": "#", "icon": "airplane" },
                { "title": "First Aid", "url": "#", "icon": "first-aid" },
                { "title": "Marksmanship", "url": "#", "icon": "target" },
                { "title": "DofE", "url": "https://www.edofe.org/", "icon": "backpack" }
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
                { "title": "Volunteer Portal", "url": "https://volunteer.bader.mod.uk", "icon": "users" },
                { "title": "Bader Home Page", "url": "https://bader.mod.uk", "icon": "database" },
                { "title": "Training Portal", "url": "#", "icon": "chalkboard-teacher" },
                { "title": "SMS", "url": "https://sms.bader.mod.uk", "icon": "desktop" },
                { "title": "ACPs / APs", "url": "#", "icon": "folder-open" },
                { "title": "Event Planning", "url": "#", "icon": "map-trifold" },
                { "title": "Equipment Issue", "url": "#", "icon": "package" },
                { "title": "Mess / Social", "url": "#", "icon": "coffee" }
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
