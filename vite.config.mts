import { CommonFields } from "./src/types/interface";
import path from "path";
import { defineConfig, loadEnv } from "vite";
import zaloMiniApp from "zmp-vite-plugin";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import svgr from "vite-plugin-svgr";

export default ({ mode }: CommonFields) => {
	// ⛳ Load the correct .env.* file
	const env = loadEnv(mode, process.cwd());

	console.log("🔧 Mode:", mode);
	console.log("🌐 VITE_API_URL:", env.VITE_API_URL);
	console.log("🌐 env:", env);
	return defineConfig({
		root: "./src",
		base: "",
		plugins: [zaloMiniApp(), react(), tsconfigPaths(), svgr()],
		resolve: {
			alias: {
				"@": path.resolve(__dirname, "./src"),
				public: `${path.resolve(__dirname, "./public")}`,
				components: `${path.resolve(__dirname, "./src/components/")}`,
				helpers: path.resolve(__dirname, "./src/helpers"),
				pages: path.resolve(__dirname, "./src/pages"),
				services: `${path.resolve(__dirname, "./src/services")}`,
				assets: `${path.resolve(__dirname, "./src/assets/")}`,
				types: `${path.resolve(__dirname, "./src/types/")}`,
			},
		},
		define: {
			// Optional: expose env to app if needed
			__APP_ENV__: JSON.stringify(env.VITE_ENV),
		},
	});
};
