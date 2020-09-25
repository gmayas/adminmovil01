import { Component, OnInit, OnDestroy, OnChanges } from '@angular/core';
import { interval } from 'rxjs';
import { takeWhile } from "rxjs/operators";
import { environment } from 'src/environments/environment';
import { GoogleMap } from '@angular/google-maps';
import { AuthService } from 'src/app/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
//import { UsersService } from 'src/app/services/users.service';
import * as _ from "lodash";
import { async } from '@angular/core/testing';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, OnDestroy, OnChanges {
  // Create an Observable that will publish a value on an interval
  public secondsCounter: any = interval(5000);
  //
  public uluru: any;
  public uluruA: any;
  public map: google.maps.Map
  public infoWindow: google.maps.InfoWindow;
  public isAuth: boolean = false;
  public alive: boolean = true;
  public user: any;
  public Vehicles: any

  constructor(public auth: AuthService, 
    private router: Router, private toastr: ToastrService, private google: GoogleMap) {
    this.user = this.auth.user();
    console.log('this.user.id: ', _.get(this.user.value, 'id'))
   // this.getUserVehicle(null);
   //this.initMap();
  }
  // Initialize and add the map
  initMap() {
    try {
      let pos; String
      // Try HTML5 geolocation.
      console.log('navigator.geolocation', navigator.geolocation)
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          this.uluru = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          console.log(this.uluru)
          this.map = new google.maps.Map(document.getElementById('map') as HTMLElement , {
            center: this.uluru,
            zoom: 5
          });
          this.infoWindow = new google.maps.InfoWindow;
          this.infoWindow.setPosition(this.uluru);
          pos = `Usted esta aqui: ${this.uluru.lat} ,  ${this.uluru.lng}`;
          this.infoWindow.setContent("Usted esta aqui.");
          this.infoWindow.open(this.map);
          this.map.setCenter(this.uluru);
        }, () => {
          this.handleLocationError(true, this.infoWindow, this.map.getCenter());
        });
      } else {
        // Browser doesn't support Geolocation
        this.handleLocationError(false, this.infoWindow, this.map.getCenter());
      }
      
    } catch (e) {
      console.log('initMap: ', e );
    }
  }


  handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
      'Error: The Geolocation service failed.' :
      'Error: Your browser doesn\'t support geolocation.');
    this.handleLocationError(false, this.infoWindow, this.map.getCenter());
    infoWindow.open(this.map);
  }


  ngOnInit() {
    this.initMap()
  }

  ngOnDestroy() {
    this.alive = false;
  }

  ngOnChanges() {
    this.user = this.auth.user();
  }

 
  // Retorna un entero aleatorio entre min (incluido) y max (excluido)
  // ¡Usando Math.round() te dará una distribución no-uniforme!
  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }
}

