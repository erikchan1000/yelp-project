importScripts('https://www.gstatic.com/firebasejs/9.9.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.9.0/firebase-messaging-compat.js');

const firebaseConfig = {
    apiKey: "AIzaSyA9YHhGf_mrToG3ltlLQPWW2PkymmkI58s",
    authDomain: "yelp-testing-fc2be.firebaseapp.com",
    projectId: "yelp-testing-fc2be",
    storageBucket: "yelp-testing-fc2be.appspot.com",
    messagingSenderId: "785577067867",
    appId: "1:785577067867:web:afa660dcbb41559138867e"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging()

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload)
  const notificationTitle = payload.notification.title
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon || payload.notification.image,
  }

  self.registration.showNotification(notificationTitle, notificationOptions)
  setShow(true);
  setNotification({
    title: payload.notification.title,
    body: payload.notification.body,
  });
})

self.addEventListener('notificationclick', (event) => {
  if (event.action) {
    clients.openWindow(event.action)
  }
  event.notification.close()
})