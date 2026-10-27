import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const LIST_SELECTOR =
  "ol.steps, ol.principles, ol.timeline, ol.log-list, ul.contact-links";
const GROUP_SELECTOR = ".section-head, .contact-grid";
const WHY_ITEM_SELECTOR = ".why-copy > p, .why-aside > .why-block";

function isElement(value: Element): value is HTMLElement {
  return value instanceof HTMLElement;
}

/**
 * Lists and grouped blocks reveal their children one after another instead of
 * moving as one large block.
 */
function revealItems(container: Element): HTMLElement[] {
  const items: HTMLElement[] = [];

  for (const child of Array.from(container.children)) {
    if (!isElement(child)) continue;

    if (child.matches(LIST_SELECTOR)) {
      items.push(...Array.from(child.children).filter(isElement));
    } else if (child.matches(".why-grid")) {
      // The Why section reads as a sequence, so reveal each paragraph and
      // aside block instead of moving both columns as single blocks.
      items.push(
        ...Array.from(child.querySelectorAll(WHY_ITEM_SELECTOR)).filter(
          isElement,
        ),
      );
    } else if (child.matches(GROUP_SELECTOR)) {
      items.push(...Array.from(child.children).filter(isElement));
    } else {
      items.push(child);
    }
  }

  return items;
}

export function setupMotion(): void {
  if (typeof window === "undefined") return;

  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });

  // The hero video is hidden by CSS for reduced-motion users. Pause it as well
  // so it does not keep decoding frames behind the poster.
  const heroVideo = document.querySelector<HTMLVideoElement>("[data-hero-video]");
  if (heroVideo) {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncHeroVideo = () => {
      if (reduceMotion.matches) {
        heroVideo.pause();
        heroVideo.currentTime = 0;
      } else {
        void heroVideo.play().catch(() => {
          // Autoplay can be blocked; the poster remains visible.
        });
      }
    };

    syncHeroVideo();
    reduceMotion.addEventListener("change", syncHeroVideo);
  }

  const mm = gsap.matchMedia();

  // Content motion. This is disabled entirely for reduced-motion users, who
  // get the static hero fallback and no scroll-linked movement.
  mm.add("(prefers-reduced-motion: no-preference)", () => {
    let showItemsAlreadyInView: (() => void) | undefined;

    const ctx = gsap.context(() => {
      const intro = gsap.utils.toArray<HTMLElement>(
        ".hero-copy > *, .hero-note, .page-header .container > *, .entry-header .container > *",
      );

      if (intro.length > 0) {
        gsap
          .timeline({
            defaults: { ease: "power3.out", duration: 0.85 },
            onComplete: () => {
              gsap.set(intro, { clearProps: "opacity,transform" });
            },
          })
          .from(intro, {
            y: 18,
            opacity: 0.35,
            stagger: 0.08,
          });
      }

      const containers = gsap.utils.toArray<HTMLElement>(
        ".section > .container",
      );
      const revealTargets = containers.flatMap(revealItems);

      const logList = document.querySelector<HTMLElement>(
        ".entry-body .log-list",
      );
      if (logList) {
        revealTargets.push(...Array.from(logList.children).filter(isElement));
      }

      if (revealTargets.length === 0) return;

      gsap.set(revealTargets, { opacity: 0, y: 24 });

      // A deep link such as /#plan lands below the fold before the triggers
      // are created. On every refresh, make anything already in view visible
      // so a hash link never leaves content hidden.
      showItemsAlreadyInView = () => {
        for (const item of revealTargets) {
          if (item.getBoundingClientRect().top < window.innerHeight) {
            gsap.set(item, { opacity: 1, y: 0 });
          }
        }
      };

      ScrollTrigger.addEventListener("refresh", showItemsAlreadyInView);
      ScrollTrigger.batch(revealTargets, {
        start: "top 88%",
        once: true,
        onEnter: (batch) => {
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.06,
            overwrite: true,
          });
        },
      });
      ScrollTrigger.refresh();
    }, document.body);

    return () => {
      if (showItemsAlreadyInView) {
        ScrollTrigger.removeEventListener("refresh", showItemsAlreadyInView);
      }
      ctx.revert();
    };
  });

  // The hero image drift is desktop-only: it is subtle, and skipping it on
  // small screens avoids unnecessary compositing while scrolling.
  mm.add(
    "(prefers-reduced-motion: no-preference) and (min-width: 761px)",
    () => {
      const ctx = gsap.context(() => {
        const video = document.querySelector<HTMLElement>(".hero-media video");
        if (!video) return;

        gsap.set(video, { scale: 1.12 });

        gsap.to(video, {
          yPercent: 5,
          ease: "none",
          scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        });
      }, document.body);

      return () => ctx.revert();
    },
  );

  // Recalculate trigger positions after images and fonts have settled.
  if (document.readyState === "complete") {
    ScrollTrigger.refresh();
  } else {
    window.addEventListener("load", () => ScrollTrigger.refresh(), {
      once: true,
    });
  }
}
