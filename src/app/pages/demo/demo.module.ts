import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DemoComponent } from './demo.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FormsModule } from '@angular/forms';
import { TableComponent } from './table/table.component';
import { RouterModule, Routes } from '@angular/router';
import { MapComponent } from './map/map.component';

const routes: Routes = [
  {path: '', component: DemoComponent},
  {path: 'table', component: TableComponent},
  {path: 'map', component: MapComponent}
];

@NgModule({
  declarations: [DemoComponent, TableComponent, MapComponent],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    NgZorroAntdModule,
    FormsModule,
  ]
})
export class DemoModule {
}
