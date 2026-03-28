import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ArticlesListService } from '../../features/articles-list/services/articles-list.service';
import { Observable, startWith, Subject, switchMap } from 'rxjs';
import { Article } from '../../types/articles.types';
import { AsyncPipe } from '@angular/common';
import { ArticlePlate } from '../../features/articles-list/ui/article-plate/article-plate';
import { Router } from '@angular/router';

@Component({
  selector: 'app-arcticles-list',
  imports: [AsyncPipe, ArticlePlate],
  templateUrl: './articles-list.html',
  styleUrl: './articles-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArcticlesList {
  private articlesListService = inject(ArticlesListService);
  private router = inject(Router);

  private refresh$ = new Subject();

  articlesList$: Observable<Article[]> = this.refresh$.pipe(
    startWith(null),
    switchMap(() => this.articlesListService.getList()),
  );

  deleteArticle(uuId: string) {
    this.articlesListService.delete(uuId);
    this.refresh$.next(true)
  }

  updateArticle(uuId: string) {
    this.router.navigate([`/update`, uuId]);
  }

  createArticle() {
    this.router.navigate(['/create']);
  }
}
