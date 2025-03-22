import Elysia, { t } from "elysia";
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { urlTable } from "./database/schema";
import { eq, sql } from "drizzle-orm";

const db = drizzle(process.env.DATABASE_URL!)

const validURL = (str: string): boolean => {
    let url;
    try {
        url = new URL(str)
    } catch (_) {
        return false;
    }
    return url.protocol === 'http:' || url.protocol === 'https:';
}

const generate = (url: string): string => {
    return Math.random().toString(36).substring(2, 8);
}
export const url = new Elysia({ prefix: '/tanshi' })
    .post('/', async ({ body: { url }, error }) => {
        if (!validURL(url)) {
            return error(400, {
                success: false,
                message: "Invalid body"
            })
        }
        let data = {
            url,
            shortCode: generate(url)
        }
        const result = await db.insert(urlTable).values(data).returning();
        return {
            success: true,
            data: result[0]
        }
    }, {
        body: t.Object({
            url: t.String()
        })
    })
    .get('/:code', async ({ params: { code }, error }) => {
        const res = await db.update(urlTable).set({ accessCount: sql`${urlTable.accessCount} + 1` }).where(eq(urlTable.shortCode, code)).returning();
        if (res.length === 0) {
            return error(404, {
                success: false,
                message: 'ShortCode not found'
            });
        }
        return {
            success: true,
            data: res[0]
        }
    }, {
        params: t.Object({
            code: t.String()
        })
    })
    .put('/:code', async ({ params: { code }, body: { url }, error }) => {
        const res = await db.update(urlTable).set({ url: url }).where(eq(urlTable.shortCode, code)).returning()
        if (res.length === 0) {
            return error(404, {
                success: false,
                message: "url not there"
            })
        }
        return {
            success: true,
            data: res[0]
        }
    }, {
        params: t.Object({
            code: t.String()
        }),
        body: t.Object({
            url: t.String()
        })
    })
    .delete('/:code', async ({ params: { code }, error }) => {
        const res = await db.delete(urlTable).where(eq(urlTable.shortCode, code)).returning()
        if (res.length === 0) {
            return error(404, {
                success: false,
                message: 'no such url exists'
            })
        }

        return {
            success: true,
            data: res[0]
        }
    })
    .get('/:code/stats', async ({ params: { code }, error }) => {
        const res = await db.select().from(urlTable).where(eq(urlTable.shortCode, code))
        if (res.length === 0) {
            return error(404, {
                success: false,
                message: 'no such user exists'
            })
        }
        return {
            success: true,
            data: res[0]
        }
    })
