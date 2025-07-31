export type Region = 'north' | 'south';

/*
Example ApiResponse:
{
    "name": "Anchovy",
    "url": "https://nookipedia.com/wiki/Anchovy%20%28fish%29",
    "number": 56,
    "image_url": "https://dodo.ac/np/images/7/7f/Anchovy_%28Fish%29_NH_Icon.png",
    "render_url": "https://dodo.ac/np/images/1/19/Anchovy_%28Fish%29_NH.png",
    "location": "Sea",
    "shadow_size": "Small",
    "shadow_movement": "Medium",
    "rarity": "Uncommon",
    "total_catch": 0,
    "sell_nook": 200,
    "sell_cj": 300,
    "tank_width": 1,
    "tank_length": 1,
    "catchphrases": [
      "I caught an anchovy! Stay away from my pizza!"
    ],
    "north": {
      "availability_array": [
        {
          "months": "All year",
          "time": "4 AM – 9 PM"
        }
      ],
      "times_by_month": {
        "1": "4 AM – 9 PM",
        "2": "4 AM – 9 PM",
        "3": "4 AM – 9 PM",
        "4": "4 AM – 9 PM",
        "5": "4 AM – 9 PM",
        "6": "4 AM – 9 PM",
        "7": "4 AM – 9 PM",
        "8": "4 AM – 9 PM",
        "9": "4 AM – 9 PM",
        "10": "4 AM – 9 PM",
        "11": "4 AM – 9 PM",
        "12": "4 AM – 9 PM"
      },
      "months": "All year",
      "months_array": [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12
      ]
    },
    "south": {
      "availability_array": [
        {
          "months": "All year",
          "time": "4 AM – 9 PM"
        }
      ],
      "times_by_month": {
        "1": "4 AM – 9 PM",
        "2": "4 AM – 9 PM",
        "3": "4 AM – 9 PM",
        "4": "4 AM – 9 PM",
        "5": "4 AM – 9 PM",
        "6": "4 AM – 9 PM",
        "7": "4 AM – 9 PM",
        "8": "4 AM – 9 PM",
        "9": "4 AM – 9 PM",
        "10": "4 AM – 9 PM",
        "11": "4 AM – 9 PM",
        "12": "4 AM – 9 PM"
      },
      "months": "All year",
      "months_array": [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12
      ]
    }
  }
*/
export type ApiData = {
  response: ApiResponse[] | null | undefined;
  error: string;
  loading: boolean;
}

export type ApiResponse = {
  name: string;
  url: string;
  number: number;
  image_url: string;
  render_url: string;
  location: string;
  north: RegionResponse;
  south: RegionResponse;
}

export type RegionResponse = {
  availability_array: {
    months: string;
    time: string;
  }[];
  times_by_month: Record<string, string>;
  months: string;
  months_array: number[];
}