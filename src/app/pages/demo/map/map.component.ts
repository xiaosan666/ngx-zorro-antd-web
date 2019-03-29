import { Component, OnInit } from '@angular/core';

declare const AMap;
declare const AMapUI;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  map: any; // 地图对象
  tipMarker;
  districtExplorer;
  guangzhouAreaNode; // 当前聚焦的区域
  constructor() {
  }

  ngOnInit() {
    setTimeout(() => {
      this.loadMap();
    }, 1000);
  }


  loadMap() {
    this.map = new AMap.Map('container', {
      zoom: 10,
      doubleClickZoom: false,
      center: [114.021513, 22.662509],
      features: ['bg', 'point'],
      mapStyle: 'amap://styles/darkblue'
    });
    this.map.on('complete', () => {
      // this.map.setLimitBounds(new AMap.Bounds([113.596151, 23.357358], [113.995123, 23.992595]));
      AMapUI.loadUI(['geo/DistrictExplorer'], DistrictExplorer => {
        this.districtExplorer = new DistrictExplorer({
          eventSupport: true, //打开事件支持
          map: this.map //关联的地图实例
        });

        this.tipMarker = new AMap.Marker({
          offset: new AMap.Pixel(0, 0),
          bubble: true
        });

        this.loadArea();

        //监听feature的hover事件
        this.districtExplorer.on('featureMouseout featureMouseover', (e, feature) => {
          this.toggleHoverFeature(feature, e.type === 'featureMouseover', e.originalEvent ? e.originalEvent.lnglat : null);
        });

        //监听鼠标在feature上滑动
        this.districtExplorer.on('featureMousemove', (e, feature) => {
          //更新提示位置
          this.tipMarker.setPosition(e.originalEvent.lnglat);
        });

        //feature被点击
        this.districtExplorer.on('featureClick', (e, feature) => {
          this.renderDistrict(feature);
        });

        //外部区域被点击
        this.districtExplorer.on('outsideClick', e => {
          this.map.setZoom(9);
          setTimeout(() => {
            this.renderGuangzhou();
          }, 300);
        });

      });
    });

  }

  loadArea() {
    // 加载全国和广州市，全国的节点包含省级 https://lbs.amap.com/api/amap-ui/demos/amap-ui-districtexplorer/reverse
    this.districtExplorer.loadMultiAreaNodes([100000, 440100], (error, areaNodes) => {
      if (error) {
        console.error(error);
        return;
      }

      const countryNode = areaNodes[0];
      const cityNode = areaNodes[1];
      const path = [];

      this.guangzhouAreaNode = cityNode;
      const gz = cityNode.getParentFeature();
      const sub = cityNode.getSubFeatures();
      // console.log(JSON.stringify(gz));
      console.log(JSON.stringify(sub));
      debugger;
      this.districtExplorer.setAreaNodesForLocating(cityNode);
      this.renderGuangzhou(); // 广州渲染各区域

      //首先放置背景区域，这里是大陆的边界
      path.push(this.getLongestRing(countryNode.getParentFeature()));
      // 广州市边界
      path.push.apply(path, this.getAllRings(cityNode.getParentFeature()));

      // 大陆边界和广州市边界绘制多边形 https://lbs.amap.com/api/javascript-api/reference/overlay#Polygon
      new AMap.Polygon({
        map: this.map,
        zIndex: 1,
        bubble: true,
        lineJoin: 'round',
        strokeOpacity: 0, //线透明度
        fillColor: '#000', //填充色
        fillOpacity: 0.9, //填充透明度
        path: path
      });
    });
  }

  renderGuangzhou() {
    //清除已有的绘制内容
    this.districtExplorer.clearFeaturePolygons();

    //绘制子级区划
    this.districtExplorer.renderSubFeatures(this.guangzhouAreaNode, (feature, i) => {
      return {
        cursor: 'pointer',
        bubble: true,
        strokeColor: '#87D2FF', //线颜色
        strokeOpacity: 1, //线透明度
        strokeWeight: 1, //线宽
        fillColor: '#000', //填充色
        fillOpacity: 0.5 //填充透明度
      };
    });

    //绘制父级区划
    this.districtExplorer.renderParentFeature(this.guangzhouAreaNode, {
      cursor: 'default',
      bubble: true,
      strokeColor: '#87D2FF', //线颜色
      strokeOpacity: 1, //线透明度
      strokeWeight: 1, //线宽
      fillColor: null
    });
    //更新地图视野以适合区划面
    this.map.setFitView(this.districtExplorer.getAllFeaturePolygons());
  }

  renderDistrict(feature) {
    //清除已有的绘制内容
    this.districtExplorer.clearFeaturePolygons();
    this.districtExplorer.renderFeature(feature, {
      cursor: 'pointer',
      bubble: true,
      strokeColor: '#87D2FF', //线颜色
      strokeOpacity: 1, //线透明度
      strokeWeight: 3, //线宽
      fillColor: null
    });
    //更新地图视野以适合区划面
    this.map.setFitView(this.districtExplorer.getAllFeaturePolygons());
  }

  //根据Hover状态设置相关样式
  toggleHoverFeature(feature, isHover, position) {
    this.tipMarker.setMap(isHover ? this.map : null);
    if (!feature) {
      return;
    }
    const props = feature.properties;
    if (isHover) {
      //更新提示内容
      this.tipMarker.setContent(`<div class="marker1">${props.name}<span>${Math.floor(Math.random() * 200)}</span></div>`,);
      //更新位置
      this.tipMarker.setPosition(position || props.center);
    }
    //更新相关多边形的样式
    const polys = this.districtExplorer.findFeaturePolygonsByAdcode(props.adcode);
    for (let i = 0, len = polys.length; i < len; i++) {
      polys[i].setOptions({
        fillOpacity: isHover ? 0 : 0.5,
        strokeWeight: isHover ? 3 : 1
      });
    }
  }

  getAllRings(feature) {
    const coords = feature.geometry.coordinates;
    const rings = [];
    for (let i = 0, len = coords.length; i < len; i++) {
      rings.push(coords[i][0]);
    }
    return rings;
  }

  getLongestRing(feature) {
    const rings = this.getAllRings(feature);
    rings.sort(function (a, b) {
      return b.length - a.length;
    });
    return rings[0];
  }
}
