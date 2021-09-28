// TODO: type properly
export const fetcher = async (url: string, body?: any) => {
  const options: RequestInit = body ? {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(body)
  } : {};

  const res = await fetch(url, options);
  return res.json();
};