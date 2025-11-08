import { test, expect } from '@playwright/test';

const initMockSocket = `
(() => {
  class MockWebSocket {
    static instances = [];
    readyState = 0;
    url;
    onopen = null;
    onmessage = null;
    onerror = null;
    onclose = null;

    constructor(url) {
      this.url = url;
      MockWebSocket.instances.push(this);
      setTimeout(() => {
        this.readyState = 1;
        this.onopen && this.onopen(new Event('open'));
        this.onmessage && this.onmessage({ data: JSON.stringify({ type: 'status', status: 'connected' }) });
      }, 10);
    }

    send(data) {
      (window).__mockSocketSent = (window).__mockSocketSent || [];
      (window).__mockSocketSent.push(data);
    }

    close() {
      this.readyState = 3;
      this.onclose && this.onclose(new CloseEvent('close'));
    }
  }

  (window).__mockSockets = {
    pushMessage(payload) {
      const socket = MockWebSocket.instances.at(-1);
      socket?.onmessage?.({ data: JSON.stringify(payload) });
    }
  };

  window.WebSocket = MockWebSocket;
})();
`;

const initMockMedia = `
(() => {
  class FakeTrack {
    stop() {}
  }
  class FakeStream {
    getTracks() {
      return [new FakeTrack()];
    }
  }
  if (!navigator.mediaDevices) {
    navigator.mediaDevices = {};
  }
  navigator.mediaDevices.getUserMedia = () => Promise.resolve(new FakeStream());
})();
`;

test.describe('Gemini assistant', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(initMockSocket);
    await page.addInitScript(initMockMedia);
  });

  test('displays transcript from mocked Gemini stream', async ({ page }) => {
    await page.goto('/');
    await page.click('button[aria-label="Toggle AI Assistant"]');
    await page.getByText('Gemini AI Assistant').waitFor();

    await page.evaluate(() => {
      (window as any).__mockSockets.pushMessage({
        type: 'gemini',
        payload: {
          serverContent: {
            inputTranscription: { text: 'مرحبا', finished: true },
            modelTurn: {
              parts: [{ text: 'Hello from mocked Gemini' }],
            },
          },
        },
      });
    });

    await expect(page.getByText('مرحبا', { exact: false })).toBeVisible();
    await expect(page.getByText('Hello from mocked Gemini', { exact: false })).toBeVisible();
  });
});
