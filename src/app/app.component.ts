import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  
sprachen: String[];

  constructor(private http: HttpClient){
    
    this.http.get<any>("http://localhost:3000/request").subscribe((result) => {
      console.log(result);
    })
  }






}
