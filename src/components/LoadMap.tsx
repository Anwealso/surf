import fs from "fs";
import Ramp, { CrossSection, TwistAxis } from "./ramps/Ramp";
import Box from "./Box";
import WorldBox from "./WorldBox";

export function loadMap(filename: string) {
  // Open the file from disk...
  const text: string = fs.readFile(filename, (err: any, data: any) => {
    if (err) {
      Error("Error: Map file not found or could not be opened.");
    } else {
      return data;
    }
  });

  // Parse the map file
  let map_components: JSX.Element[];
  try {
    map_components = parseMap(text);
  } catch (e) {
    throw Error("Error: Invalid map file");
  }

  // Return all the map jsx objects
  return map_components;
}

export function parseMap(text: string) {
  const json: any = JSON.parse(text);

  const entities: JSX.Element[] = [];
  json["map_entities"].map((entity: any) => {
    switch (entity["type"]) {
      case "WorldBox":
        entities.push(
          <WorldBox position={entity["position"]} dims={entity["dims"]} />
        );
        break;

      case "Box":
        entities.push(
          <Box
            position={entity["position"]}
            rotation={entity["rotation"]}
            args={entity["args"]}
          />
        );
        break;

      case "Ramp": {
        let twistAxis: TwistAxis;
        switch (entity["twist"]["axis"]) {
          case "x":
            twistAxis = TwistAxis.x;
            break;
          case "y":
            twistAxis = TwistAxis.y;
            break;
          default:
            throw Error("Error: Invalid ramp twist");
        }
        let crossSection: CrossSection;
        switch (entity["crossSection"]) {
          case "PerfectTriangle":
            crossSection = CrossSection.PerfectTriangle;
            break;
          case "FlatSideTriangle":
            crossSection = CrossSection.FlatSideTriangle;
            break;
          case "FlatTopTriangle":
            crossSection = CrossSection.FlatTopTriangle;
            break;
          default:
            throw Error("Error: Invalid ramp cross section");
        }
        entities.push(
          <Ramp
            position={entity["position"]}
            rotation={entity["rotation"]}
            twist={{
              axis: twistAxis,
              w: entity["twist"]["w"],
              v: entity["twist"]["v"],
            }}
            crossSection={crossSection}
            segmentLegth={entity["segmentLegth"]}
          />
        );
      }
    }
  });

  return entities;
}

export const map_json: string = `{
  "player": {
    "position": [0, 5, -5],
    "rotation": [0, 0, 0]
  },
  "map_entities": [
    {
      "type": "Ramp",
      "position": [-40, 0, 17],
      "rotation": [0, -1.571, 0],
      "twist": { "axis": "x", "w": 0, "v": 80 },
      "crossSection": "PerfectTriangle",
      "segmentLegth": 10
    },
    {
      "type": "WorldBox",
      "position": [0, 20, 20],
      "dims": [200, 80, 190]
    },
    {
      "type": "Box",
      "position": [0, 0, 5],
      "rotation": [-1.571, 0, 0],
      "args": [200, 30, 1]
    },
    {
      "type": "Ramp",
      "position": [0, -20, -10],
      "rotation": [-1.047, 0, 0],
      "twist": { "axis": "x", "w": 1.366, "v": 90 },
      "crossSection": "PerfectTriangle",
      "segmentLegth": 10
    },
    {
      "type": "Ramp",
      "position": [0, -50, -100],
      "rotation": [-0.196, 0, 0],
      "twist": { "axis": "x", "w": 0.392, "v": 40 },
      "crossSection": "PerfectTriangle",
      "segmentLegth": 10
    },
    {
      "type": "Box",
      "position": [0, -45, -165],
      "rotation": [-1.571, 0, 0],
      "args": [200, 20, 1]
    }
  ]
}`;
