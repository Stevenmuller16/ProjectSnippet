import { Component } from '@angular/core'
import { AAAStore } from 'src/app/store/root-reducer'
import { Store, select } from '@ngrx/store'
import { Observable, timer, combineLatest } from 'rxjs'
import { selectActiveCallStatus, selectCallsStatusesData } from '../calls-statuses/call-status.selectors'
import { map, filter } from 'rxjs/operators'
import { CallStatus, CALL_STATUS_CODES } from '../calls.types'
import { hourToDate } from 'src/app/shared/utils/datetime'
import { setActiveCallStatus } from '../calls-statuses/call-status.actions'

const ETA_UPDATE_INTERVAL = 60_000

@Component({
  selector: 'app-arrival-time-summary',
  templateUrl: './arrival-time-summary.component.html',
  styleUrls: ['./arrival-time-summary.component.scss']
})
export class ArrivalTimeSummaryComponent {
  etaTimer = timer(0, ETA_UPDATE_INTERVAL)

  constructor(private store$: Store<AAAStore>) { }

  call$: Observable<CallStatus> = this.store$.pipe(
    select(selectActiveCallStatus),
    filter(status => !!status)
  )

  requests$: Observable<CallStatus[]> = this.store$.pipe(
    select(selectCallsStatusesData),
    map(data => Object.keys(data).map(key => data[key]))
  )

  statusMessage$: Observable<string> = this.call$.pipe(
    map(({ callStatus }) => {
      switch (callStatus) {
        case CALL_STATUS_CODES.OL:
        case CALL_STATUS_CODES.OS:
          return 'ARRIVED'
        case CALL_STATUS_CODES.ER:
          return 'EN ROUTE'
        case CALL_STATUS_CODES.UT:
        case CALL_STATUS_CODES.TW:
          return 'TOWING'
        case CALL_STATUS_CODES.NEW:
        default:
          return 'REQUEST RECEIVED'
      }
    })
  )

  displayTime$: Observable<boolean> = this.call$.pipe(
    map(({ callStatus, pta }) => {
      if (!pta) {
        return false
      }

      return this.shouldDisplayTime(callStatus)
    })
  )

  displayArrival$: Observable<boolean> = this.call$.pipe(
    map(({ callStatus }) =>
      this.shouldDisplayTime(callStatus)
    )
  )

  eta$: Observable<Date> = this.call$.pipe(
    map(({ pta, driverData }) => {
      let eta = new Date(pta)
      if (driverData && driverData.eta) {
        eta = hourToDate(driverData.eta)
      }

      return eta
    })
  )

  minutesRemaining$: Observable<number | string> = combineLatest([
    this.eta$,
    this.etaTimer
  ]).pipe(
    map(([eta, _]: [Date, never]) => {
      if (!eta) {
        return null
      }

      const now = new Date()
      const differenceMinutes = (+eta - +now) / 60000
      return parseInt(differenceMinutes.toString(), 10)
    })
  )

  shouldDisplayTime(callStatus) {
      switch (callStatus) {
        case CALL_STATUS_CODES.OL:
        case CALL_STATUS_CODES.OS:
        case CALL_STATUS_CODES.UT:
        case CALL_STATUS_CODES.TW:
          return false
        default:
          return true
      }
  }


  requestSelected(request: CallStatus) {
    if (request) {
      this.store$.dispatch(
        setActiveCallStatus({ payload: { id: request.callId } })
      )
    }
  }
}
