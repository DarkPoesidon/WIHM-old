import {
  bucket,
  defineRailway,
  group,
  postgres,
  preserve,
  project,
  ref,
  service,
} from "railway/iac";

export default defineRailway(() => {
  const db = postgres("postgres");
  const uploads = bucket("storage", {
    region: "ams",
  });

  const worker = service("WIHM-worker", {
    rootDirectory: "worker",
    region: "ams",
    build: {
      builder: "DOCKERFILE",
      dockerfilePath: "Dockerfile",
    },
    healthcheckPath: "/health",
    healthcheckTimeout: 100,
    env: {
      APP_ENV: "production",
      WORKER_PORT: "8080",
      WORKER_CONCURRENCY: "2",
      WEBHOOK_SECRET: preserve(),
      STORAGE_DRIVER: "remote",
      STORAGE_BUCKET: ref(uploads, "BUCKET"),
      STORAGE_ENDPOINT: ref(uploads, "ENDPOINT"),
      STORAGE_REGION: ref(uploads, "REGION"),
      STORAGE_ACCESS_KEY_ID: ref(uploads, "ACCESS_KEY_ID"),
      STORAGE_SECRET_ACCESS_KEY: ref(uploads, "SECRET_ACCESS_KEY"),
      STORAGE_FORCE_PATH_STYLE: "false",
    },
  });

  const app = service("WIHM-server", {
    region: "ams",
    build: {
      builder: "DOCKERFILE",
      dockerfilePath: "Dockerfile",
    },
    healthcheckPath: "/api/health",
    healthcheckTimeout: 100,
    env: {
      APP_ENV: "production",
      // "::" is dual-stack to support both IPv4 and IPv6.
      BIND_ADDRESS: "::",
      DB_CLIENT: "postgres",
      POSTGRES_URL: db.env.DATABASE_URL,
      POSTGRES_SSL: "false",
      STORAGE_PROCESSING_MODE: "remote",
      WORKER_URL: "http://${{WIHM-worker.RAILWAY_PRIVATE_DOMAIN}}:8080",
      WEBHOOK_SECRET: preserve(),
      STORAGE_DRIVER: "remote",
      STORAGE_AUTO_CORS: "true",
      STORAGE_BUCKET: ref(uploads, "BUCKET"),
      STORAGE_ENDPOINT: ref(uploads, "ENDPOINT"),
      STORAGE_REGION: ref(uploads, "REGION"),
      STORAGE_ACCESS_KEY_ID: ref(uploads, "ACCESS_KEY_ID"),
      STORAGE_SECRET_ACCESS_KEY: ref(uploads, "SECRET_ACCESS_KEY"),
      STORAGE_FORCE_PATH_STYLE: "false",
    },
  });

  const WIHMGroup = group("WIHM", [app, worker, db, uploads]);

  return project("WIHM", {
    resources: [WIHMGroup],
  });
});
