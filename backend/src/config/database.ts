import prisma from "../lib/prisma";

export const connectDatabase = async (): Promise<void> => {
  try {
    await prisma.$connect();
    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
};

export const setupGracefulShutdown = (): void => {
  const gracefulShutdown = async (signal: string) => {
    console.log(`\n🔄 Received ${signal}. Shutting down gracefully...`);
    try {
      await prisma.$disconnect();
      console.log("✅ Database disconnected successfully");
      process.exit(0);
    } catch (error) {
      console.error("❌ Error during shutdown:", error);
      process.exit(1);
    }
  };

  process.on("SIGINT", () => gracefulShutdown("SIGINT"));
  process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
};
