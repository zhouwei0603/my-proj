import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import { createApp } from "vue";
import App from "./App.vue";
import "./assets/main.css";
import router from "./router";
import { localePlugin } from "./utils/LocaleProvide";
import { notificationPlugin } from "./utils/NotificationProvide";

const app = createApp(App);

app.use(router);
app.use(ElementPlus);
app.use(localePlugin);
app.use(notificationPlugin);

app.mount("#app");
