import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-article-plate',
  imports: [],
  styleUrl: './article-plate.css',
  templateUrl: './article-plate.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticlePlate {
  @Input()
  title: string = '';

  @Input()
  uuId: string = '';

  @Output()
  handlerDelete = new EventEmitter<string>();

  @Output()
  handlerUpdate = new EventEmitter<string>();

  delete() {
    this.handlerDelete.emit(this.uuId);
  }

  update() {
    this.handlerUpdate.emit(this.uuId);
  }
}
