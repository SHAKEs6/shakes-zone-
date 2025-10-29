(async () => {
  try {
    const dotenv = await import('dotenv');
    dotenv.config();

    const mod = await import('./config/db.js');
    const connectDB = mod.default || mod.connectDB || mod;

    await connectDB();
    console.log("✅ Test finished — DB connected OK.");
    process.exit(0);
  } catch (err) {
    console.error("❌ test-db.js error:");
    console.error(err && err.stack ? err.stack : err);
    process.exit(1);
  }
})();
