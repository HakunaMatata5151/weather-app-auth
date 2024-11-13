// noinspection DuplicatedCode

export class CallError extends Error {
  public Response: Response;
  public Method: string;
  public Url: string;
  public Params: object | null;
  public Result: object | null;

  constructor(
    response: Response,
    method: string,
    url: string,
    params: object | null,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    result: any | null
  ) {
    const err = `[${response.status}] ${method} ${url} <${JSON.stringify(
      params
    )}> => ${result}`;

    super(err);

    this.Response = response;
    this.Method = method;
    this.Url = url;
    this.Params = params;
    this.Result = result;
  }
}

export function Call<T = void>(
  uri: string,
  data: object | null = null,
  args: object | null = null,
  header: object | null = null,
  method: string = "POST",
  expected_return_code: number | Array<number> = [
    200, 201, 204, 202, 409, 403, 400,
  ]
): Promise<T> {
  const headers = new Headers();

  if (header) {
    for (const [header_key, header_val] of Object.entries(header)) {
      headers.append(header_key, String(header_val));
    }
  }

  let target_url = uri;
  if (args) {
    const buffer = [];
    for (const [args_key, args_val] of Object.entries(args)) {
      if (Array.isArray(args_val)) {
        for (let i = 0; i < args_val.length; i++) {
          const key = encodeURIComponent(`${args_key}[${i}]`);
          buffer.push(`${key}=${encodeURIComponent(String(args_val[i]))}`);
        }
      } else {
        buffer.push(
          `${encodeURIComponent(args_key)}=${encodeURIComponent(
            String(args_val)
          )}`
        );
      }
    }

    target_url += "?" + buffer.join("&");
  }

  const body = JSON.stringify(data);

  const expected_code_target = Array.isArray(expected_return_code)
    ? expected_return_code
    : [expected_return_code];

  if (method == "GET") {
    return fetch(target_url, {
      method: method,
      headers: headers,
      redirect: "follow",
    }).then(async (response) => {
      if (!expected_code_target.includes(response.status)) {
        throw new CallError(response, method, target_url, data, null);
      }
      const result = await response.json();
      return result;
    });
  } else {
    return fetch(target_url, {
      method: method,
      headers: headers,
      body: body,
      redirect: "follow",
    }).then(async (response) => {
      if (!expected_code_target.includes(response.status)) {
        throw new CallError(response, method, target_url, data, null);
      }
      const result = await response.json();
      return result;
    });
  }
}

const GeoAPIKey = import.meta.env.VITE_GEPAPIFY_KEY;
const WeatherAPIKey = import.meta.env.VITE_WEATHER_KEY;

export async function GetReverseGeoCoding(long: number, lat: number) {
  return Call<{
    features: any;
    query: any;
  }>(
    `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${long}&apiKey=${GeoAPIKey}`,
    null,
    null,
    null,
    "GET"
  );
}

export async function Get5dayForcast(location: string) {
  return Call<{
    error: any;
    location: any;
    current: any;
    forecast: any;
  }>(
    `http://api.weatherapi.com/v1/forecast.json?key=${WeatherAPIKey}&q=${location}&days=5&aqi=no&alerts=no`,
    null,
    null,
    null,
    "GET"
  );
}
