import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TextEditor } from '../../features/shared/ui/text-editor/text-editor';
import { LocalStorageService } from '../../services/localStorage.service';
import { OutputArticleData } from '../../types/articles.types';
import { ArticlesCreateService } from '../../features/articles-create/services/articles-create.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-article-',
  imports: [FormsModule, TextEditor],
  templateUrl: './create-article.html',
  styleUrl: './create-article.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateArticle {
  private articlesCreateService = inject(ArticlesCreateService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  public saveArticle(data: OutputArticleData) {
    this.articlesCreateService
      .createArticle(data)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((val) => {
        alert(val.text);
        this.router.navigate(['/']);
      });
  }
}
