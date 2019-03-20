import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from '../index/index.component';

const routes: Routes = [{
  path: '',
  component: MainComponent,
  children: [
    {
      path: '',
      component: IndexComponent
    },
    {
      path: 'demo',
      loadChildren: '../demo/demo.module#DemoModule'
    }
  ]
}];

@NgModule({
  declarations: [MainComponent, IndexComponent],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    NgZorroAntdModule,
    FormsModule
  ]
})
export class MainModule {
}
