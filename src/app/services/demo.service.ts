import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DemoService {

  constructor() {
  }

  getUsersPage(pageIndex, pageSize) {
    const page = {
      total: 88,
      users: []
    };
    for (let i = 0; i < pageSize; i++) {
      const no = Math.floor(Math.random() * 100);
      page.users.push({
        id: (pageIndex - 1) * pageSize + i + 1,
        name: '张三' + no,
        age: no,
        sex: i % 3 === 0 ? 2 : 1,
        birthday: new Date(new Date().setDate(no)),
        address: '广电科技大厦' + no + '楼'
      })
    }
    return of(page).pipe(
      delay(100)
    );
  }
}
