import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import { createApp } from "vue";
import App from "./App.vue";
import "./assets/main.css";
import router from "./router";
import { appPlugin } from "./utils/AppPlugin";

const app = createApp(App);

app.use(router);
app.use(ElementPlus);
app.use(appPlugin);

app.mount("#app");
