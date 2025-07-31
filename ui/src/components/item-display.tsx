import { Typography } from "@mui/material"

import { useBugData, useFishData, useSeaCreatureData } from "../api"
import type { ApiResponse } from "../api/types"
import { CollectionDisplay } from "./collection-display"

export function ItemDisplay({item}: {item: ApiResponse}) {
  // display the item name, image, and location
  // use material ui components
  return <div>
    <Typography variant="h6">{item.name}</Typography>
    <img src={item.image_url} alt={item.name} />
    <Typography variant="body1">{item.location}</Typography>
  </div>
}

export function FishDisplay() {
  return <CollectionDisplay name="Fish" hook={useFishData} />
}

export function BugDisplay() {
  return <CollectionDisplay name="Bug" hook={useBugData} />
}

export function SeaCreatureDisplay() {
  return <CollectionDisplay name="Sea Creature" hook={useSeaCreatureData} />
}