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

  const res = await fetch(url, fetchOptions);
  if (res.status >= 400) {
    console.debug('Failed request\'s response:', res);
    throw new Error(res.status + ': ' + res.statusText);
  }
  if (res.status !== 204) {
    return res.json();
  }
};