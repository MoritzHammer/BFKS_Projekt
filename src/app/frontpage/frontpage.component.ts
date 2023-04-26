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
    
  autocompletionField = new FormControl('');

  languagesTo: string[] = this.getLanguages();
  selectedLanguageTo = "";
  languagesFrom: string[] = this.getLanguages();
  selectedLanguageFrom = "";

  wordFromPons = true;
  allInfoProvided = false;

  listHeader = "Translation";
  responses: string[] = [];
  dataBaseResponses: string[] = this.getDatabaseResponseWords();
  autocompletion = this.dataBaseResponses;

    filteredOptions!: Observable<string[]>;
  
    ngOnInit() {
      this.filteredOptions = this.autocompletionField.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value || '')),
      );
    }
  
    private _filter(value: string): string[] {
      const filterValue = value.toLowerCase();
      this.checkAllInfo();
      return this.autocompletion.filter(option => option.toLowerCase().includes(filterValue));
    }

  getLanguages(): string[] {
      //TODO: Get available language options
      let languages = ["German", "English"];
      return languages;
    }

  getDatabaseResponseWords(): string[] {
      //TODO: Parse database response and get relevant info
    let words: string[] = ["Word 1", "Word 2", "Word 2", "Test", "Lukas", "Moritz", "David"];
    return words;
  }

  checkAllInfo() {
    if (this.autocompletionField.value != "" && this.selectedLanguageFrom != "" && this.selectedLanguageTo != "") this.allInfoProvided = true;
  }

  send() {
    if (this.doIWantAnApiRequest()) {
      console.log(this.dataBaseResponses);
      this.Api();
    }
    else this.responses = this.dataBaseResponses;
      this.listHeader = "Translation of '" + this.autocompletionField.value + "' in " + this.selectedLanguageTo + ":";
  }

  clear() {
    this.allInfoProvided = false;
    this.selectedLanguageFrom = "";
    this.selectedLanguageTo = "";
    this.autocompletionField.setValue("");
  }

  doIWantAnApiRequest(): boolean {
    if (this.dataBaseResponses.includes(this.autocompletionField.value || '')) {
      return false;
    }
    return true;
  }

  Api() {
      //TODO: Send all parameters to the api
      //TODO: Parse api response and get relevant info
  }
}
