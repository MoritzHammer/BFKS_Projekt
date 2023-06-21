import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, ObservableInput, throwError } from 'rxjs';
import { catchError, first, map, startWith } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';


interface Word {
  word: string,
  lang: string,
  description: string
}

interface Learning {
  input: string,
  icon: string,
  right: boolean
}

interface LearnWords {
  word: Word,
  learn: Learning
}

interface Language {
  name: string,
  short: string,
  flag: string
}

@Component({
  selector: "frontpage",
  templateUrl: "./frontpage.component.html",
  styleUrls: ["./frontpage.component.scss"],
})
export class Frontpage implements OnInit {
  constructor(private http: HttpClient) { }

  autocompletionField = new FormControl('');

  languagesTo: Language[] = this.getLanguageOptions();
  selectedLanguageTo: Language = this.getNewLanguage();
  selectedLanguageToItem: Language = this.selectedLanguageTo;

  languagesFrom: Language[] = this.getLanguageOptions();
  selectedLanguageFrom: Language = this.getNewLanguage();
  selectedLanguageFromItem: Language = this.selectedLanguageFrom;

  wordFromPons = false;
  allInfoProvided = false;
  languageInfoProvided = false;
  isLearn = false;

  listHeader = "Translation";
  responseWords: Word[] = [];
  response: any;
  dataBaseResponses: string[];
  autocompletion: any;

  learnWords: LearnWords[] = [];

  filteredOptions!: Observable<string[]>;

  ngOnInit() {
    this.dataBaseResponses = this.getSavedWordsForAutocompletion();
    this.autocompletion = this.dataBaseResponses;
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

  getLanguageOptions(): Language[] {
    let languages: Language[] = [
      { name: "German", short: "de", flag: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Flag_of_Germany.svg" },
      { name: "English", short: "en", flag: "https://upload.wikimedia.org/wikipedia/commons/8/83/Flag_of_the_United_Kingdom_%283-5%29.svg" },
      { name: "Spanish", short: "es", flag: "https://upload.wikimedia.org/wikipedia/commons/8/89/Bandera_de_Espa%C3%B1a.svg" },
      { name: "French", short: "fr", flag: "https://upload.wikimedia.org/wikipedia/commons/b/bc/Flag_of_France_%281794%E2%80%931815%2C_1830%E2%80%931974%2C_2020%E2%80%93present%29.svg" },
      { name: "Italian", short: "it", flag: "https://upload.wikimedia.org/wikipedia/commons/0/03/Flag_of_Italy.svg" },
      { name: "Greek", short: "el", flag: "https://upload.wikimedia.org/wikipedia/commons/5/5c/Flag_of_Greece.svg" },
      { name: "Portuguese", short: "pt", flag: "https://upload.wikimedia.org/wikipedia/commons/5/5c/Flag_of_Portugal.svg" },
      { name: "Polish", short: "pl", flag: "https://upload.wikimedia.org/wikipedia/commons/4/42/Flag_of_Poland_%281927%E2%80%931980%29.svg" },
      { name: "Russian", short: "ru", flag: "https://upload.wikimedia.org/wikipedia/commons/f/f3/Flag_of_Russia.svg" },
      { name: "Chinese", short: "zh", flag: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Flag_of_the_People%27s_Republic_of_China.svg" },
      { name: "Turkish", short: "tr", flag: "https://upload.wikimedia.org/wikipedia/commons/b/b4/Flag_of_Turkey.svg" },
      { name: "Slovenian", short: "sl", flag: "https://upload.wikimedia.org/wikipedia/commons/f/f0/Flag_of_Slovenia.svg" }
    ];
    return languages;
  }

  getSavedWordsForAutocompletion() {
    let words: string[] = [];
    this.http.get<any>("http://localhost:3000/autocomplete").subscribe((result) => {
        result.forEach(element => {
        if (!words.includes(element.word)) words.push(element.word);
      });
      this.dataBaseResponses = words;
      
    })
    return words;
  }

  getNewLanguage(): Language {
    let language: Language = {
      name: '',
      short: '',
      flag: ''
    };
    return language;
  }

  checkAllInfo() {
    if (this.autocompletionField.value != "" && this.selectedLanguageFrom.name != '' && this.selectedLanguageTo.name != '') { this.allInfoProvided = true; this.languageInfoProvided = true }
    else if (this.selectedLanguageFrom.name != '' && this.selectedLanguageTo.name != '') this.languageInfoProvided = true;
  }

  buttonLearn() {
    let fromto = "" + this.selectedLanguageFrom.short + this.selectedLanguageTo.short + "";
    this.Api("/lernfeld?l=" + fromto);
    this.listHeader = "Learn " + this.selectedLanguageFrom.name + " to " + this.selectedLanguageTo.name + ":";
    this.selectedLanguageToItem = this.selectedLanguageTo;
    this.selectedLanguageFromItem = this.selectedLanguageFrom;
    this.isLearn = true;
    this.wordFromPons = false;
    this.allInfoProvided = false;
    this.autocompletionField.setValue("");

  }

  buttonSend() {
    this.Api("/request?q=" + this.autocompletionField.value);
    this.listHeader = "Translation of '" + this.autocompletionField.value + "' in " + this.selectedLanguageTo.name + ":";
    this.selectedLanguageToItem = this.selectedLanguageTo;
    this.selectedLanguageFromItem = this.selectedLanguageFrom;
    this.wordFromPons = true;
    this.isLearn = false;
    this.getSavedWordsForAutocompletion();
  }

  buttonClear() {
    this.allInfoProvided = false;
    this.selectedLanguageFrom = this.getNewLanguage();
    this.selectedLanguageTo = this.getNewLanguage();
    this.autocompletionField.setValue("");
  }


  Api(endpoint: string) {
    let fromto = "" + this.selectedLanguageFrom.short + this.selectedLanguageTo.short + "";
    let otherdir = "" + this.selectedLanguageTo.short + this.selectedLanguageFrom.short + "";

    this.http.get<any>("http://localhost:3000" + endpoint + "&language=" + this.selectedLanguageTo.short + "&in=" + this.selectedLanguageFrom.short + "&l=" + fromto)
    .pipe(first()).subscribe(
      (result) => {
        this.response = result;
        this.parsingDecision();
      },
      (error) => {
        this.http.get<any>("http://localhost:3000" + endpoint + "&language=" + this.selectedLanguageTo.short + "&in=" + this.selectedLanguageFrom.short + "&l=" + otherdir)
        .pipe(first()).subscribe(
          (result) => {
            this.response = result;
            this.parsingDecision();
          }
        )
      }
    );
  }

  parsingDecision() {
    if (this.response.origin == "db") {
      this.DataBaseParsing();
      this.wordFromPons = true;
      this.isLearn = false;
    }
    else if (this.response.origin == "pons") {
      this.PonsParsing();
      this.wordFromPons = true;
      this.isLearn = false;
    }
    else {
      this.LearnParsing();
      this.wordFromPons = false;
      this.isLearn = true;
    }
  }

  DataBaseParsing() {
    this.responseWords = [];
    let values = this.response.value;
    values.forEach(element => {
      let word: Word =
      {
        word: element.word,
        lang: element.transdir,
        description: element.target
      }
      this.responseWords.push(word);
    });
  }

  PonsParsing() {
    this.responseWords.length = 0;
    let arabs = this.response.value[0].hits[0].roms[0].arabs;
    arabs.forEach(element => {
      let word: Word =
      {
        word: element.translations[0].source,
        lang: element.translations[0].source,
        description: element.translations[0].target
      }
      this.responseWords.push(word);
    });
  }

  LearnParsing() {
    this.responseWords.length = 0;
    this.learnWords.length = 0;
    let values = this.response;
    values.forEach(element => {
      let word: Word = {
        word: element.word.replaceAll("\\s+", " ").replaceAll(/(<([^>]+)>)/gi, '').trim(),
        lang: "",
        description: element.target.replaceAll("\\s+", " ").replaceAll(/(<([^>]+)>)/gi, '').trim()
      }
      let learn: Learning = {
        input: "",
        icon: "clear",
        right: false
      }
      this.learnWords.push({ word: word, learn: learn });
      this.responseWords.push(word);
    });
    if (this.learnWords.length == 0) this.listHeader = "No data in database. Please search for words in that languages";
  }

  ChangeLearnItem(event: any, item: LearnWords) {
    if (item.word.description.toLowerCase() == item.learn.input.toLowerCase()) {
      item.learn.icon = "done";
      item.learn.right = true;
    }
    else {
      item.learn.icon = "clear";
      item.learn.right = false;
    }
  }

}
