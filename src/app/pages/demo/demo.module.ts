import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DemoComponent } from './demo.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FormsModule } from '@angular/forms';
import { TableComponent } from './table/table.component';
import { RouterModule, Routes } from '@angular/router';
import { MapComponent } from './map/map.component';
import { Map2Component } from './map2/map2.component';
import { Map3Component } from './map3/map3.component';

const routes: Routes = [
  {path: '', component: DemoComponent},
  {path: 'table', component: TableComponent},
  {path: 'map', component: MapComponent},
  {path: 'map2', component: Map2Component},
  {path: 'map3', component: Map3Component}
];

@NgModule({
  declarations: [DemoComponent, TableComponent, MapComponent, Map2Component, Map3Component],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    NgZorroAntdModule,
    FormsModule,
  ]
})
export class DemoModule {
}
