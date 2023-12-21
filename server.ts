import { app } from "./app";
import { connectDB } from "./config/db";
import { port } from "./secret/secret";

app.listen(port,async () => {
    console.log(`server is running on http://localhost:${port}`);

    await connectDB();
})