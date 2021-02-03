import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RespuestaTopHeadlines } from '../interfaces/interfaces';
import { environment } from 'src/environments/environment';

const apiKey = environment.apiKey;
const apiUrl = environment.apiUrl;

const headers = new HttpHeaders({
  'X-Api-key': apiKey
});

@Injectable({
  providedIn: 'root'
})
export class NoticiasService {

  headlinesPage = 0;

  categoriaActual = '';
  categoriaPage = 0;

  constructor(private http: HttpClient) { }

  private ejecutarQuery<T>(query: string) {
    query = apiUrl + query;
    return this.http.get<T>(query, { headers });
  }

  getTopHeadlines() {
    this.headlinesPage++;
    return this.ejecutarQuery<RespuestaTopHeadlines>('/top-headlines?country=us&page=' + this.headlinesPage);
    // tslint:disable-next-line: max-line-length
    // return this.http.get<RespuestaTopHeadlines>('http://newsapi.org/v2/top-headlines?q=apple&from=2020-07-07&to=2020-07-07&sortBy=popularity&apiKey=92c126547f9f43ba8495c5ff586533ed');
  }

  getTopHeadlinesCategoria(categoria: string) {
    if (this.categoriaActual === categoria) {
      this.categoriaPage++;
    } else {
      this.categoriaPage = 1;
      this.categoriaActual = categoria;
    }
    return this.ejecutarQuery<RespuestaTopHeadlines>('/top-headlines?country=us&category=' + categoria + '&page=' + this.categoriaPage);
    // tslint:disable-next-line: max-line-length
    // return this.http.get<RespuestaTopHeadlines>('http://newsapi.org/v2/top-headlines?q=apple&from=2020-07-07&to=2020-07-07&sortBy=popularity&apiKey=92c126547f9f43ba8495c5ff586533ed');
  }
}
