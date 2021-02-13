require("dotenv").config();
const express = require("express");
const app = express();
const puppeteer = require("puppeteer");
const PORT = process.env.PORT || 3001;
const cors = require("cors");
const admin = require("firebase-admin");
const config = require("./src/constants/firebaseService");
const cloudinary = require("cloudinary");
const vibrant = require("node-vibrant");
const fs = require("fs");

app.use(cors());
app.use(express.json());

admin.apps.length === 0 &&
  admin.initializeApp({
    credential: admin.credential.cert(config),
  });

const db = admin.firestore();

cloudinary.v2.config({
  cloud_name: "suraj-gov-cloudinary",
  api_key: "595953576716982",
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.get("/", (req, res) => {
  res.json({ status: "woke up" });
});

app.get("/generate-screenshot", async (req, res) => {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const { pageUrl, userId } = req.body;
  if (pageUrl && userId) {
    const existingUser = await db
      .collection("users")
      .where("uid", "==", userId)
      .get();
    if (!existingUser.empty) {
      const page = await browser.newPage();
      try {
        await page.goto(pageUrl, {
          waitUntil: "networkidle2",
        });
      } catch (err) {
        res.send({ status: "error", message: err.message });
        return;
      }
      const filename = userId.concat(Math.random().toString()) + ".jpg";
      const pathForImage = process.cwd() + "/screenshots";
      !fs.existsSync(pathForImage) && fs.mkdirSync(pathForImage);
      const pageTitle = await page.title();
      await page.screenshot({
        path: `${pathForImage + "/" + filename}`,
        quality: 50,
        type: "jpeg",
      });
      let color;
      vibrant
        .from(pathForImage + "/" + filename)
        .getPalette((error, palette) => {
          color = palette.LightVibrant;
        });
      let imageURL = "";
      await cloudinary.v2.uploader.upload(
        pathForImage + "/" + filename,
        {
          folder:
            process.env.NODE_ENV === "production"
              ? "web-mark-prod"
              : "web-mark-test",
          public_id: `${userId.concat(Math.random().toString())}`,
          overwrite: true,
        },
        (error, result) => {
          if (error) {
            res.json({ status: "error", message: "error.message" });
            return;
          }
          imageURL = result.secure_url;
        }
      );
      if (imageURL !== "" || color) {
        fs.unlink(pathForImage + "/" + filename, () => {});
        const result = {
          status: "success",
          pageTitle,
          imageURL,
          color,
          url: pageUrl,
          timestamp: admin.database.ServerValue.TIMESTAMP,
        };
        res.json(result);
      }
    }
  } else res.json({ status: "error", message: "wrong params" });
});

app.listen(PORT, () => {
  console.log("started at port " + PORT);
});
