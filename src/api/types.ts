export interface User {
  id: string
  username: string
  token: string
  email: string
}

export interface TrackPoint {
  lat: number
  lng: number
  hdg_true: number
  alt_amsl: number
  alt_agl: number
  gnd_height: number
  crs: number
  ias: number
  tas: number
  gs: number
  ap_master: boolean
  gear_pct: number
  flaps: number
  on_gnd: boolean
  on_rwy: boolean
  wind_vel: number
  wind_dir: number
  timestamp: number
}

export interface TouchDown {
  lat: number
  lng: number
  bank: number
  hdg_mag: number
  hdg_true: number
  vel_nrm: number
  pitch: number
  timestamp: number
}

export interface Flight {
  flight_id: string
  callsign: string
  departure: string | null
  arrival: string | null
  aircraft: string | null
  created_at: number
  track?: {
    points: TrackPoint[]
    touchdowns: TouchDown[]
  }
}

export interface FlightEvent {
  eventType: string
  eventData?: any
}

export interface StatusResponse<T> {
  data: T
  status: string
}

export interface RuntimeInfo {
  version: string
  arch: string
  max_procs: number
}

export interface AppInfo {
  version: string
  go_runtime: RuntimeInfo
}
