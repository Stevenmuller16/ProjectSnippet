import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { ArrivalTimeSummaryComponent } from './arrival-time-summary.component'
import { provideMockStore } from '@ngrx/store/testing'
import { MockComponent } from 'ng-mocks'
import { MultipleRequestsButtonComponent } from '../multiple-requests-button/multiple-requests-button.component'

describe('ArrivalTimeSummaryComponent', () => {
  let component: ArrivalTimeSummaryComponent
  let fixture: ComponentFixture<ArrivalTimeSummaryComponent>
  const initialState = {
    callsStatuses: {
      data: {
        '1': {
          callStatus: 'ER',
          pta: new Date()
        }
      },
      activeCallStatus: '1'
    }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ArrivalTimeSummaryComponent, MockComponent(MultipleRequestsButtonComponent)],
      providers: [provideMockStore({ initialState })]
    })
      .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ArrivalTimeSummaryComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
