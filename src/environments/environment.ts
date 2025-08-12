// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  // firebase: {
    // apiKey: "AIzaSyDVzj-Chjfnquu3AUB9LD0UPhO-bKO4Muc",
    // authDomain: "sabuesos-ae49b.firebaseapp.com",
    // databaseURL: "https://sabuesos-ae49b-default-rtdb.firebaseio.com",
    // projectId: "sabuesos-ae49b",
    // storageBucket: "sabuesos-ae49b.appspot.com",
    // messagingSenderId: "909651562334",
    // appId: "1:909651562334:web:344024873fe646009109cf",
    // measurementId: "G-2XJ26GNCB3"
  // },
  production: false,
  api: "https://api.sabuesos.co/api/v1",
  // api: "http://localhost:3000/api/v1",
  //apiSocket: "http://localhost:3001",
  apiSocket: "https://api-socket.sabuesos.co",

  mapboxgl: {
    accessToken:
      'pk.eyJ1Ijoic2FidWVzb3MiLCJhIjoiY2w1bGRqNzN0MDd1dDNjbnZubXExazlpbiJ9.ZtYM8RAcA9LbBXeTMpmIKQ',
  },
  firebaseConfig: {
    apiKey: "AIzaSyBPVEQ0Co3kforblpXx3MyJ-qVlGc8ugaM",
    authDomain: "sabuesos-ae49b.firebaseapp.com",
    databaseURL: "https://sabuesos-ae49b-default-rtdb.firebaseio.com",
    projectId: "sabuesos-ae49b",
    storageBucket: "sabuesos-ae49b.appspot.com",
    messagingSenderId: "909651562334",
    appId: "1:909651562334:web:46ff7e071e8db22e9109cf",
    measurementId: "G-7NEJBEGED0"
  },
  onseSignal: {
    appId: '73f01442-2f41-4a6b-9ae8-92ed6c967534',
  },
  CHAT_KEY: '#J%%Tw5W7#delTa',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
