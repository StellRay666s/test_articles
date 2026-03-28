import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { TextEditor } from '../../features/shared/ui/text-editor/text-editor';
import { OutputArticleData } from '../../types/articles.types';
import { ArticlesUpdateService } from '../../features/articles-update/service/articles-update.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { filter, map, of, shareReplay, switchMap } from 'rxjs';

@Component({
  selector: 'app-update-article',
  imports: [TextEditor, AsyncPipe],
  templateUrl: './update-article.html',
  styleUrl: './update-article.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateArticle {
  private updateArticleService = inject(ArticlesUpdateService);
  private activatedCouter = inject(ActivatedRoute);
  private router = inject(Router)
  private uuId = signal<string>('');

  saveArticle(data: OutputArticleData) {
    return this.updateArticleService.update({ ...data, uuId: this.uuId() }).subscribe((val) => {
      alert(val.text);
      this.router.navigate(['/'])
    });
  }

  getByUuId$ = this.activatedCouter.paramMap.pipe(
    map((query) => {
      this.uuId.set(query.get('uuId') || '');
      return query.get('uuId') || '';
    }),
    switchMap((val) => this.updateArticleService.getByUuId(val)),
  );
}
