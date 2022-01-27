import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomePage } from './home.page';
import { IonicPageModule } from 'ionic-angular';
import { IonicPipesModule } from '../../shared/pipes/ionic-pipes.module';
import { HomeLayoutModule } from '../../shared/components/home/layout/home-layout.module';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [HomePage],
  imports: [
    IonicPipesModule,
    IonicPageModule.forChild(HomePage),
    HomeLayoutModule,
    SharedModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomePageModule { }
