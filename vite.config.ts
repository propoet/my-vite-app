import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
// import path from "path";
import { fileURLToPath } from "url";
// import viteCompression from "vite-plugin-compression";
import autoImport from "unplugin-auto-import/vite";
// import legacy from "@vitejs/plugin-legacy";
import Components from "unplugin-vue-components/vite";
// import Inspect from "vite-plugin-inspect";
// import importToCDN from "vite-plugin-cdn-import";
import { visualizer } from "rollup-plugin-visualizer";
// https://vite.dev/config/
export default defineConfig(({ mode, command }) => {
  // command 表示运行命令：serve 或 build
  // mode表示当前模式
  console.log(mode, command);
  // console.log(path.resolve(__dirname, "src"));
  console.log(fileURLToPath(new URL("./src", import.meta.url)));
  return {
    base: "/my-vite-app/", //指定打包后资源引用的“公共路径”,若部署到子路径 /my-vite-app/ 则需要配置为 /my-vite-app/
    // root: path.resolve(__dirname, ""), //项目根目录
    plugins: [
      vue(),
      // CDN 导入插件：将指定依赖替换为 CDN 链接（仅在构建时生效）
      // importToCDN({
      //   modules: [
      //     {
      //       name: "vue",
      //       var: "Vue", // Vue 3 CDN 的全局变量名
      //       path: "https://unpkg.com/vue@3.4.0/dist/vue.global.prod.js",
      //     },
      //   ],
      // }),
      // Vite 插件检查工具（开发环境使用） 检查和分析 Vite 的构建过程
      // Inspect(),
      // 生成兼容性代码
      // legacy({
      //   targets: ["defaults", "not IE 11"],
      // }),
      // Gzip 压缩插件
      // viteCompression({
      //   algorithm: "gzip", // 压缩算法，可选 'gzip' | 'brotliCompress' | 'deflate' | 'deflateRaw'
      //   ext: ".gz", // 压缩后的文件扩展名
      //   threshold: 1024, // 只有大小大于该值的文件才会被压缩，单位：字节，默认 1024
      //   deleteOriginFile: false, // 是否删除原文件，默认 false
      //   verbose: true, // 是否在控制台输出压缩结果，默认 true
      //   disable: false, // 是否禁用压缩，默认 false
      //   // 压缩文件类型，默认 ['js', 'css']
      //   filter: /\.(js|mjs|json|css|html)$/i,
      // }),
      autoImport({
        imports: ["vue", "vue-router", "pinia"],
        dts: "src/types/auto-imports.d.ts",
        dirs: ["src/composables/**/*.{ts,tsx,js,jsx,mjs,mts}"],
      }),
      Components({
        dirs: ["src/components"],
        extensions: ["vue"],
        dts: "src/types/components.d.ts",
      }),
      // 依赖分析与可视化
      visualizer({
        open: true, // 打包完成后自动打开分析页面
        gzipSize: true,
        brotliSize: true,
      }),
    ],
    resolve: {
      alias: {
        // "@": path.resolve(__dirname, "src"),
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
      // 用于指定 Vite 在解析模块时尝试的文件扩展名列表。如果未指定文件扩展名，Vite 会按 extensions 的顺序依次尝试解析
      extensions: [
        ".mjs",
        ".mts",
        ".js",
        ".ts",
        ".jsx",
        ".tsx",
        ".json",
        ".vue",
      ],
    },
    server: {
      port: 3000,
      proxy: {
        "/api": {
          target: "http://localhost:4000",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },

    // css: {
    //   //配置 CSS Modules 的类名导出格式
    //   // camelCase 模式下，类名会自动转换
    //   // .container → container
    //   // .main-title → mainTitle
    //   modules: {
    //     localsConvention: "camelCase",
    //   },
    //   // 在每个 SCSS 文件前自动注入代码 ,用途：全局引入变量、混入等，无需在每个文件手动导入
    //   preprocessorOptions: {
    //     scss: {
    //       additionalData: `@import "@/styles/variables.scss";`,
    //     },
    //   },
    //   // 指定 PostCSS 配置文件路径
    //   postcss: "./postcss.config.js",
    // },

    /**
     * 依赖预构建配置
     * 将 CommonJS/UMD 依赖转换为 ESM
     * 合并多个小文件，减少 HTTP 请求
     * 提升开发服务器启动速度
     * 缓存预构建结果，加快后续启动
     * 首次启动：Vite 预构建 include 中的依赖
     * 缓存结果：预构建结果保存在 node_modules/.vite
     * 后续启动：直接使用缓存，加快启动速度
     */
    // optimizeDeps: {
    //   // 强制预构建的依赖（确保这些包被预构建）
    //   // 不设置 include 和 exclude，Vite 会自动检测
    //   // 大多数情况下不需要手动配置
    //   include: ["vue", "vue-router", "pinia"],
    //   // 排除预构建的依赖（如果需要排除某些包，在这里配置）
    //   // exclude: ["某个不需要预构建的包"],
    // },

    // json: {
    //   stringify: true, // 导入时直接转为字符串
    // },
    // assetsInclude: [
    //   "**/*.gltf",
    //   "**/*.glb",
    //   "**/*.obj",
    //   "**/*.fbx",
    //   "**/*.hdr",
    // ], // 支持额外资源类型  将指定文件类型作为静态资源处理 .gltf 是 3D 模型文件格式
    // worker: {
    //   // 输出格式：'es' | 'iife'
    //   format: "es", // ES 模块格式（推荐）
    //   plugins: [
    //     // 可以在这里添加 Worker 专用的插件
    //     // vue(),  // 如果 Worker 中需要使用 Vue
    //   ],
    // },
    build: {
      outDir: "dist", // 指定构建输出目录
      assetsDir: "assets1", // 指定静态资源（JS、CSS、图片等）的输出子目录
      sourcemap: false, // 是否生成 sourcemap
      minify: "esbuild", // 压缩方式（esbuild / terser）  esbuild：构建快，适合大多数场景,terser：压缩更好，适合对体积敏感的项目
      /**
       * 推荐启用（cssCodeSplit: true）的场景：
       * 多页面应用（MPA）
       * 大型单页应用（SPA）使用路由懒加载
       * 需要优化首屏加载速度
       * 不同页面样式差异较大
       * 推荐禁用（cssCodeSplit: false）的场景：
       * 小型单页应用
       * 所有页面样式都需要同时加载
       * 需要减少 HTTP 请求数量
       * CSS 文件总体积较小（< 50KB）
       */
      cssCodeSplit: true, // 是否启用 CSS 代码分割
      chunkSizeWarningLimit: 2000, // 文件体积警告阈值（KB）设置 chunk 文件大小警告阈值（KB） 超过此大小的 chunk 会在构建时显示警告
      rollupOptions: {
        input: "./index.html", //指定入口文件,多页面应用时可配置多个入口
        // 排除外部依赖，不打包到 bundle 中（配合 CDN 使用）
        output: {
          // 全局变量映射：告诉 Rollup 如何访问外部依赖

          //手动配置代码分割，将指定库打包到独立 chunk
          /**
           * 缓存优化：框架代码变化少，可长期缓存
           * 并行加载：浏览器可并行下载多个 chunk
           * 按需加载：可延迟加载非关键代码
           * 体积控制：便于识别和优化大文件
           */
          manualChunks: {
            vue: ["vue"], //将vue 打包到独立的chunk
            // vendor: ["axios", "dayjs"], // 第三方库打包到一起
          },
        },
      },
    },
  };
});
