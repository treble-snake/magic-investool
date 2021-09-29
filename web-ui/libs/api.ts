// TODO: use Axios?
export const fetcher = async (url: string, body?: any) => {
  const options: RequestInit = body ? {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(body)
  } : {};

  const res = await fetch(url, options);
  if (res.status >= 400) {
    console.debug('Failed request\'s response:', res);
    throw new Error(res.status + ': ' + res.statusText);
  }
  if (res.status !== 204) {
    return res.json();
  }
};