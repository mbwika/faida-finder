// Minimal File polyfill for Node <20 to satisfy libraries (like undici)
// This provides enough shape for runtime checks. It is intentionally small
// and only used when running on older Node versions. Prefer upgrading to
// Node >=20 in production where the real Web File API exists.

type FileInit = { type?: string; lastModified?: number };

export class File {
  readonly name: string;
  readonly size: number;
  readonly type: string;
  readonly lastModified: number;

  constructor(
    parts: Array<Uint8Array | string> | undefined,
    name: string,
    options?: FileInit,
  ) {
    this.name = name;
    this.type = options?.type ?? '';
    this.lastModified = options?.lastModified ?? Date.now();
    let size = 0;
    if (parts && Array.isArray(parts)) {
      for (const p of parts) {
        if (typeof p === 'string') size += Buffer.byteLength(p);
        else if (p instanceof Uint8Array) size += p.byteLength;
        // other kinds (Stream, Blob, Buffer) are conservatively treated as 0
      }
    }
    this.size = size;
  }

  // lightweight helpers
  arrayBuffer(): Promise<ArrayBuffer> {
    return Promise.resolve(new ArrayBuffer(this.size));
  }

  text(): Promise<string> {
    return Promise.resolve('');
  }
}

// Attach to global if not present (use unknown -> Record to avoid unsafe any access)
const g = globalThis as unknown as Record<string, unknown>;
if (typeof g['File'] === 'undefined') {
  g['File'] = File;
}
