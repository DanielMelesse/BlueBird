export class MapsService {
  async geocode(query: string) {
    return { query, lat: 9.03, lng: 38.74 };
  }
}
