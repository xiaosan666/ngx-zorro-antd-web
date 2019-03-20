import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  isCollapsed = false;

  constructor(public router: Router) {
  }

  ngOnInit() {
  }

  click() {
    this.router.navigateByUrl('/demo');
  }

}
