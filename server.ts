import { app } from "./app";
import { connectDB } from "./config/db";
import { cloud_api_key, cloud_api_secret, cloud_name, port } from "./secret/secret";
import cloudinary from "cloudinary";

cloudinary.v2.config({
    cloud_name: cloud_name,
    api_key: cloud_api_key,
    api_secret: cloud_api_secret
})

app.listen(port,async () => {
    console.log(`server is running on http://localhost:${port}`);

    await connectDB();
})