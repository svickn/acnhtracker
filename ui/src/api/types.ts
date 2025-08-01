export type Region = 'north' | 'south';
export type ItemType = 'fish' | 'bug' | 'sea-creature';

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