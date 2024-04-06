var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// plugins/nav-ganerator/index.js
var require_nav_ganerator = __commonJS({
  "plugins/nav-ganerator/index.js"(exports, module) {
    var slideGroupByHead = (pages) => {
      const menus = {};
      const groups = pages.reduce((acc, curr) => {
        const paths = curr.split("/");
        const menuGroup = paths[0] || curr;
        let list = acc[menuGroup] || [];
        if (curr.startsWith(menuGroup)) {
          list = [].concat(list, curr);
        }
        acc[menuGroup] = list;
        return acc;
      }, {});
      const formatterSubtext = (filename) => {
        const paths = filename.replace(/(\s|\$)/gi, "").split("/");
        if (paths.length > 2) {
          return paths.slice(2).join("-");
        }
        if (paths.length > 1) {
          return paths.slice(1);
        }
        return filename;
      };
      const formatterSubLink = (filename) => {
        return "/" + filename.replace(".md", "");
      };
      Object.entries(groups).map(([key, value]) => {
        let menuText = `/${key}/`;
        if (menuText === "/index.md/") {
          menuText = "\u5E8F\u8A00";
        }
        menus[menuText] = {
          text: key,
          collapsed: true,
          items: value.map((c) => ({ text: formatterSubtext(c), link: formatterSubLink(c) }))
        };
      });
      return menus;
    };
    var transformToNav = (menus) => {
      const getHead = (nav) => {
        const store = menus[`/${nav}/`];
        return store.items[0].link;
      };
      const indexNav = {
        text: "\u9996\u9875",
        link: "/"
      };
      const astNav = {
        text: "AST",
        link: getHead("$AST")
      };
      const koaNav = {
        text: "Koa",
        link: getHead("$Koajs")
      };
      const weeklyNav = {
        text: "\u5468\u62A5",
        link: getHead("$weekSummary")
      };
      return [indexNav, astNav, koaNav, weeklyNav];
    };
    var navGenerator2 = () => {
      return {
        name: "nav-generator",
        configResolved(config) {
          const { vitepress } = config;
          if (!vitepress)
            return;
          const menus = slideGroupByHead(vitepress.pages);
          Reflect.deleteProperty(menus, "\u5E8F\u8A00");
          vitepress.userConfig.themeConfig.sidebar = menus;
          console.log("=====> menus", menus[`/$weekSummary/`]);
          vitepress.userConfig.themeConfig.nav = transformToNav(menus);
        }
      };
    };
    module.exports = navGenerator2;
  }
});

// docs/.vitepress/config.mjs
var import_nav_ganerator = __toESM(require_nav_ganerator(), 1);
import { defineConfig } from "file:///Users/wuhong/custom-desktop/github/docs/wuh.blog/node_modules/.pnpm/vitepress@1.0.2_@algolia+client-search@4.23.2_search-insights@2.13.0/node_modules/vitepress/dist/node/index.js";
import vue from "file:///Users/wuhong/custom-desktop/github/docs/wuh.blog/node_modules/.pnpm/@vitejs+plugin-vue@5.0.4_vite@5.2.8_vue@3.4.21/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vueJSX from "file:///Users/wuhong/custom-desktop/github/docs/wuh.blog/node_modules/.pnpm/@vitejs+plugin-vue-jsx@3.1.0_vite@5.2.8_vue@3.4.21/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
var config_default = defineConfig({
  title: "shadow's wiki",
  description: "Fragmented knowledge manager",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "\u9996\u9875", link: "/" }
    ],
    sidebar: {},
    socialLinks: [
      { icon: "github", link: "https://github.com/vuejs/vitepress" }
    ]
  },
  vite: {
    plugins: [(0, import_nav_ganerator.default)()]
  },
  markdown: {},
  outDir: "blog.wuh.site",
  srcExclude: ["**/README.md", "**/*.js", "**/*.png", "**/*.assets"],
  metaChunk: true
});
export {
  config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsicGx1Z2lucy9uYXYtZ2FuZXJhdG9yL2luZGV4LmpzIiwgImRvY3MvLnZpdGVwcmVzcy9jb25maWcubWpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL3d1aG9uZy9jdXN0b20tZGVza3RvcC9naXRodWIvZG9jcy93dWguYmxvZy9wbHVnaW5zL25hdi1nYW5lcmF0b3JcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy93dWhvbmcvY3VzdG9tLWRlc2t0b3AvZ2l0aHViL2RvY3Mvd3VoLmJsb2cvcGx1Z2lucy9uYXYtZ2FuZXJhdG9yL2luZGV4LmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy93dWhvbmcvY3VzdG9tLWRlc2t0b3AvZ2l0aHViL2RvY3Mvd3VoLmJsb2cvcGx1Z2lucy9uYXYtZ2FuZXJhdG9yL2luZGV4LmpzXCI7Y29uc3Qgc2xpZGVHcm91cEJ5SGVhZCA9IChwYWdlcykgPT4ge1xuICBjb25zdCBtZW51cyA9IHt9XG4gIGNvbnN0IGdyb3VwcyA9IHBhZ2VzLnJlZHVjZSgoYWNjLCBjdXJyKSA9PiB7XG4gICAgY29uc3QgcGF0aHMgPSBjdXJyLnNwbGl0KCcvJylcbiAgICBjb25zdCBtZW51R3JvdXAgPSBwYXRoc1swXSB8fCBjdXJyXG4gIFxuICAgIGxldCBsaXN0ID0gYWNjW21lbnVHcm91cF0gfHwgW11cbiAgXG4gICAgaWYgKGN1cnIuc3RhcnRzV2l0aChtZW51R3JvdXApKSB7XG4gICAgICBsaXN0ID0gW10uY29uY2F0KGxpc3QsIGN1cnIpXG4gICAgfVxuXG4gICAgYWNjW21lbnVHcm91cF0gPSBsaXN0XG5cbiAgICByZXR1cm4gYWNjXG4gIH0sIHt9KVxuXG4gIGNvbnN0IGZvcm1hdHRlclN1YnRleHQgPSAoZmlsZW5hbWUpID0+IHtcbiAgICBjb25zdCBwYXRocyA9IGZpbGVuYW1lLnJlcGxhY2UoLyhcXHN8XFwkKS9naSwgJycpLnNwbGl0KCcvJylcblxuICAgIGlmIChwYXRocy5sZW5ndGggPiAyKSB7XG4gICAgICByZXR1cm4gcGF0aHMuc2xpY2UoMikuam9pbignLScpXG4gICAgfVxuXG4gICAgaWYgKHBhdGhzLmxlbmd0aCA+IDEpIHtcbiAgICAgIHJldHVybiBwYXRocy5zbGljZSgxKVxuICAgIH1cblxuICAgIHJldHVybiBmaWxlbmFtZVxuICB9XG5cbiAgY29uc3QgZm9ybWF0dGVyU3ViTGluayA9IChmaWxlbmFtZSkgPT4ge1xuICAgIHJldHVybiAnLycgKyBmaWxlbmFtZS5yZXBsYWNlKCcubWQnLCAnJylcbiAgfVxuXG4gIE9iamVjdC5lbnRyaWVzKGdyb3VwcykubWFwKChba2V5LCB2YWx1ZV0pID0+IHtcbiAgICBsZXQgbWVudVRleHQgPSBgLyR7a2V5fS9gXG5cbiAgICBpZiAobWVudVRleHQgPT09ICcvaW5kZXgubWQvJykge1xuICAgICAgbWVudVRleHQgPSAnXHU1RThGXHU4QTAwJ1xuICAgIH1cblxuICAgIG1lbnVzW21lbnVUZXh0XSA9IHtcbiAgICAgIHRleHQ6IGtleSxcbiAgICAgIGNvbGxhcHNlZDogdHJ1ZSxcbiAgICAgIGl0ZW1zOiB2YWx1ZS5tYXAoYyA9PiAoeyB0ZXh0OiBmb3JtYXR0ZXJTdWJ0ZXh0KGMpLCBsaW5rOiBmb3JtYXR0ZXJTdWJMaW5rKGMpIH0pKVxuICAgIH1cbiAgfSlcblxuICByZXR1cm4gbWVudXNcbn1cblxuY29uc3QgdHJhbnNmb3JtVG9OYXYgPSAobWVudXMpID0+IHtcbiAgY29uc3QgZ2V0SGVhZCA9IChuYXYpID0+IHtcbiAgICBjb25zdCBzdG9yZSA9IG1lbnVzW2AvJHtuYXZ9L2BdXG4gICAgcmV0dXJuIHN0b3JlLml0ZW1zWzBdLmxpbmtcbiAgfVxuXG4gIGNvbnN0IGluZGV4TmF2ID0ge1xuICAgIHRleHQ6ICdcdTk5OTZcdTk4NzUnLFxuICAgIGxpbms6ICcvJ1xuICB9XG5cbiAgY29uc3QgYXN0TmF2ID0ge1xuICAgIHRleHQ6ICdBU1QnLFxuICAgIGxpbms6IGdldEhlYWQoJyRBU1QnKVxuICB9XG5cbiAgY29uc3Qga29hTmF2ID0ge1xuICAgIHRleHQ6ICdLb2EnLFxuICAgIGxpbms6IGdldEhlYWQoJyRLb2FqcycpXG4gIH1cblxuICBjb25zdCB3ZWVrbHlOYXYgPSB7XG4gICAgdGV4dDogJ1x1NTQ2OFx1NjJBNScsXG4gICAgbGluazogZ2V0SGVhZCgnJHdlZWtTdW1tYXJ5JylcbiAgfVxuXG5cblxuICByZXR1cm4gW2luZGV4TmF2LCBhc3ROYXYsIGtvYU5hdiwgd2Vla2x5TmF2XVxufVxuXG5jb25zdCBuYXZHZW5lcmF0b3IgPSAoKSA9PiB7XG4gIHJldHVybiB7XG4gICAgbmFtZTogJ25hdi1nZW5lcmF0b3InLFxuICAgIGNvbmZpZ1Jlc29sdmVkKGNvbmZpZykge1xuICAgICAgY29uc3QgeyB2aXRlcHJlc3MgfSA9IGNvbmZpZ1xuICAgICAgaWYgKCF2aXRlcHJlc3MpIHJldHVyblxuICAgICAgY29uc3QgbWVudXMgPSBzbGlkZUdyb3VwQnlIZWFkKHZpdGVwcmVzcy5wYWdlcylcblxuICAgICAgUmVmbGVjdC5kZWxldGVQcm9wZXJ0eShtZW51cywgJ1x1NUU4Rlx1OEEwMCcpXG4gICAgICB2aXRlcHJlc3MudXNlckNvbmZpZy50aGVtZUNvbmZpZy5zaWRlYmFyID0gbWVudXNcblxuICAgICAgY29uc29sZS5sb2coJz09PT09PiBtZW51cycsIG1lbnVzW2AvJHdlZWtTdW1tYXJ5L2BdKVxuXG4gICAgICB2aXRlcHJlc3MudXNlckNvbmZpZy50aGVtZUNvbmZpZy5uYXYgPSB0cmFuc2Zvcm1Ub05hdihtZW51cylcbiAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBuYXZHZW5lcmF0b3IiLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy93dWhvbmcvY3VzdG9tLWRlc2t0b3AvZ2l0aHViL2RvY3Mvd3VoLmJsb2cvZG9jcy8udml0ZXByZXNzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvd3Vob25nL2N1c3RvbS1kZXNrdG9wL2dpdGh1Yi9kb2NzL3d1aC5ibG9nL2RvY3MvLnZpdGVwcmVzcy9jb25maWcubWpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy93dWhvbmcvY3VzdG9tLWRlc2t0b3AvZ2l0aHViL2RvY3Mvd3VoLmJsb2cvZG9jcy8udml0ZXByZXNzL2NvbmZpZy5tanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlcHJlc3MnXG5pbXBvcnQgdnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSdcbmltcG9ydCB2dWVKU1ggZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlLWpzeCdcbmltcG9ydCBuYXZHZW5lcmF0b3IgZnJvbSAnLi4vLi4vcGx1Z2lucy9uYXYtZ2FuZXJhdG9yJ1xuXG4vLyBodHRwczovL3ZpdGVwcmVzcy5kZXYvcmVmZXJlbmNlL3NpdGUtY29uZmlnXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICB0aXRsZTogXCJzaGFkb3cncyB3aWtpXCIsXG4gIGRlc2NyaXB0aW9uOiBcIkZyYWdtZW50ZWQga25vd2xlZGdlIG1hbmFnZXJcIixcbiAgdGhlbWVDb25maWc6IHtcbiAgICAvLyBodHRwczovL3ZpdGVwcmVzcy5kZXYvcmVmZXJlbmNlL2RlZmF1bHQtdGhlbWUtY29uZmlnXG4gICAgbmF2OiBbXG4gICAgICB7IHRleHQ6ICdcdTk5OTZcdTk4NzUnLCBsaW5rOiAnLycgfVxuICAgIF0sXG5cbiAgICBzaWRlYmFyOiB7fSxcblxuICAgIHNvY2lhbExpbmtzOiBbXG4gICAgICB7IGljb246ICdnaXRodWInLCBsaW5rOiAnaHR0cHM6Ly9naXRodWIuY29tL3Z1ZWpzL3ZpdGVwcmVzcycgfVxuICAgIF1cbiAgfSxcbiAgdml0ZToge1xuICAgIHBsdWdpbnM6IFtuYXZHZW5lcmF0b3IoKV1cbiAgfSxcbiAgbWFya2Rvd246IHtcbiAgfSxcbiAgb3V0RGlyOiAnYmxvZy53dWguc2l0ZScsXG4gIHNyY0V4Y2x1ZGU6IFsnKiovUkVBRE1FLm1kJywgJyoqLyouanMnLCAnKiovKi5wbmcnLCAnKiovKi5hc3NldHMnXSxcbiAgbWV0YUNodW5rOiB0cnVlXG59KVxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUEyWCxRQUFNLG1CQUFtQixDQUFDLFVBQVU7QUFDN1osWUFBTSxRQUFRLENBQUM7QUFDZixZQUFNLFNBQVMsTUFBTSxPQUFPLENBQUMsS0FBSyxTQUFTO0FBQ3pDLGNBQU0sUUFBUSxLQUFLLE1BQU0sR0FBRztBQUM1QixjQUFNLFlBQVksTUFBTSxDQUFDLEtBQUs7QUFFOUIsWUFBSSxPQUFPLElBQUksU0FBUyxLQUFLLENBQUM7QUFFOUIsWUFBSSxLQUFLLFdBQVcsU0FBUyxHQUFHO0FBQzlCLGlCQUFPLENBQUMsRUFBRSxPQUFPLE1BQU0sSUFBSTtBQUFBLFFBQzdCO0FBRUEsWUFBSSxTQUFTLElBQUk7QUFFakIsZUFBTztBQUFBLE1BQ1QsR0FBRyxDQUFDLENBQUM7QUFFTCxZQUFNLG1CQUFtQixDQUFDLGFBQWE7QUFDckMsY0FBTSxRQUFRLFNBQVMsUUFBUSxhQUFhLEVBQUUsRUFBRSxNQUFNLEdBQUc7QUFFekQsWUFBSSxNQUFNLFNBQVMsR0FBRztBQUNwQixpQkFBTyxNQUFNLE1BQU0sQ0FBQyxFQUFFLEtBQUssR0FBRztBQUFBLFFBQ2hDO0FBRUEsWUFBSSxNQUFNLFNBQVMsR0FBRztBQUNwQixpQkFBTyxNQUFNLE1BQU0sQ0FBQztBQUFBLFFBQ3RCO0FBRUEsZUFBTztBQUFBLE1BQ1Q7QUFFQSxZQUFNLG1CQUFtQixDQUFDLGFBQWE7QUFDckMsZUFBTyxNQUFNLFNBQVMsUUFBUSxPQUFPLEVBQUU7QUFBQSxNQUN6QztBQUVBLGFB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
