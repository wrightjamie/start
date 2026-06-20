# RAFAC Squadron Homepage - JSON Configuration Schema

The homepage is entirely driven by a single `config.json` file. This file dictates the page title, the layout structure (rows, columns), and the content (link grids, widgets).

### Global Properties
| Property | Type | Description |
| :--- | :--- | :--- |
| `title` | String | The main heading displayed at the top of the page. |
| `backgrounds` | Array of Strings | An array of image URLs/paths to cycle through as the background. |
| `bgInterval` | Number | The number of minutes before automatically transitioning to the next background image. Set to 0 to disable automatic rotation. |
| `layout` | Array of Objects | The root container for the dashboard. Contains `Row` nodes. |

```json
{
  "title": "My Squadron Dashboard",
  "backgrounds": ["/img/bg1.jpg", "/img/bg2.jpg"],
  "bgInterval": 15,
  "layout": [
    // Nodes go here
  ]
}
```

## Node Types

Every object in the `layout` array (and its nested `children`) must have a `type` property.

### 1. Row Node
A horizontal container that wraps its children.
- `type`: `"row"`
- `children` (array): A list of child nodes (usually columns).

```json
{
  "type": "row",
  "children": [ /* columns or widgets */ ]
}
```

### 2. Column Node
A vertical container inside a row.
- `type`: `"column"`
- `width` (string, optional): A fractional width like `"1/2"`, `"1/3"`, `"1/4"`, `"3/4"`. If omitted, it defaults to equal flex distribution.
- `children` (array): A list of child nodes (widgets, grids, rows).

```json
{
  "type": "column",
  "width": "1/4",
  "children": [ /* widgets or grids */ ]
}
```

### 3. Links Node
A glass-panel container that displays a grid of clickable links.
- `type`: `"links"`
- `title` (string, optional): Section title displayed above the grid. Leave blank or omit to save vertical space.
- `columns` (number, optional): Number of columns in the grid. Defaults to 3.
- `links` (array): Array of link objects.

**Link Object:**
- `title` (string): Link title.
- `url` (string): Destination URL.
- `icon` (string): A valid [Phosphor Icons](https://phosphoricons.com/) name (e.g., `"airplane-tilt"`, `"users"`).
- `subtitle` (string, optional): Small grey text under the title.

```json
{
  "type": "links",
  "title": "Cadet Resources",
  "columns": 5,
  "links": [
    { "title": "Cadet Portal", "url": "https://cadets.bader.mod.uk", "icon": "airplane-tilt", "subtitle": "Access events" }
  ]
}
```

### 4. Widget Node
Displays dynamic content in a glass-panel.
- `type`: `"widget"`
- `widgetType` (string): `"time"` or `"weather"`.

**For `"title"` Widget:**
No extra properties needed. Displays the global `title` property with the RAF roundel alongside it.
```json
{ "type": "widget", "widgetType": "title" }
```

**For `"time"` Widget:**
No extra properties needed. Shows the current system time and date.
```json
{ "type": "widget", "widgetType": "time" }
```

**For `"search"` Widget:**
No extra properties needed. Displays a Google Search bar that opens queries in a new tab, complete with live auto-suggestions.
```json
{ "type": "widget", "widgetType": "search" }
```

**For `"weather"` Widget:**
Fetches live data from Open-Meteo.
- `locationName` (string): The label displayed for the location.
- `latitude` (number): Latitude of the location.
- `longitude` (number): Longitude of the location.
```json
{
  "type": "widget",
  "widgetType": "weather",
  "locationName": "Poulton-le-Fylde",
  "latitude": 53.847,
  "longitude": -2.992
}
```
