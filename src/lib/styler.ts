import { type Scale, scale } from 'chroma-js'
import type { TrackPoint } from '../api/types'

export const ScaleDefault = scale(['#66b900', '#3887fb', '#f15600']).mode('lch')

export const ScaleBlueGreenYellow = scale(['#4780e9', '#30b222', '#ffc700']).mode('lch')

export const ColorScales: Record<string, Scale> = {
  Default: ScaleDefault,
  'Blue-Green-Yellow': ScaleBlueGreenYellow
}

export interface StylingOption {
  stylingProp: keyof TrackPoint
  propDisplayName: string
  minValue: number
  maxValue: number
  defaultMin: number
  defaultMax: number
  units: string
  colorScaleName: string
}

export const trackStylingOptions: StylingOption[] = [
  {
    stylingProp: 'alt_amsl',
    propDisplayName: 'Altitude AMSL',
    minValue: 0,
    maxValue: 50000,
    defaultMin: 0,
    defaultMax: 40000,
    units: 'ft',
    colorScaleName: 'Default'
  },
  {
    stylingProp: 'alt_agl',
    propDisplayName: 'Altitude AGL',
    minValue: 0,
    maxValue: 50000,
    defaultMin: 0,
    defaultMax: 40000,
    units: 'ft',
    colorScaleName: 'Default'
  },
  {
    stylingProp: 'ias',
    propDisplayName: 'Indicated airspeed',
    minValue: 0,
    maxValue: 800,
    defaultMin: 0,
    defaultMax: 400,
    units: 'kn',
    colorScaleName: 'Default'
  },
  {
    stylingProp: 'tas',
    propDisplayName: 'True airspeed',
    minValue: 0,
    maxValue: 1500,
    defaultMin: 0,
    defaultMax: 600,
    units: 'kn',
    colorScaleName: 'Default'
  },
  {
    stylingProp: 'gs',
    propDisplayName: 'Ground speed',
    minValue: 0,
    maxValue: 1500,
    defaultMin: 0,
    defaultMax: 600,
    units: 'kn',
    colorScaleName: 'Default'
  }
]

export const defaultTrackStyle = trackStylingOptions.find((opt) => opt.stylingProp === 'alt_amsl')!

export function makeStyler(
  choice: StylingOption,
  numLevels = 10,
  dynamicMin = false,
  dynamicMax = true
) {
  const scale = ColorScales[choice.colorScaleName]

  return (data: TrackPoint[]) => {
    const minValue = dynamicMin
      ? Math.min(...data.map((p) => p[choice.stylingProp] as number))
      : choice.minValue
    const maxValue = dynamicMax
      ? Math.max(...data.map((p) => p[choice.stylingProp] as number))
      : choice.maxValue
    const levelSize = (maxValue - minValue) / numLevels
    const maxDistance = Math.max(...data.map((item) => item.distance)) || null

    function getLevel(point: TrackPoint) {
      const value = point[choice.stylingProp]
      const lvl = Math.floor(((value as number) - minValue) / levelSize)
      return lvl > numLevels - 1 ? numLevels - 1 : lvl
    }

    const progress: (string | number)[] = []
    let currLevel = -1

    if (maxDistance) {
      data.forEach((point) => {
        const lvl = getLevel(point)
        if (lvl != currLevel) {
          const prc = point.distance / maxDistance
          if (progress.length && progress[progress.length - 2] === prc) {
            return
          }
          const scalePos = (1 / numLevels) * lvl
          const c = scale(scalePos).rgb()
          const color = `rgb(${c[0]}, ${c[1]}, ${c[2]})`
          progress.push(prc, color)
          currLevel = lvl
        }
      })
    }
    return progress
  }
}
