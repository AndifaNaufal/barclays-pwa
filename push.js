var webPush = require('web-push');

const vapidKeys = {
   "publicKey": "BIOXilg6zfAh7XUdqZXoRUdqoCHLCCeMjREPZDRLmYLiAHkIDGVxkRCNtir5ZchkmtJJ8X7VNLXTUiY8jzwJnbs",
   "privateKey": "uzOFJiUdZoP_ZNy-TIsCFKZF-8PsduDy-dyouNTOUhk"
};


webPush.setVapidDetails(
   'mailto:example@yourdomain.org',
   vapidKeys.publicKey,
   vapidKeys.privateKey
)
var pushSubscription = {
   "endpoint": "https://fcm.googleapis.com/fcm/send/eX32twNJzdE:APA91bGR97VT-xdtHsxy1UXXtBprEC5_9zQ_gXVJ0Jr7KuDDHJsvx7mPr9r56Smfcx8bRgNyTn6OJ56MMbV2kYXfk-RrXsze9F1qH5XQYa6s60V6fXUUUpn8TI4xncRYEVerJ-AGWxTc",
   "keys": {
      "p256dh": "BGJ0OUwz9ucITgdx/IHk2ejoR6IinPTCbU/fif7/K6hcch/poyYlaE+0kEhpDz1c0zYcTNLMNRq/KdglPca9xrM=",
      "auth": " jXMjowDfG2tR5fwRJeaA1A=="
   }
};
var payload = 'Barclays Premier League Notif!';

var options = {
   gcmAPIKey: '532864112919',
   TTL: 60
};
webPush.sendNotification(
   pushSubscription,
   payload,
   options
).then((success) => {
   console.log(success)
})
   .catch((error) => {
      console.log(error)
   });