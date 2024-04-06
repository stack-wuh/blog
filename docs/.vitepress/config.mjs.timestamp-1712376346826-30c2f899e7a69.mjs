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
      transformToWeekly(menus["/$weekSummary/"].items);
      return menus;
    };
    var transformToWeekly = (items) => {
      const itemsArgv = {};
      while (items.length) {
        const current = items.shift();
        console.log("====? current", current);
        if (!current || !current.link)
          return;
        const paths = current.link.split("/").slice(2);
        const itemObj = itemsArgv[paths[0]] || {};
        if (!itemObj.text) {
          itemObj.text = paths[0];
        }
        itemObj.items = [].concat(itemObj.items, {
          text: paths[1],
          link: current.link
        });
      }
      console.log("====> itemsArgv", itemsArgv);
      return itemsArgv;
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
          vitepress.userConfig.themeConfig.nav = transformToNav(menus);
          console.log("=====> menus", menus);
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsicGx1Z2lucy9uYXYtZ2FuZXJhdG9yL2luZGV4LmpzIiwgImRvY3MvLnZpdGVwcmVzcy9jb25maWcubWpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL3d1aG9uZy9jdXN0b20tZGVza3RvcC9naXRodWIvZG9jcy93dWguYmxvZy9wbHVnaW5zL25hdi1nYW5lcmF0b3JcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy93dWhvbmcvY3VzdG9tLWRlc2t0b3AvZ2l0aHViL2RvY3Mvd3VoLmJsb2cvcGx1Z2lucy9uYXYtZ2FuZXJhdG9yL2luZGV4LmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy93dWhvbmcvY3VzdG9tLWRlc2t0b3AvZ2l0aHViL2RvY3Mvd3VoLmJsb2cvcGx1Z2lucy9uYXYtZ2FuZXJhdG9yL2luZGV4LmpzXCI7Y29uc3Qgc2xpZGVHcm91cEJ5SGVhZCA9IChwYWdlcykgPT4ge1xuICBjb25zdCBtZW51cyA9IHt9XG4gIGNvbnN0IGdyb3VwcyA9IHBhZ2VzLnJlZHVjZSgoYWNjLCBjdXJyKSA9PiB7XG4gICAgY29uc3QgcGF0aHMgPSBjdXJyLnNwbGl0KCcvJylcbiAgICBjb25zdCBtZW51R3JvdXAgPSBwYXRoc1swXSB8fCBjdXJyXG4gIFxuICAgIGxldCBsaXN0ID0gYWNjW21lbnVHcm91cF0gfHwgW11cbiAgXG4gICAgaWYgKGN1cnIuc3RhcnRzV2l0aChtZW51R3JvdXApKSB7XG4gICAgICBsaXN0ID0gW10uY29uY2F0KGxpc3QsIGN1cnIpXG4gICAgfVxuXG4gICAgYWNjW21lbnVHcm91cF0gPSBsaXN0XG5cbiAgICByZXR1cm4gYWNjXG4gIH0sIHt9KVxuXG4gIGNvbnN0IGZvcm1hdHRlclN1YnRleHQgPSAoZmlsZW5hbWUpID0+IHtcbiAgICBjb25zdCBwYXRocyA9IGZpbGVuYW1lLnJlcGxhY2UoLyhcXHN8XFwkKS9naSwgJycpLnNwbGl0KCcvJylcblxuICAgIGlmIChwYXRocy5sZW5ndGggPiAyKSB7XG4gICAgICByZXR1cm4gcGF0aHMuc2xpY2UoMikuam9pbignLScpXG4gICAgfVxuXG4gICAgaWYgKHBhdGhzLmxlbmd0aCA+IDEpIHtcbiAgICAgIHJldHVybiBwYXRocy5zbGljZSgxKVxuICAgIH1cblxuICAgIHJldHVybiBmaWxlbmFtZVxuICB9XG5cbiAgY29uc3QgZm9ybWF0dGVyU3ViTGluayA9IChmaWxlbmFtZSkgPT4ge1xuICAgIHJldHVybiAnLycgKyBmaWxlbmFtZS5yZXBsYWNlKCcubWQnLCAnJylcbiAgfVxuXG4gIE9iamVjdC5lbnRyaWVzKGdyb3VwcykubWFwKChba2V5LCB2YWx1ZV0pID0+IHtcbiAgICBsZXQgbWVudVRleHQgPSBgLyR7a2V5fS9gXG5cbiAgICBpZiAobWVudVRleHQgPT09ICcvaW5kZXgubWQvJykge1xuICAgICAgbWVudVRleHQgPSAnXHU1RThGXHU4QTAwJ1xuICAgIH1cblxuICAgIG1lbnVzW21lbnVUZXh0XSA9IHtcbiAgICAgIHRleHQ6IGtleSxcbiAgICAgIGNvbGxhcHNlZDogdHJ1ZSxcbiAgICAgIGl0ZW1zOiB2YWx1ZS5tYXAoYyA9PiAoeyB0ZXh0OiBmb3JtYXR0ZXJTdWJ0ZXh0KGMpLCBsaW5rOiBmb3JtYXR0ZXJTdWJMaW5rKGMpIH0pKVxuICAgIH1cbiAgfSlcblxuICB0cmFuc2Zvcm1Ub1dlZWtseShtZW51c1snLyR3ZWVrU3VtbWFyeS8nXS5pdGVtcylcblxuICByZXR1cm4gbWVudXNcbn1cblxuY29uc3QgdHJhbnNmb3JtVG9XZWVrbHkgPSAoaXRlbXMpID0+IHtcbiAgY29uc3QgaXRlbXNBcmd2ID0ge31cblxuICB3aGlsZShpdGVtcy5sZW5ndGgpIHtcbiAgICBjb25zdCBjdXJyZW50ID0gaXRlbXMuc2hpZnQoKVxuICAgIGNvbnNvbGUubG9nKCc9PT09PyBjdXJyZW50JywgY3VycmVudClcbiAgICBpZiAoIWN1cnJlbnQgfHwgIWN1cnJlbnQubGluaykgcmV0dXJuXG4gICAgY29uc3QgcGF0aHMgPSBjdXJyZW50Lmxpbmsuc3BsaXQoJy8nKS5zbGljZSgyKVxuICAgIGNvbnN0IGl0ZW1PYmogPSBpdGVtc0FyZ3ZbcGF0aHNbMF1dIHx8IHt9XG5cbiAgICBpZiAoIWl0ZW1PYmoudGV4dCkge1xuICAgICAgaXRlbU9iai50ZXh0ID0gcGF0aHNbMF1cbiAgICB9XG5cbiAgICBpdGVtT2JqLml0ZW1zID0gW10uY29uY2F0KGl0ZW1PYmouaXRlbXMsIHtcbiAgICAgIHRleHQ6IHBhdGhzWzFdLFxuICAgICAgbGluazogY3VycmVudC5saW5rXG4gICAgfSlcbiAgfVxuXG4gIGNvbnNvbGUubG9nKCc9PT09PiBpdGVtc0FyZ3YnLCBpdGVtc0FyZ3YpXG5cbiAgcmV0dXJuIGl0ZW1zQXJndlxufVxuXG5jb25zdCB0cmFuc2Zvcm1Ub05hdiA9IChtZW51cykgPT4ge1xuICBjb25zdCBnZXRIZWFkID0gKG5hdikgPT4ge1xuICAgIGNvbnN0IHN0b3JlID0gbWVudXNbYC8ke25hdn0vYF1cbiAgICByZXR1cm4gc3RvcmUuaXRlbXNbMF0ubGlua1xuICB9XG5cbiAgY29uc3QgaW5kZXhOYXYgPSB7XG4gICAgdGV4dDogJ1x1OTk5Nlx1OTg3NScsXG4gICAgbGluazogJy8nXG4gIH1cblxuICBjb25zdCBhc3ROYXYgPSB7XG4gICAgdGV4dDogJ0FTVCcsXG4gICAgbGluazogZ2V0SGVhZCgnJEFTVCcpXG4gIH1cblxuICBjb25zdCBrb2FOYXYgPSB7XG4gICAgdGV4dDogJ0tvYScsXG4gICAgbGluazogZ2V0SGVhZCgnJEtvYWpzJylcbiAgfVxuXG4gIGNvbnN0IHdlZWtseU5hdiA9IHtcbiAgICB0ZXh0OiAnXHU1NDY4XHU2MkE1JyxcbiAgICBsaW5rOiBnZXRIZWFkKCckd2Vla1N1bW1hcnknKVxuICB9XG5cblxuXG4gIHJldHVybiBbaW5kZXhOYXYsIGFzdE5hdiwga29hTmF2LCB3ZWVrbHlOYXZdXG59XG5cbmNvbnN0IG5hdkdlbmVyYXRvciA9ICgpID0+IHtcbiAgcmV0dXJuIHtcbiAgICBuYW1lOiAnbmF2LWdlbmVyYXRvcicsXG4gICAgY29uZmlnUmVzb2x2ZWQoY29uZmlnKSB7XG4gICAgICBjb25zdCB7IHZpdGVwcmVzcyB9ID0gY29uZmlnXG4gICAgICBpZiAoIXZpdGVwcmVzcykgcmV0dXJuXG4gICAgICBjb25zdCBtZW51cyA9IHNsaWRlR3JvdXBCeUhlYWQodml0ZXByZXNzLnBhZ2VzKVxuXG4gICAgICBSZWZsZWN0LmRlbGV0ZVByb3BlcnR5KG1lbnVzLCAnXHU1RThGXHU4QTAwJylcbiAgICAgIHZpdGVwcmVzcy51c2VyQ29uZmlnLnRoZW1lQ29uZmlnLnNpZGViYXIgPSBtZW51c1xuICAgICAgdml0ZXByZXNzLnVzZXJDb25maWcudGhlbWVDb25maWcubmF2ID0gdHJhbnNmb3JtVG9OYXYobWVudXMpXG4gICAgICBjb25zb2xlLmxvZygnPT09PT0+IG1lbnVzJywgbWVudXMpXG5cbiAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBuYXZHZW5lcmF0b3IiLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy93dWhvbmcvY3VzdG9tLWRlc2t0b3AvZ2l0aHViL2RvY3Mvd3VoLmJsb2cvZG9jcy8udml0ZXByZXNzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvd3Vob25nL2N1c3RvbS1kZXNrdG9wL2dpdGh1Yi9kb2NzL3d1aC5ibG9nL2RvY3MvLnZpdGVwcmVzcy9jb25maWcubWpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy93dWhvbmcvY3VzdG9tLWRlc2t0b3AvZ2l0aHViL2RvY3Mvd3VoLmJsb2cvZG9jcy8udml0ZXByZXNzL2NvbmZpZy5tanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlcHJlc3MnXG5pbXBvcnQgdnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSdcbmltcG9ydCB2dWVKU1ggZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlLWpzeCdcbmltcG9ydCBuYXZHZW5lcmF0b3IgZnJvbSAnLi4vLi4vcGx1Z2lucy9uYXYtZ2FuZXJhdG9yJ1xuXG4vLyBodHRwczovL3ZpdGVwcmVzcy5kZXYvcmVmZXJlbmNlL3NpdGUtY29uZmlnXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICB0aXRsZTogXCJzaGFkb3cncyB3aWtpXCIsXG4gIGRlc2NyaXB0aW9uOiBcIkZyYWdtZW50ZWQga25vd2xlZGdlIG1hbmFnZXJcIixcbiAgdGhlbWVDb25maWc6IHtcbiAgICAvLyBodHRwczovL3ZpdGVwcmVzcy5kZXYvcmVmZXJlbmNlL2RlZmF1bHQtdGhlbWUtY29uZmlnXG4gICAgbmF2OiBbXG4gICAgICB7IHRleHQ6ICdcdTk5OTZcdTk4NzUnLCBsaW5rOiAnLycgfVxuICAgIF0sXG5cbiAgICBzaWRlYmFyOiB7fSxcblxuICAgIHNvY2lhbExpbmtzOiBbXG4gICAgICB7IGljb246ICdnaXRodWInLCBsaW5rOiAnaHR0cHM6Ly9naXRodWIuY29tL3Z1ZWpzL3ZpdGVwcmVzcycgfVxuICAgIF1cbiAgfSxcbiAgdml0ZToge1xuICAgIHBsdWdpbnM6IFtuYXZHZW5lcmF0b3IoKV1cbiAgfSxcbiAgbWFya2Rvd246IHtcbiAgfSxcbiAgb3V0RGlyOiAnYmxvZy53dWguc2l0ZScsXG4gIHNyY0V4Y2x1ZGU6IFsnKiovUkVBRE1FLm1kJywgJyoqLyouanMnLCAnKiovKi5wbmcnLCAnKiovKi5hc3NldHMnXSxcbiAgbWV0YUNodW5rOiB0cnVlXG59KVxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUEyWCxRQUFNLG1CQUFtQixDQUFDLFVBQVU7QUFDN1osWUFBTSxRQUFRLENB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
