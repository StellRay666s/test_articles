import { Injectable } from '@angular/core';
import { CRUD } from '../types/crud.types';
import { Article } from '../types/articles.types';
import { catchError, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService implements CRUD<Article> {
  private lc = localStorage;

  constructor() {}

  getByUuId(uuId: string): Observable<Article> {
    const articles = this.getArticlesFromStorage();
    const match = articles.find((article) => article.uuId === uuId);
    if (!match) throw `Статья с uuId ${uuId} не найдена`;
    return of(match);
  }

  create(model: Article): Observable<{ text: string }> {
    const articles = this.getArticlesFromStorage();
    articles.push(model);
    this.setListArticlesList(articles);
    return of({ text: 'Статья успешно добавлена' });
  }

  update(model: Article): Observable<{ text: string }> {
    const articles = this.getArticlesFromStorage();
    const updateArticles = articles.map((article) => {
      if (article.uuId === model.uuId) {
        return model;
      }
      return article;
    });
    this.setListArticlesList(updateArticles);
    return of({ text: 'Статья успешно обновлена' });
  }

  delete(uuId: string): Observable<{ text: string }> {
    const articles = this.getArticlesFromStorage().filter((article) => article.uuId !== uuId);
    this.setListArticlesList(articles);
    return of({ text: 'Статья успешно удалена' });
  }

  getAll(): Observable<Article[]> {
    return of(this.getArticlesFromStorage());
  }

  private getArticlesFromStorage(): Article[] {
    return JSON.parse(this.lc.getItem('articles')!);
  }

  private setListArticlesList(articles: Article[]) {
    this.lc.setItem('articles', JSON.stringify(articles));
  }
}
