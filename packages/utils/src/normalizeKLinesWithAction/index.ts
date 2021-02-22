import _ from "lodash";
export interface Bar {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}
const getIsHaveDWM = _.memoize((resolution: string = "") =>
  _.some(["D", "W", "M"], (key) => _.includes(resolution, key))
);

export function normalizeKLinesWithAction(
  kLines: string[][] = [],
  action: (kline: Bar) => void = _.noop,
  resolution: string = ""
): Bar[] {
  if (Array.isArray(kLines)) {
    /**
     * 日线 周线  月线 的时候
     * DWM data should have 00:00:00 in time part.
     * https://github.com/tradingview/charting_library/issues/4014#issuecomment-496421832
     */
    const isHaveDWM = getIsHaveDWM(resolution);

    return kLines.map((v) => {
      let d = +v[0] * 1000;
      if (isHaveDWM) {
        const date = new Date(+v[0] * 1000);
        date.setUTCDate(date.getUTCDate() + 1);
        date.setUTCHours(0);
        date.setUTCMinutes(0);
        date.setUTCSeconds(0);
        d = +date;
      }

      const res = {
        time: +d,
        open: +v[1],
        close: +v[2],
        high: +v[3],
        low: +v[4],
        volume: +v[5],
      };
      action(res);
      return res;
    });
  }
  return [];
}
