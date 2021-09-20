/* eslint-disable node/no-unpublished-import */
import type {RgbaColorObject, RgbColorObject} from '@tweakpane/core';
import type {Point2dObject} from '@tweakpane/core/dist/cjs/input-binding/point-2d/model/point-2d';
import type {Point3dObject} from '@tweakpane/core/dist/cjs/input-binding/point-3d/model/point-3d';
import type {Point4dObject} from '@tweakpane/core/dist/cjs/input-binding/point-4d/model/point-4d';
import type {Tuple} from './types';

// Few workarounds because tweakpane doesn't support tuple types for now

export class ColorWrapper<P extends string> {
  proxyObjectRGB: RgbColorObject;
  proxyObjectRGBA: RgbaColorObject;
  constructor(object: {[V in P]: Tuple<number, 4>}, name: P) {
    const color = object[name];
    this.proxyObjectRGB = {
      get r() {
        return color[0];
      },
      get g() {
        return color[1];
      },
      get b() {
        return color[2];
      },
      set r(v: number) {
        color[0] = v;
      },
      set g(v: number) {
        color[1] = v;
      },
      set b(v: number) {
        color[2] = v;
      },
    };
    this.proxyObjectRGBA = {
      ...this.proxyObjectRGB,
      get a() {
        return color[3];
      },
      set a(v: number) {
        color[3] = v;
      },
    };
  }
  get rgb(): RgbColorObject {
    return this.proxyObjectRGB;
  }
  get rgba(): RgbaColorObject {
    return this.proxyObjectRGBA;
  }
}

export class NormalizedColorWrapper<P extends string> {
  proxyObjectRGB: RgbColorObject;
  proxyObjectRGBA: RgbaColorObject;
  constructor(object: {[V in P]: Tuple<number, 4>}, name: P) {
    const color = object[name];
    this.proxyObjectRGB = {
      get r() {
        return color[0] * 255;
      },
      get g() {
        return color[1] * 255;
      },
      get b() {
        return color[2] * 255;
      },
      set r(v: number) {
        color[0] = v / 255;
      },
      set g(v: number) {
        color[1] = v / 255;
      },
      set b(v: number) {
        color[2] = v / 255;
      },
    };
    this.proxyObjectRGBA = {
      ...this.proxyObjectRGB,
      get a() {
        return color[3];
      },
      set a(v: number) {
        color[3] = v;
      },
    };
  }
  get rgb(): RgbColorObject {
    return this.proxyObjectRGB;
  }
  get rgba(): RgbaColorObject {
    return this.proxyObjectRGBA;
  }
}

export class VectorWrapper<P extends string> {
  proxyObject2D: Point2dObject;
  proxyObject3D: Point3dObject;
  proxyObject4D: Point4dObject;
  constructor(object: {[V in P]: number[]}, name: P) {
    const point = object[name];
    this.proxyObject2D = {
      get x() {
        return point[0];
      },
      get y() {
        return point[1];
      },
      set x(v: number) {
        point[0] = v;
      },
      set y(v: number) {
        point[1] = v;
      },
    };
    this.proxyObject3D = {
      ...this.proxyObject2D,
      get z() {
        return point[2];
      },
      set z(v: number) {
        point[2] = v;
      },
    };
    this.proxyObject4D = {
      ...this.proxyObject3D,
      get w() {
        return point[3];
      },
      set w(v: number) {
        point[3] = v;
      },
    };
  }
  get xy(): Point2dObject {
    return this.proxyObject2D;
  }
  get xyz(): Point3dObject {
    return this.proxyObject3D;
  }
  get xyzw(): Point4dObject {
    return this.proxyObject4D;
  }
}
