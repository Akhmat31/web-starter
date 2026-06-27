const mysql = require("mysql2/promise");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

dotenv.config();

const conn = mysql.createPool({
    host: process.env.D_HOST,
    user: process.env.D_USER,
    password: process.env.D_PASS,
    database: process.env.D_DB,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    multipleStatements: true,
});

function checksum(sql) {
    return crypto.createHash("sha256").update(sql).digest("hex");
}

async function ensureMigrationTable(connection) {
    await connection.query(`
        CREATE TABLE IF NOT EXISTS _prisma_migrations (
            id VARCHAR(36) PRIMARY KEY,
            checksum VARCHAR(64) NOT NULL,
            migration_name VARCHAR(255) NOT NULL UNIQUE,
            started_at DATETIME(3) NOT NULL,
            finished_at DATETIME(3) NULL,
            applied_steps_count INT NOT NULL DEFAULT 0
        )
    `);
}

async function run() {
    const connection = await conn.getConnection();

    try {
        await ensureMigrationTable(connection);

        const migrationsDir = path.join(
            __dirname,
            "..",
            "..",
            "..",
            "prisma",
            "migrations"
        );

        const entries = fs
            .readdirSync(migrationsDir)
            .filter((e) => e !== "migration_lock.toml")
            .sort();

        const [rows] = await connection.query(
            "SELECT migration_name FROM _prisma_migrations"
        );

        const applied = new Set(rows.map((r) => r.migration_name));

        for (const entry of entries) {
            if (applied.has(entry)) {
                console.log(`✓ Skip ${entry}`);
                continue;
            }

            const sqlPath = path.join(migrationsDir, entry, "migration.sql");

            if (!fs.existsSync(sqlPath)) {
                continue;
            }

            const sql = fs.readFileSync(sqlPath, "utf8");

            const id = crypto.randomUUID();
            const startedAt = new Date();

            await connection.beginTransaction();

            try {
                await connection.query(
                    `
                    INSERT INTO _prisma_migrations
                    (
                        id,
                        checksum,
                        migration_name,
                        started_at,
                        applied_steps_count
                    )
                    VALUES (?, ?, ?, ?, 0)
                    `,
                    [
                        id,
                        checksum(sql),
                        entry,
                        startedAt,
                    ]
                );

                await connection.query(sql);

                await connection.query(
                    `
                    UPDATE _prisma_migrations
                    SET
                        finished_at = ?,
                        applied_steps_count = 1
                    WHERE id = ?
                    `,
                    [new Date(), id]
                );

                await connection.commit();

                console.log(`✓ Applied ${entry}`);
            } catch (err) {
                await connection.rollback();
                throw err;
            }
        }

        console.log("✔ All migrations completed.");
    } finally {
        connection.release();
        await conn.end();
    }
}

run().catch((err) => {
    console.error(err);
    process.exit(1);
});