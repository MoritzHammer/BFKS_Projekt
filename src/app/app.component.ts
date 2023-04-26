import { Component } from '@angular/core';
import { first } from 'rxjs';
import { abfrage, endpoints } from 'src/services/Endpoints';
import { RequestHandler } from 'src/services/RequestHandler';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  
sprachen: String[];

  constructor(){
    RequestHandler.handleRequest(abfrage, [["l", "deen"], ["q", "Hallo"]]).pipe(first()).subscribe((x) => {
      console.log(x);
      console.log("Request fertig");
      
      
    })
  }






}
