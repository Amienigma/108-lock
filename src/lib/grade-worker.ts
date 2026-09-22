import { applyGrade } from "./grade";
import type { GradeParams } from "./lock-constants";

type Msg = {
  id: number;
  width: number;
  height: number;
  buffer: ArrayBuffer;
  params: GradeParams;
};

self.onmessage = (e: MessageEvent<Msg>) => {
  const { id, width, height, buffer, params } = e.data;
  const src = new ImageData(new Uint8ClampedArray(buffer), width, height);
  const out = applyGrade(src, params);
  const buf = out.data.buffer;
  (self as unknown as Worker).postMessage({ id, width, height, buffer: buf }, [buf]);
};
