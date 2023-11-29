export async function requestEsp(url: string, method: 'GET' | 'POST') {
  const espAddress = process.env.ESP32_ADDRESS;
  const espUsername = process.env.ESP32_USERNAME;
  const espPassword = process.env.ESP32_PASSWORD;
  const basicAuth =
    'Basic ' + Buffer.from(`${espUsername}:${espPassword}`).toString('base64');
  return fetch(`${espAddress}${url}`, {
    method,
    headers: {
      Authorization: basicAuth,
    },
  });
}
