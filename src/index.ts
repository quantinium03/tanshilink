import { Elysia } from "elysia";
import { url } from "./url";
import swagger from "@elysiajs/swagger";

const app = new Elysia()
    .use(swagger())
    .use(url)
    .listen(3000);

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
