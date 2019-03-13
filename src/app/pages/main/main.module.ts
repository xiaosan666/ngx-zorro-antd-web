import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FormsModule } from '@angular/forms';
import { MainRoutingModule } from './main-routing.module';

@NgModule({
  declarations: [MainComponent],
  imports: [
    CommonModule,
    NgZorroAntdModule,
    FormsModule,
    MainRoutingModule
  ]
})
export class MainModule {
}
