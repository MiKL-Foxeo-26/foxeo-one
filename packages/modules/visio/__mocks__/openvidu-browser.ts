// Stub for openvidu-browser — used by Vitest to resolve the module in test environment
// Real OpenVidu browser SDK is loaded at runtime in production (browser only)

export class OpenVidu {
  initSession() {
    return {
      connect: () => Promise.resolve(),
      disconnect: () => {},
      on: () => {},
      off: () => {},
      publish: () => {},
      subscribe: () => ({}),
    }
  }

  async initPublisherAsync(_targetElement: unknown, _properties?: unknown) {
    return {
      stream: { streamId: 'stub-publisher' },
      publishAudio: () => {},
      publishVideo: () => {},
      createVideoElement: () => {},
      replaceTrack: () => Promise.resolve(),
    }
  }
}

export class Session {}
export class Publisher {}
export class StreamManager {}
export class Connection {}
