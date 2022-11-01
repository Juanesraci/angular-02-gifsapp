import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SearchGifsResponse, Gif } from '../interfaces/gifs.interface';

@Injectable({
  providedIn: 'root'
})
export class GifsService {
  private apiKey: string = 'hMe0H8zmdditWNGHDnrDTanS6V7ornKK';
  private serviceUrl: string = 'https://api.giphy.com/v1/gifs'
  private _history: string[] = [];
  public results: Gif[] = [];
  get history() {    
    return [...this._history];
  }
  constructor( private http: HttpClient ) {
    this._history = JSON.parse( localStorage.getItem('history')! ) || [];
    this.results = JSON.parse( localStorage.getItem('results')! ) || [];
  } 
    gifsSearch( query: string ) {
    query = query.trim().toLocaleLowerCase();
    if( !this._history.includes( query ) ) {
      this._history.unshift( query );
      this._history = this._history.splice(0,12);
      localStorage.setItem('history', JSON.stringify(this._history));        
    }  
    const params = new HttpParams().set('api_key', this.apiKey).set('limit', '12').set('q', query);  
    this.http.get<SearchGifsResponse>(`${ this.serviceUrl }/search`, { params: params })
      .subscribe(( resp ) => {
      this.results = resp.data;
      localStorage.setItem('results', JSON.stringify(this.results));
    })
  }  
}
