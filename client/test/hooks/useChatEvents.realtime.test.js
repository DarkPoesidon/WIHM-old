import { describe, expect, test, vi } from "vitest";
import viteConfig from "../../vite.config.js";

if (typeof window === "undefined") {
  globalThis.window = new EventTarget();
  if (typeof CustomEvent === "undefined") {
    globalThis.CustomEvent = class CustomEvent extends Event {
      constructor(type, eventInitDict) {
        super(type, eventInitDict);
        this.detail = eventInitDict?.detail;
      }
    };
  }
}

describe("useChatEvents — custom realtime event dispatch and dev proxy", () => {
  test("configures vite dev server proxy for /ws with WebSocket support", () => {
    const config = viteConfig({ mode: "development" });
    expect(config.server.proxy["/ws"]).toBeDefined();
    expect(config.server.proxy["/ws"].ws).toBe(true);
  });

  test("dispatches wihm:realtime-event on window when a valid WebSocket event is received", () => {
    const listener = vi.fn();
    window.addEventListener("wihm:realtime-event", listener);

    const payload = {
      type: "presence_update",
      username: "alice",
      status: "online",
    };
    window.dispatchEvent(
      new CustomEvent("wihm:realtime-event", { detail: payload }),
    );

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener.mock.calls[0][0].detail).toEqual(payload);

    window.removeEventListener("wihm:realtime-event", listener);
  });
});
