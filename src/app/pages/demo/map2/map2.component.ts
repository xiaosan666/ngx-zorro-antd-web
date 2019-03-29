import { Component, OnInit } from '@angular/core';

declare const AMap;

@Component({
  selector: 'app-map2',
  templateUrl: './map2.component.html',
  styleUrls: ['./map2.component.scss']
})
export class Map2Component implements OnInit {

  map: any; // 地图对象
  constructor() {
  }

  ngOnInit() {
    this.loadMap();
  }

  loadMap() {
    AMap.plugin(['AMap.DistrictSearch'], () => {//异步同时加载多个插件
      new AMap.DistrictSearch({
        subdistrict: 1,   //返回下一级行政区
        extensions: 'all',  //返回行政区边界坐标组等具体信息
        level: 'city'  //查询行政级别为 市
      }).search('广州市', (status, result) => {
        var bounds = result.districtList[0].boundaries;
        var mask = [];
        for(var i =0;i<bounds.length;i+=1){
          mask.push([bounds[i]])
        }
        this.map = new AMap.Map('container', {
          mask: mask,
          viewMode: '3D',
          pitch: 40,
          zoom: 10,
          showLabel:false,
          center: [113.478382568, 23.29856015],
          mapStyle: 'amap://styles/darkblue'
        });
        const districtList = result.districtList[0].districtList;
        for (const district of districtList) {
          // 设置光照
          this.map.AmbientLight = new AMap.Lights.AmbientLight([1, 1, 1], 0.5);
          this.map.DirectionLight = new AMap.Lights.DirectionLight([0, 0, 1], [1, 1, 1], 1);

          var object3Dlayer = new AMap.Object3DLayer();
          this.map.add(object3Dlayer);
          new AMap.DistrictSearch({
            subdistrict: 0,   //返回下一级行政区
            extensions: 'all',  //返回行政区边界坐标组等具体信息
            level: 'city'  //查询行政级别为 市
          }).search(district.name, (status, result) => {
            var color = 'rgba(66,146,198,0.6)'; // rgba
            if (district.name === '从化区') {
              color = 'rgba(8,48,107,0.6)';
            }
            if (district.name === '增城区') {
              color = 'rgba(107,174,214,0.6)';
            }
            if (district.name === '花都区') {
              color = 'rgba(107,174,214,0.6)';
            }
            if (district.name === '白云区') {
              color = 'rgba(66,146,198,0.6)';
            }
            if (district.name === '天河区') {
              color = 'rgba(33,113,181,0.6)';
            }
            if (district.name === '荔湾区') {
              color = 'rgba(8,81,156,0.6)';
            }
            if (district.name === '海珠区') {
              color = 'rgba(54,144,192,0.6)';
            }
            if (district.name === '越秀区') {
              color = 'rgba(8,48,107,0.6)';
            }
            var bounds = result.districtList[0].boundaries;
            var height = 10000;
            var prism = new AMap.Object3D.Prism({
              path: bounds,
              height: height,
              color: color
            });

            prism.transparent = true;
            object3Dlayer.add(prism);
          });
        }
      });
    });


  }
}
