import { Component, OnInit } from '@angular/core';
import { DemoService } from '../../../services/demo.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

  table = {
    total: 0,
    data: [],
    pageIndex: 1,
    pageSize: 10,
    loading: true,
    mapOfCheckedId: {},
    listOfCheckedData: [],
    numberOfChecked: 0,
    isAllDataChecked: false,
    isIndeterminate: false
  };


  constructor(public demoService: DemoService) {
  }

  ngOnInit() {
    this.searchData();
  }

  searchData(reset: boolean = false): void {
    if (reset) {
      this.table.pageIndex = 1;
    }
    this.table.loading = true;
    this.demoService.getUsersPage(this.table.pageIndex, this.table.pageSize).subscribe(res => {
      this.table.loading = false;
      this.table.total = res.total;
      this.table.data = res.users;
      this.refreshStatus();
    })
  }

  check(value: boolean, checkData: any[]): void {
    checkData.forEach(item => this.table.mapOfCheckedId[item.id] = value);
    const hash = {};
    this.table.listOfCheckedData = this.table.listOfCheckedData
      .concat(checkData)
      .filter(item => this.table.mapOfCheckedId[item.id])
      .reduce((items, item) => {
        if (!hash[item.id]) {
          hash[item.id] = true;
          items.push(item);
        }
        return items;
      }, []);
    this.refreshStatus();
  }

  refreshStatus() {
    this.table.isAllDataChecked = this.table.data.every(item => this.table.mapOfCheckedId[item.id]);
    this.table.isIndeterminate = !this.table.isAllDataChecked && this.table.data.some(item => this.table.mapOfCheckedId[item.id]);
    this.table.numberOfChecked = this.table.listOfCheckedData.length;
  }

  operateData(): void {
    this.searchData(true);
    this.table.listOfCheckedData = [];
    this.table.mapOfCheckedId = {};
  }

}
