import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { HomeService } from '../../shared/components/home/home-service';
import { Observable, Subject } from 'rxjs';
import { StorageService } from '../../shared/services/core/storage-service';
import { DeviceUsageService } from '../../shared/services/client/device.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { LogApplicationDeviceMeta } from '../../shared/dtos/all.dto';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.page.html',
  providers: [HomeService]
})
export class HomePage implements OnInit, OnDestroy {

  deviceInfo = null;
  showBalanceTrigger: Subject<boolean> = new Subject<boolean>()
  showBtn: boolean = false;
  disableAdverts: boolean = false;
  deferredPrompt;

  constructor(
    private storageService: StorageService,
    private deviceUsageService: DeviceUsageService,
    private deviceService: DeviceDetectorService
  ) {

  }

  ngOnInit() {
    
    this.showBalanceTrigger.next(true);

    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later on the button event.
      this.deferredPrompt = e;

      // Update UI by showing a button to notify the user they can add to home screen
      this.showBtn = true;
    });

    //button click event to show the promt

    window.addEventListener('appinstalled', (event) => {

      this.saveDeviceInfo();
      console.log('App was installed.');
    });

    if (window.matchMedia('(display-mode: standalone)').matches) {
      console.log('display-mode is standalone');
    }
  }

  ngOnDestroy() {
    if (this.showBalanceTrigger)
      this.showBalanceTrigger.unsubscribe()
  }


  addToHome(e) {
    // hide our user interface that shows our button
    // Show the prompt
    this.deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    this.deferredPrompt.userChoice
      .then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the prompt');
        } else {
          console.log('User dismissed the prompt');
        }
        this.deferredPrompt = null;
      });
  };

  doRefresh(refresher?: any) {
    this.showBalanceTrigger.next(true);
    setTimeout(() => {
      console.log('Async refresh has ended');
      refresher.complete();
    }, 3000);
  }

  ionViewWillEnter() {
    console.log('Balance should be showing!');
    this.showBalanceTrigger.next(true);

  }

  ionViewWillLeave() {
    console.log('Elvis left the building!');
    this.showBalanceTrigger.next(false);
  }


  saveDeviceInfo() {

    this.deviceInfo = this.deviceService.getDeviceInfo();
    const isMobile = this.deviceService.isMobile();
    const isTablet = this.deviceService.isTablet();
    const isDesktopDevice = this.deviceService.isDesktop();

    let request = new LogApplicationDeviceMeta();
    request.applicationId = ''; 
    request.browserName = this.deviceInfo.browser;
    request.browserVersion = this.deviceInfo.browser_version;
    request.deviceType = this.deviceInfo.device;
    request.operatingSystem = this.deviceInfo.os;
    request.operatingSystemVersion = this.deviceInfo.os_version;
    request.userAgent = this.deviceInfo.userAgent;
    request.isDesktopDevice = isDesktopDevice;
    request.isMobileDevice = isMobile;
    request.isTabletDevice = isTablet;
    request.isPWA = true;

    this.deviceUsageService.create(request, {}).subscribe(observer => {
      console.log('Device Meta data logged');
    });
  }


}
