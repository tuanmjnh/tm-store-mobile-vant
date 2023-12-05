// Client ID and API key from the Developer Console
var CLIENT_ID = '235324461758-n9qs0f3kec5e8q8t2almq6edn0cjh704.apps.googleusercontent.com'
var API_KEY = 'AIzaSyC-ysFtHg8WdeTMtndJEOx8LaFnm0CWUmk'

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ['https://sheets.googleapis.com/$discovery/rest?version=v4', 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest']

// Authorization scopes required by the API multiple scopes can be
// included, separated by spaces.
var SCOPES = 'https://www.googleapis.com/auth/drive'//'https://www.googleapis.com/auth/drive.metadata.readonly'//'https://www.googleapis.com/auth/spreadsheets.readonly'

export let tokenClient;
export let gapiInited = false;
export let gisInited = false;

/**
    * Callback after api.js is loaded.
    */
async function gapiLoaded() {
  // console.log('gapiLoaded')
  await gapi.load('client', initializeGapiClient);
}

/**
 * Callback after the API client is loaded. Loads the
 * discovery doc to initialize the API.
 */
async function initializeGapiClient() {
  await gapi.client.init({
    apiKey: API_KEY,
    discoveryDocs: DISCOVERY_DOCS,
  });
  gapiInited = true;
  // console.log(gapi)
  // console.log(window.gapi)
  // maybeEnableButtons();
}

/**
* Callback after Google Identity Services are loaded.
*/
async function gisLoaded() {
  // console.log('gisLoaded')
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: '', // defined later
  });
  gisInited = true;
  // maybeEnableButtons();
}

// gapiScript
const gapiScript = document.createElement('script')
gapiScript.async = true
gapiScript.defer = true
// gapiScript.src = 'https://apis.google.com/js/api.js?onload=gapiLoaded'
// window.gapiLoaded = function gapiLoaded() {
//   console.log('gapiLoaded')
//   // handleClientLoad()
// }
gapiScript.src = 'https://apis.google.com/js/api.js'
document.head.appendChild(gapiScript)
// gapiScript.onload = () => {
//   gapiLoaded()
// }

const gsiScript = document.createElement('script')
gsiScript.async = true
gsiScript.defer = true
// gsiScript.src = 'https://accounts.google.com/gsi/client?onload=gisLoaded'
// window.gisLoaded = function gisLoaded() {
//   // handleClientLoad()
//   console.log('gisLoaded')
// }
gsiScript.src = 'https://accounts.google.com/gsi/client'
document.head.appendChild(gsiScript)
// gsiScript.onload = () => {
//   gisLoaded()
// }

// document.getElementById('authorize_button').style.visibility = 'hidden';
// document.getElementById('signout_button').style.visibility = 'hidden';

/**
       * Enables user interaction after all libraries are loaded.
       */
function maybeEnableButtons() {
  if (gapiInited && gisInited) {
    document.getElementById('authorize_button').style.visibility = 'visible';
  }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick() {
  tokenClient.callback = async (resp) => {
    if (resp.error !== undefined) {
      throw (resp);
    }
    document.getElementById('signout_button').style.visibility = 'visible';
    document.getElementById('authorize_button').innerText = 'Refresh';
    await listFiles();
  };

  if (gapi.client.getToken() === null) {
    // Prompt the user to select a Google Account and ask for consent to share their data
    // when establishing a new session.
    tokenClient.requestAccessToken({ prompt: 'consent' });
  } else {
    // Skip display of account chooser and consent dialog for an existing session.
    tokenClient.requestAccessToken({ prompt: '' });
  }
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick() {
  const token = gapi.client.getToken();
  if (token !== null) {
    google.accounts.oauth2.revoke(token.access_token);
    gapi.client.setToken('');
    document.getElementById('content').innerText = '';
    document.getElementById('authorize_button').innerText = 'Authorize';
    document.getElementById('signout_button').style.visibility = 'hidden';
  }
}

/**
 * Print metadata for first 10 files.
 */
async function listFiles() {
  let response;
  try {
    response = await gapi.client.drive.files.list({
      'pageSize': 10,
      'fields': 'files(id, name)',
    });
  } catch (err) {
    document.getElementById('content').innerText = err.message;
    return;
  }
  const files = response.result.files;
  if (!files || files.length == 0) {
    document.getElementById('content').innerText = 'No files found.';
    return;
  }
  // Flatten to string to display
  const output = files.reduce(
    (str, file) => `${str}${file.name} (${file.id})\n`,
    'Files:\n');
  document.getElementById('content').innerText = output;
}

export const GAPIInitialize = async () => {
  return new Promise((resolve, reject) => {
    gapiScript.onload = async () => {
      await gapiLoaded()
      resolve(gapi)
    }
    gsiScript.onload = async () => {
      await gisLoaded()
    }
    // console.log(gapi)
  })
}

// export default window.gapi
export default function () {
  return window.gapi
}

export const gapiInstance = () => {
  return window.gapi
}

export const googleInstance = () => {
  return window.google
}
