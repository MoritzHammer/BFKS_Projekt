import {Component, OnInit} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

interface Word {
  word: string,
  lang: string,
}

@Component({
    selector: "frontpage",
    templateUrl: "./frontpage.component.html",
    styleUrls: ["./frontpage.component.scss"],
  })
  export class Frontpage implements OnInit{
    
    myControl = new FormControl('');
    options: string[] = this.getSavedWords();
    languages: string[] = ["Deutsch", "Englisch"];
    filteredOptions!: Observable<string[]>;
  
    ngOnInit() {
      this.filteredOptions = this.myControl.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value || '')),
      );
    }
  
    private _filter(value: string): string[] {
      const filterValue = value.toLowerCase();
  
      return this.options.filter(option => option.toLowerCase().includes(filterValue));
    }

    getSavedWords(): string[]{
      let saved: string[] = ["Test", "Lukas", "Moritz", "David"];
      return saved;
    }

    send(){
      
    }
}