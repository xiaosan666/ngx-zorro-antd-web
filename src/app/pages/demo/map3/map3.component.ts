import { Component, OnInit } from '@angular/core';

declare const AMap;

@Component({
  selector: 'app-map3',
  templateUrl: './map3.component.html',
  styleUrls: ['./map3.component.scss']
})
export class Map3Component implements OnInit {
  map: any; // 地图对象
  constructor() {
  }

  ngOnInit() {
    this.loadMap();

  }

  loadMap() {
    var points = [
      new AMap.LngLat(108.939621, 34.343147),
      new AMap.LngLat(110.249667, 31.042108),
      new AMap.LngLat(111.713673, 27.146961),
      new AMap.LngLat(113.264385, 23.129112)
    ];

    this.map = new AMap.Map('container', {
      zoom: 6,
      pitch: 50,
      rotation: -30,
      viewMode: '3D',
      zooms: [4, 18],
      center: [111.747314, 27.109328],
      mapStyle: 'amap://styles/whitesmoke'
    });

    var object3Dlayer = new AMap.Object3DLayer();
    var numberOfPoints = 180;
    var minHeight = 20;

    var meshLine = new AMap.Object3D.MeshLine({
      path: this.computeBezier(points, numberOfPoints),
      height: this.getEllipseHeight(numberOfPoints, 2000000, minHeight),
      color: 'rgba(55,129,240, 0.7)',
      width: 20
    });

    meshLine.transparent = true;
    object3Dlayer.add(meshLine);
    meshLine['backOrFront'] = 'both';
    this.map.add(object3Dlayer);

  }


  pointOnCubicBezier(cp, t) {
    var ax, bx, cx;
    var ay, by, cy;
    var tSquared, tCubed;

    cx = 3.0 * (cp[1].lng - cp[0].lng);
    bx = 3.0 * (cp[2].lng - cp[1].lng) - cx;
    ax = cp[3].lng - cp[0].lng - cx - bx;

    cy = 3.0 * (cp[1].lat - cp[0].lat);
    by = 3.0 * (cp[2].lat - cp[1].lat) - cy;
    ay = cp[3].lat - cp[0].lat - cy - by;

    tSquared = t * t;
    tCubed = tSquared * t;

    var lng = (ax * tCubed) + (bx * tSquared) + (cx * t) + cp[0].lng;
    var lat = (ay * tCubed) + (by * tSquared) + (cy * t) + cp[0].lat;

    return new AMap.LngLat(lng, lat);
  }

  computeBezier(points, numberOfPoints) {
    var dt;
    var i;
    var curve = [];

    dt = 1.0 / (numberOfPoints - 1);

    for (i = 0; i < numberOfPoints; i++) {
      curve[i] = this.pointOnCubicBezier(points, i * dt);
    }

    return curve;
  }

  getEllipseHeight(count, maxHeight, minHeight) {
    var height = [];
    var radionUnit = Math.PI / 180;

    for (var i = 0; i < count; i++) {
      var radion = i * radionUnit;

      height.push(minHeight + Math.sin(radion) * maxHeight);
    }

    return height;
  }
}
