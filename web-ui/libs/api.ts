let BASE_URL = '';
if (typeof window !== 'undefined') {
  BASE_URL = window.standalone?.baseUrl ?? window.location.origin;
  console.debug(`Setting base URL to ${BASE_URL}`);
}

// TODO: use Axios?
export const fetcher = async (
  url: string,
  body?: any,
  options: Partial<RequestInit> = {}) => {
  const fetchOptions: RequestInit = body ? {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(body),
    ...options
  } : options;

  const res = await fetch(new URL(url, BASE_URL).toString(), fetchOptions);
  if (res.status >= 400) {
    console.debug('Failed request\'s response:', res);
    throw new Error(res.status + ': ' + res.statusText);
  }
  if (res.status !== 204) {
    return res.json();
  }
};