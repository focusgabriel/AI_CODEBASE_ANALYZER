import multer from "multer";
import path from "node:path";
import { randomUUID } from "node:crypto";

import fs from "node:fs";

const uploadDirectory = "storage/uploads";

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

const storage = multer.diskStorage({
  destination(_req, _file, cb) {
    cb(null, "storage/uploads");
  },

  filename(_req, file, cb) {
    const extension = path.extname(file.originalname);

    cb(null, `${randomUUID()}${extension}`);
  },
});

export const upload = multer({
  storage,

  fileFilter(_req, file, cb) {
    if (!file.originalname.endsWith(".zip")) {
      return cb(new Error("Only zip files are allowed"));
    }

    cb(null, true);
  },

  limits: {
    fileSize: 100 * 1024 * 1024,
  },
});
