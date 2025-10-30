import {
  Component,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵdefineComponent,
  ɵɵdomElement,
  ɵɵdomElementEnd,
  ɵɵdomElementStart,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIndex,
  ɵɵstyleProp,
  ɵɵtext,
  ɵɵtextInterpolate
} from "./chunk-BEYHKG5W.js";

// src/app/feature/home/home.ts
var _forTrack0 = ($index, $item) => $item.name;
function Home_For_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "div", 16)(1, "h3");
    \u0275\u0275text(2);
    \u0275\u0275domElementEnd()();
  }
  if (rf & 2) {
    const group_r1 = ctx.$implicit;
    \u0275\u0275styleProp("background-color", group_r1.color);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(group_r1.name);
  }
}
function Home_For_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElement(0, "div", 15);
  }
}
var Home = class _Home {
  scoutGroups = [
    {
      name: "Biber",
      color: "#EAC04A",
      slug: "",
      motto: "",
      description: "",
      ageRange: ""
    },
    {
      name: "W\xF6lfe",
      color: "#1380A3",
      slug: "",
      motto: "",
      description: "",
      ageRange: ""
    },
    {
      name: "Pfader",
      color: "#B78E60",
      slug: "",
      motto: "",
      description: "",
      ageRange: ""
    },
    {
      name: "Pios",
      color: "#BF2E26",
      slug: "",
      motto: "",
      description: "",
      ageRange: ""
    }
  ];
  instagramPosts = Array(9).fill(null);
  static \u0275fac = function Home_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _Home)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _Home, selectors: [["app-home"]], decls: 23, vars: 0, consts: [[1, "home"], [1, "hero"], [1, "hero-content"], [1, "hero-text"], [1, "cta-button"], [1, "hero-image-container"], ["src", "assets/elements/blob.svg", "alt", "", 1, "blob"], ["src", "assets/images/group.png", "alt", "Pfadi Gruppenfoto", "width", "1157", "height", "685", "priority", "", 1, "hero-image"], [1, "scout-groups"], [1, "container"], [1, "groups-grid"], [1, "group-card", 3, "background-color"], [1, "instagram-section"], [1, "section-title"], [1, "instagram-grid"], [1, "instagram-post"], [1, "group-card"]], template: function Home_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275domElementStart(0, "div", 0)(1, "section", 1)(2, "div", 2)(3, "div", 3)(4, "h1");
      \u0275\u0275text(5, "Willkommen bei Pfadi St. Justus in Flums");
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(6, "button", 4);
      \u0275\u0275text(7, "Mitglied werden");
      \u0275\u0275domElementEnd()();
      \u0275\u0275domElementStart(8, "div", 5);
      \u0275\u0275domElement(9, "img", 6)(10, "img", 7);
      \u0275\u0275domElementEnd()()();
      \u0275\u0275domElementStart(11, "section", 8)(12, "div", 9)(13, "div", 10);
      \u0275\u0275repeaterCreate(14, Home_For_15_Template, 3, 3, "div", 11, _forTrack0);
      \u0275\u0275domElementEnd()()();
      \u0275\u0275domElementStart(16, "section", 12)(17, "div", 9)(18, "h2", 13);
      \u0275\u0275text(19, "Das l\xE4uft bei uns gerade");
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(20, "div", 14);
      \u0275\u0275repeaterCreate(21, Home_For_22_Template, 1, 0, "div", 15, \u0275\u0275repeaterTrackByIndex);
      \u0275\u0275domElementEnd()()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(14);
      \u0275\u0275repeater(ctx.scoutGroups);
      \u0275\u0275advance(7);
      \u0275\u0275repeater(ctx.instagramPosts);
    }
  }, styles: ['\n\n.home[_ngcontent-%COMP%] {\n  min-height: 100vh;\n}\n.container[_ngcontent-%COMP%] {\n  max-width: 1440px;\n  margin: 0 auto;\n  padding: 0 clamp(2rem, 5vw, 4rem);\n}\n@media (min-width: 1921px) {\n  .container[_ngcontent-%COMP%] {\n    max-width: 1920px;\n  }\n}\n.hero[_ngcontent-%COMP%] {\n  position: relative;\n  min-height: clamp(600px, 50vh, 800px);\n  overflow: hidden;\n  padding: 4rem 0;\n}\n.hero-content[_ngcontent-%COMP%] {\n  max-width: 1440px;\n  margin: 0 auto;\n  padding: 0 clamp(2rem, 5vw, 4rem);\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 2rem;\n  align-items: center;\n  position: relative;\n  z-index: 2;\n}\n@media (min-width: 1921px) {\n  .hero-content[_ngcontent-%COMP%] {\n    max-width: 1920px;\n  }\n}\n.hero-text[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 3;\n}\n.hero-text[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  font-family: "Outfit", sans-serif;\n  font-weight: 800;\n  font-size: clamp(3rem, 6vw, 6rem);\n  line-height: 1.26;\n  letter-spacing: 0.1em;\n  text-transform: uppercase;\n  color: #EAC04A;\n  margin: 0 0 3rem 0;\n  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);\n}\n.cta-button[_ngcontent-%COMP%] {\n  font-family: "Outfit", sans-serif;\n  font-weight: 700;\n  font-size: clamp(18px, 1.5vw, 24px);\n  line-height: 30px;\n  text-transform: uppercase;\n  color: #000000;\n  background: transparent;\n  border: 5px solid #000000;\n  border-radius: 81px;\n  padding: 1.2rem 3rem;\n  cursor: pointer;\n  transition: all 0.3s ease;\n}\n.cta-button[_ngcontent-%COMP%]:hover {\n  background: #000000;\n  color: #EAC04A;\n}\n.hero-image-container[_ngcontent-%COMP%] {\n  position: relative;\n  width: 100%;\n  height: 100%;\n  min-height: 400px;\n}\n.blob[_ngcontent-%COMP%] {\n  position: absolute;\n  border-radius: 30% 70% 70% 30%/30% 30% 70% 70%;\n  z-index: 1;\n}\n.blob[_ngcontent-%COMP%] {\n  width: clamp(250px, 35vw, 500px);\n  height: clamp(250px, 35vw, 500px);\n  background: #EAC04A;\n  top: -5%;\n  right: -10%;\n  transform: rotate(-24.22deg);\n  z-index: 0;\n}\n.hero-image[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 2;\n  width: 100%;\n  height: auto;\n  object-fit: cover;\n}\n.scout-groups[_ngcontent-%COMP%] {\n  padding: 4rem 0;\n}\n.groups-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));\n  gap: clamp(1.5rem, 3vw, 2rem);\n  max-width: 1400px;\n  margin: 0 auto;\n}\n.group-card[_ngcontent-%COMP%] {\n  aspect-ratio: 1;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  transition: transform 0.3s ease;\n}\n.group-card[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  font-family: "Outfit", sans-serif;\n  font-weight: 700;\n  font-size: clamp(18px, 1.5vw, 20px);\n  line-height: 25px;\n  text-transform: uppercase;\n  color: #000000;\n  margin: 0;\n}\n.instagram-section[_ngcontent-%COMP%] {\n  padding: 4rem 0 6rem;\n}\n.section-title[_ngcontent-%COMP%] {\n  font-family: "Maname", serif;\n  font-weight: 400;\n  font-size: clamp(2.5rem, 4vw, 3rem);\n  line-height: 1.2;\n  color: #000000;\n  margin: 0 0 3rem 0;\n}\n.instagram-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));\n  gap: 0;\n  max-width: 1400px;\n  margin: 0 auto;\n}\n.instagram-post[_ngcontent-%COMP%] {\n  aspect-ratio: 1;\n  background: #D9D9D9;\n  border: 5px solid #FFFFFF;\n  transition: opacity 0.3s ease;\n}\n.instagram-post[_ngcontent-%COMP%]:hover {\n  opacity: 0.9;\n}\n@media (max-width: 1024px) {\n  .hero-content[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  .hero-text[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n    font-size: clamp(2rem, 8vw, 3rem);\n  }\n  .groups-grid[_ngcontent-%COMP%] {\n    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));\n  }\n  .instagram-grid[_ngcontent-%COMP%] {\n    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));\n  }\n}\n@media (max-width: 640px) {\n  .instagram-grid[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  .groups-grid[_ngcontent-%COMP%] {\n    grid-template-columns: repeat(2, 1fr);\n  }\n}\n/*# sourceMappingURL=home.css.map */'] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(Home, [{
    type: Component,
    args: [{ selector: "app-home", imports: [], template: ' <div class="home">\n      <!-- Hero Section -->\n      <section class="hero">\n        <div class="hero-content">\n          <div class="hero-text">\n            <h1>Willkommen bei Pfadi St. Justus in Flums</h1>\n            <button class="cta-button">Mitglied werden</button>\n          </div>\n          <div class="hero-image-container">\n            <img class="blob" src="assets/elements/blob.svg" alt="">\n            <img\n              src="assets/images/group.png"\n              alt="Pfadi Gruppenfoto"\n              width="1157"\n              height="685"\n              priority\n              class="hero-image"\n            />\n          </div>\n        </div>\n      </section>\n\n      <!-- Scout Groups Section -->\n      <section class="scout-groups">\n        <div class="container">\n          <div class="groups-grid">\n            @for (group of scoutGroups; track group.name) {\n              <div class="group-card" [style.background-color]="group.color">\n                <h3>{{ group.name }}</h3>\n              </div>\n            }\n          </div>\n        </div>\n      </section>\n\n      <!-- Instagram Section -->\n      <section class="instagram-section">\n        <div class="container">\n          <h2 class="section-title">Das l\xE4uft bei uns gerade</h2>\n          <div class="instagram-grid">\n            @for (post of instagramPosts; track $index) {\n              <div class="instagram-post"></div>\n            }\n          </div>\n        </div>\n      </section>\n    </div>\n', styles: ['/* src/app/feature/home/home.scss */\n.home {\n  min-height: 100vh;\n}\n.container {\n  max-width: 1440px;\n  margin: 0 auto;\n  padding: 0 clamp(2rem, 5vw, 4rem);\n}\n@media (min-width: 1921px) {\n  .container {\n    max-width: 1920px;\n  }\n}\n.hero {\n  position: relative;\n  min-height: clamp(600px, 50vh, 800px);\n  overflow: hidden;\n  padding: 4rem 0;\n}\n.hero-content {\n  max-width: 1440px;\n  margin: 0 auto;\n  padding: 0 clamp(2rem, 5vw, 4rem);\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 2rem;\n  align-items: center;\n  position: relative;\n  z-index: 2;\n}\n@media (min-width: 1921px) {\n  .hero-content {\n    max-width: 1920px;\n  }\n}\n.hero-text {\n  position: relative;\n  z-index: 3;\n}\n.hero-text h1 {\n  font-family: "Outfit", sans-serif;\n  font-weight: 800;\n  font-size: clamp(3rem, 6vw, 6rem);\n  line-height: 1.26;\n  letter-spacing: 0.1em;\n  text-transform: uppercase;\n  color: #EAC04A;\n  margin: 0 0 3rem 0;\n  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);\n}\n.cta-button {\n  font-family: "Outfit", sans-serif;\n  font-weight: 700;\n  font-size: clamp(18px, 1.5vw, 24px);\n  line-height: 30px;\n  text-transform: uppercase;\n  color: #000000;\n  background: transparent;\n  border: 5px solid #000000;\n  border-radius: 81px;\n  padding: 1.2rem 3rem;\n  cursor: pointer;\n  transition: all 0.3s ease;\n}\n.cta-button:hover {\n  background: #000000;\n  color: #EAC04A;\n}\n.hero-image-container {\n  position: relative;\n  width: 100%;\n  height: 100%;\n  min-height: 400px;\n}\n.blob {\n  position: absolute;\n  border-radius: 30% 70% 70% 30%/30% 30% 70% 70%;\n  z-index: 1;\n}\n.blob {\n  width: clamp(250px, 35vw, 500px);\n  height: clamp(250px, 35vw, 500px);\n  background: #EAC04A;\n  top: -5%;\n  right: -10%;\n  transform: rotate(-24.22deg);\n  z-index: 0;\n}\n.hero-image {\n  position: relative;\n  z-index: 2;\n  width: 100%;\n  height: auto;\n  object-fit: cover;\n}\n.scout-groups {\n  padding: 4rem 0;\n}\n.groups-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));\n  gap: clamp(1.5rem, 3vw, 2rem);\n  max-width: 1400px;\n  margin: 0 auto;\n}\n.group-card {\n  aspect-ratio: 1;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  transition: transform 0.3s ease;\n}\n.group-card h3 {\n  font-family: "Outfit", sans-serif;\n  font-weight: 700;\n  font-size: clamp(18px, 1.5vw, 20px);\n  line-height: 25px;\n  text-transform: uppercase;\n  color: #000000;\n  margin: 0;\n}\n.instagram-section {\n  padding: 4rem 0 6rem;\n}\n.section-title {\n  font-family: "Maname", serif;\n  font-weight: 400;\n  font-size: clamp(2.5rem, 4vw, 3rem);\n  line-height: 1.2;\n  color: #000000;\n  margin: 0 0 3rem 0;\n}\n.instagram-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));\n  gap: 0;\n  max-width: 1400px;\n  margin: 0 auto;\n}\n.instagram-post {\n  aspect-ratio: 1;\n  background: #D9D9D9;\n  border: 5px solid #FFFFFF;\n  transition: opacity 0.3s ease;\n}\n.instagram-post:hover {\n  opacity: 0.9;\n}\n@media (max-width: 1024px) {\n  .hero-content {\n    grid-template-columns: 1fr;\n  }\n  .hero-text h1 {\n    font-size: clamp(2rem, 8vw, 3rem);\n  }\n  .groups-grid {\n    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));\n  }\n  .instagram-grid {\n    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));\n  }\n}\n@media (max-width: 640px) {\n  .instagram-grid {\n    grid-template-columns: 1fr;\n  }\n  .groups-grid {\n    grid-template-columns: repeat(2, 1fr);\n  }\n}\n/*# sourceMappingURL=home.css.map */\n'] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(Home, { className: "Home", filePath: "src/app/feature/home/home.ts", lineNumber: 10 });
})();
export {
  Home
};
//# sourceMappingURL=chunk-HGD4YT5A.js.map
