const {contextBridge} = require('electron');

const port = process.argv
  .find(it => it.startsWith('--backendPort'))
  ?.split('=')?.[1];

contextBridge.exposeInMainWorld('standalone', {
  baseUrl: `http://localhost:${port}`
});